"""
ComplyAI Backend - Analyze Router

Exposes the POST /analyze endpoint, which accepts a company policy PDF and
a regulation PDF, validates and saves them, extracts their text content,
and runs an AI-powered compliance gap analysis via the Gemini service.
"""

import logging
from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status

from services.pdf_services import extract_text_from_pdf
from services.gemini_service import GeminiServiceError, analyze_compliance
from services.pdf_generator import generate_improved_policy_pdf, generate_audit_report_pdf

# ---------------------------------------------------------------------------
# Logging & Router Setup
# ---------------------------------------------------------------------------
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/analyze", tags=["Analyze"])

# ---------------------------------------------------------------------------
# Validation & Configuration Constants
# ---------------------------------------------------------------------------
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB limit per file
ALLOWED_CONTENT_TYPE = "application/pdf"
ALLOWED_EXTENSION = ".pdf"
CHUNK_SIZE = 1024 * 1024  # 1 MB read/write buffer

# backend/uploads
BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"


def _validate_pdf(file: UploadFile, field_name: str) -> None:
    """
    Validate that an uploaded file is a non-empty PDF, based on its
    filename extension and declared content-type.

    Args:
        file (UploadFile): The uploaded file to validate.
        field_name (str): Human-readable field name, used in error messages.

    Raises:
        HTTPException: 400 if the file extension or content-type is invalid.
    """
    filename = file.filename or ""

    if not filename.lower().endswith(ALLOWED_EXTENSION):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file extension for '{field_name}'. Only PDF files (.pdf) are allowed.",
        )

    if file.content_type and "pdf" not in file.content_type.lower() and file.content_type != "application/octet-stream":
        logger.warning(f"Non-standard content-type for '{field_name}': {file.content_type}, proceeding based on .pdf extension.")



async def _save_pdf_file(file: UploadFile, destination: Path) -> None:
    """
    Asynchronously stream an uploaded file to disk while enforcing the
    maximum allowed file size. Cleans up any partially written file if
    the size limit is exceeded or an unexpected error occurs.

    Args:
        file (UploadFile): The uploaded file to save.
        destination (Path): Target path to write the file to.

    Raises:
        HTTPException: 400 if the file is empty or exceeds the size limit,
            500 if an unexpected I/O error occurs.
    """
    bytes_written = 0

    try:
        with destination.open("wb") as buffer:
            while chunk := await file.read(CHUNK_SIZE):
                bytes_written += len(chunk)

                if bytes_written > MAX_FILE_SIZE_BYTES:
                    buffer.close()
                    destination.unlink(missing_ok=True)
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"File '{file.filename}' exceeds maximum allowed size of 10 MB.",
                    )

                buffer.write(chunk)

        if bytes_written == 0:
            destination.unlink(missing_ok=True)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File '{file.filename}' is empty.",
            )

    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Error saving file '{file.filename}': {exc}", exc_info=True)
        destination.unlink(missing_ok=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save uploaded file '{file.filename}' due to a server error.",
        )


@router.post(
    "",
    summary="Analyze company policy against a regulation",
    status_code=status.HTTP_200_OK,
)
@router.post("/", include_in_schema=False)
async def analyze_documents(
    company_policy: UploadFile = File(..., description="Company policy PDF document"),
    regulation_document: UploadFile = File(..., description="Regulation PDF document"),
    company_name: str = Form(default="Corporate Client"),
    industry: str = Form(default="General Industry"),
    headquarters_country: str = Form(default="United States"),
    expansion_country: str = Form(default="United States"),
    state: str = Form(default=""),
    company_size: str = Form(default=""),
    compliance_framework: str = Form(default=""),
    risk_appetite: str = Form(default=""),
    audit_year: str = Form(default=""),
) -> dict:
    """
    Accept a company policy PDF and a regulation PDF, validate and save
    them, extract their text, run an AI compliance gap analysis, and generate PDF documents.
    """
    # --- 1. Validate both uploads are PDFs ----------------------------------
    _validate_pdf(company_policy, "company_policy")
    _validate_pdf(regulation_document, "regulation_document")

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    company_filename = Path(company_policy.filename).name
    regulation_filename = Path(regulation_document.filename).name

    company_path = UPLOAD_DIR / company_filename
    regulation_path = UPLOAD_DIR / regulation_filename

    # --- 2. Save both files to disk -----------------------------------------
    await _save_pdf_file(company_policy, company_path)
    await _save_pdf_file(regulation_document, regulation_path)

    # --- 3. Extract text from both PDFs -------------------------------------
    try:
        company_text = extract_text_from_pdf(str(company_path))
        regulation_text = extract_text_from_pdf(str(regulation_path))
    except FileNotFoundError as exc:
        logger.error(f"File missing during text extraction: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Uploaded file could not be located for text extraction.",
        ) from exc
    except ValueError as exc:
        logger.warning(f"PDF text extraction failed: {exc}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to extract text from PDF: {exc}",
        ) from exc

    # --- 4. Run AI compliance analysis --------------------------------------
    try:
        analysis_result = analyze_compliance(company_text, regulation_text)
    except GeminiServiceError as exc:
        logger.error(f"Gemini analysis failed: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI compliance analysis failed: {exc}",
        ) from exc
    except ValueError as exc:
        logger.warning(f"Invalid input passed to Gemini analysis: {exc}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        ) from exc

    # --- 5. Generate PDF Reports --------------------------------------------
    org_data = {
        "companyName": company_name,
        "industry": industry,
        "headquartersCountry": headquarters_country,
        "expansionCountry": expansion_country,
        "state": state,
        "companySize": company_size,
        "complianceFrameworks": compliance_framework,
        "riskAppetite": risk_appetite,
        "auditYear": audit_year,
    }

    try:
        policy_pdf_url = generate_improved_policy_pdf(analysis_result, org_data)
        audit_report_url = generate_audit_report_pdf(analysis_result, org_data)
    except Exception as pdf_exc:
        logger.error(f"Failed to generate PDF reports: {pdf_exc}", exc_info=True)
        policy_pdf_url = ""
        audit_report_url = ""

    analysis_result["policy_pdf_url"] = policy_pdf_url
    analysis_result["audit_report_url"] = audit_report_url

    # --- 6. Return the combined result --------------------------------------
    return {
        "message": "Analysis completed successfully",
        "company_file": company_filename,
        "regulation_file": regulation_filename,
        "analysis": analysis_result,
        "policy_pdf_url": policy_pdf_url,
        "audit_report_url": audit_report_url,
    }