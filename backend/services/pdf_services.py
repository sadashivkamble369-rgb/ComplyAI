"""
ComplyAI Backend - PDF Service

Provides utilities for safely extracting plain text from PDF documents
using PyMuPDF (fitz). Used by the analysis pipeline to convert uploaded
company policy and regulation PDFs into raw text for AI processing.
"""

import logging
from pathlib import Path

import fitz  # PyMuPDF

# Module-level logger for warnings and errors during PDF processing.
logger = logging.getLogger(__name__)

# File extension expected for valid PDF documents.
PDF_EXTENSION = ".pdf"

# PDF file signature (magic bytes) used for lightweight format validation.
PDF_MAGIC_BYTES = b"%PDF-"


def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extract all plain text from a PDF file, page by page, using PyMuPDF.

    The function validates that the given path exists, points to a file,
    has a ``.pdf`` extension, and begins with a valid PDF file signature
    before attempting to open and parse it. Blank pages (pages with no
    extractable text) are skipped. Text from all remaining pages is
    combined into a single string, separated by blank lines.

    Args:
        pdf_path (str): Path to the PDF file to extract text from.

    Returns:
        str: The combined plain text extracted from all non-blank pages.

    Raises:
        FileNotFoundError: If the path does not exist or is not a file.
        ValueError: If the file is not a valid PDF, is corrupted, has
            zero pages, or contains no extractable text on any page.
    """
    path = Path(pdf_path).resolve()

    # --- 1. Validate the path exists and is a file -------------------------
    if not path.exists():
        raise FileNotFoundError(f"PDF file not found at path: '{pdf_path}'")

    if not path.is_file():
        raise FileNotFoundError(f"Specified path is not a file: '{pdf_path}'")

    # --- 2. Validate the file extension -------------------------------------
    if path.suffix.lower() != PDF_EXTENSION:
        raise ValueError(
            f"Invalid file type for '{pdf_path}'. Expected a '.pdf' file, "
            f"got '{path.suffix}'."
        )

    # --- 3. Validate the file signature (magic bytes) -----------------------
    try:
        with path.open("rb") as raw_file:
            header = raw_file.read(len(PDF_MAGIC_BYTES))
    except OSError as exc:
        logger.error(f"Failed to read header of '{path}': {exc}", exc_info=True)
        raise ValueError(
            f"Unable to read file at '{pdf_path}' to verify PDF format."
        ) from exc

    if header != PDF_MAGIC_BYTES:
        raise ValueError(
            f"File at '{pdf_path}' does not appear to be a valid PDF "
            "(missing PDF file signature)."
        )

    # --- 4. Open the PDF document safely -------------------------------------
    try:
        document = fitz.open(path)
    except Exception as exc:
        logger.error(f"Failed to open PDF file '{path}': {exc}", exc_info=True)
        raise ValueError(
            f"Failed to open or parse PDF file at '{pdf_path}'. The file may "
            f"be corrupted or invalid. Details: {exc}"
        ) from exc

    try:
        # --- 5. Validate the document has at least one page -----------------
        if document.page_count == 0:
            raise ValueError(
                f"The PDF document at '{pdf_path}' is empty and contains 0 pages."
            )

        page_texts: list[str] = []

        # --- 6. Extract text from every page, skipping blank pages ----------
        for page_index in range(document.page_count):
            try:
                page = document.load_page(page_index)
                page_text = page.get_text("text")
            except Exception as page_exc:
                logger.warning(
                    f"Failed to extract text from page {page_index + 1} of "
                    f"'{pdf_path}': {page_exc}"
                )
                continue

            if page_text and page_text.strip():
                page_texts.append(page_text.strip())
            else:
                logger.debug(f"Skipping blank page {page_index + 1} of '{pdf_path}'.")

        # --- 7. Combine all page text into a single string -------------------
        combined_text = "\n\n".join(page_texts).strip()

        # --- 8. Validate that some text was actually extracted ---------------
        if not combined_text:
            raise ValueError(
                f"No extractable text found in PDF document at '{pdf_path}'. "
                "The file may contain only scanned images or be unreadable."
            )

        return combined_text

    finally:
        # --- 9. Always close the document handle, even if an error occurred --
        document.close()