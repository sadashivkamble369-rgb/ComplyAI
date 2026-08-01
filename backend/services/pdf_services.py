import logging
from pathlib import Path
import fitz  # PyMuPDF

# Configure logger for tracking warnings and errors
logger = logging.getLogger(__name__)


def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extracts all plain text from a PDF file page by page using PyMuPDF (fitz).

    Args:
        pdf_path (str): The file path to the target PDF document.

    Returns:
        str: The combined plain text extracted from all pages of the PDF.

    Raises:
        FileNotFoundError: If the specified PDF file does not exist or is not a file.
        ValueError: If the PDF file is corrupted, empty (0 pages), or contains no extractable text.
    """
    # 1. Path resolution and existence validation using pathlib
    path = Path(pdf_path).resolve()

    if not path.exists():
        raise FileNotFoundError(f"PDF file not found at path: '{pdf_path}'")

    if not path.is_file():
        raise FileNotFoundError(f"Specified path is not a file: '{pdf_path}'")

    # 2. Open PDF safely using PyMuPDF (fitz)
    try:
        doc = fitz.open(path)
    except Exception as exc:
        logger.error(f"Failed to open PDF file '{path}': {exc}", exc_info=True)
        raise ValueError(
            f"Failed to open or parse PDF file at '{pdf_path}'. The file may be corrupted or invalid. Details: {exc}"
        ) from exc

    try:
        # 3. Check for empty PDF document (0 pages)
        if len(doc) == 0:
            raise ValueError(f"The PDF document at '{pdf_path}' is empty and contains 0 pages.")

        page_texts = []

        # 4. Iterate over every page and extract text without OCR
        for page_index in range(len(doc)):
            try:
                page = doc.load_page(page_index)
                text = page.get_text("text")
                if text and text.strip():
                    page_texts.append(text.strip())
            except Exception as page_exc:
                logger.warning(
                    f"Failed to extract text from page {page_index + 1} of '{pdf_path}': {page_exc}"
                )

        # 5. Join extracted text from all pages into a single string
        combined_text = "\n\n".join(page_texts).strip()

        # 6. Check if extracted text is empty
        if not combined_text:
            raise ValueError(
                f"No extractable text found in PDF document at '{pdf_path}'. "
                "The file may contain only scanned images or be unreadable."
            )

        return combined_text

    finally:
        # 7. Ensure document handle is closed properly
        doc.close()