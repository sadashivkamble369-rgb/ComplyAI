import logging
from pathlib import Path
from typing import Dict
from fastapi import APIRouter, File, HTTPException, UploadFile, status

# Configure logger for error handling and logging
logger = logging.getLogger(__name__)

# Initialize FastAPI APIRouter with prefix "/analyze"
router = APIRouter(prefix="/analyze", tags=["Analyze"])

# Validation and Configuration Constants
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB limit per file
ALLOWED_CONTENT_TYPE = "application/pdf"
ALLOWED_EXTENSION = ".pdf"
CHUNK_SIZE = 1024 * 1024  # Read/write buffer size (1 MB)

# Define target uploads directory using pathlib: backend/uploads
BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"


def validate_pdf(file: UploadFile, field_name: str) -> None:
    """
    Validates that an uploaded file is a non-empty PDF file based on 
    extension and MIME content-type.
    """
    filename = file.filename or ""
    
    # Check file extension
    if not filename.lower().endswith(ALLOWED_EXTENSION):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file extension for '{field_name}'. Only PDF files (.pdf) are allowed."
        )

    # Check MIME content-type
    if file.content_type != ALLOWED_CONTENT_TYPE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid content type for '{field_name}'. Expected '{ALLOWED_CONTENT_TYPE}', got '{file.content_type}'."
        )


async def save_pdf_file(file: UploadFile, destination: Path) -> None:
    """
    Saves an UploadFile asynchronously to disk while enforcing the 10 MB maximum size limit.
    Cleans up any partially written file if size limit is exceeded or an error occurs.
    """
    bytes_written = 0

    try:
        # Open destination file for binary writing
        with destination.open("wb") as buffer:
            while chunk := await file.read(CHUNK_SIZE):
                bytes_written += len(chunk)
                
                # Enforce file size limit during chunked reading
                if bytes_written > MAX_FILE_SIZE_BYTES:
                    buffer.close()
                    if destination.exists():
                        destination.unlink()
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"File '{file.filename}' exceeds maximum allowed size of 10 MB."
                    )
                
                buffer.write(chunk)

        # Enforce non-empty file check
        if bytes_written == 0:
            if destination.exists():
                destination.unlink()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File '{file.filename}' is empty."
            )

    except HTTPException:
        # Re-raise HTTP exceptions to return appropriate API error response
        raise
    except Exception as exc:
        # Log unexpected I/O or server errors
        logger.error(f"Error saving file {file.filename}: {exc}", exc_info=True)
        if destination.exists():
            destination.unlink()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save uploaded file '{file.filename}' due to a server error."
        )


@router.post(
    "",
    summary="Upload Company Policy and Regulation PDFs",
    response_model=Dict[str, str],
    status_code=status.HTTP_200_OK
)
@router.post(
    "/",
    include_in_schema=False
)
async def upload_analyze_documents(
    company_policy: UploadFile = File(..., description="Company policy PDF document"),
    regulation_document: UploadFile = File(..., description="Regulation document PDF")
) -> Dict[str, str]:
    """
    Accepts two PDF file uploads: 'company_policy' and 'regulation_document'.
    Validates file format (PDF) and size limit (<= 10MB each), creates the uploads directory
    if it does not exist, saves the files in backend/uploads, and returns success details.
    """
    # 1. Validate both uploads are PDF format
    validate_pdf(company_policy, "company_policy")
    validate_pdf(regulation_document, "regulation_document")

    # 2. Automatically create the uploads directory if it does not exist
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    # 3. Extract clean filenames and resolve destination paths
    company_filename = Path(company_policy.filename).name
    regulation_filename = Path(regulation_document.filename).name

    company_path = UPLOAD_DIR / company_filename
    regulation_path = UPLOAD_DIR / regulation_filename

    # 4. Save uploaded files to backend/uploads with size validation
    await save_pdf_file(company_policy, company_path)
    await save_pdf_file(regulation_document, regulation_path)

    # 5. Return success JSON response
    return {
        "message": "Files uploaded successfully",
        "company_file": company_filename,
        "regulation_file": regulation_filename
    }