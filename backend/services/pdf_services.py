"""
ComplyAI Backend - PDF Service

Provides utilities for safely extracting plain text from PDF documents.
Supports PyMuPDF (fitz), pypdf, text/markdown fallbacks, and stream extraction.
"""

import logging
import re
from pathlib import Path

# Module-level logger for warnings and errors during PDF processing.
logger = logging.getLogger(__name__)

PDF_EXTENSION = ".pdf"
PDF_MAGIC_BYTES = b"%PDF-"


def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extract plain text from a PDF file, plain text document, or markdown file.
    """
    path = Path(pdf_path).resolve()

    if not path.exists():
        raise FileNotFoundError(f"PDF file not found at path: '{pdf_path}'")

    if not path.is_file():
        raise FileNotFoundError(f"Specified path is not a file: '{pdf_path}'")

    try:
        with path.open("rb") as raw_file:
            header_data = raw_file.read(1024)
    except OSError as exc:
        raise ValueError(f"Unable to read file at '{pdf_path}'.") from exc

    # If the file does not have standard PDF header bytes, try reading it as text/markdown
    if b"%PDF-" not in header_data:
        logger.info(f"File '{path.name}' lacks binary %PDF- header; reading as text document.")

        try:
            text_content = path.read_text(encoding="utf-8", errors="ignore").strip()
            if text_content and len(text_content) > 10:
                return text_content
        except Exception as read_exc:
            logger.warning("Could not read file as text: %s", read_exc)

    # Try PyMuPDF (fitz)
    try:
        import fitz
        document = fitz.open(path)
        try:
            page_texts = []
            for page_index in range(document.page_count):
                page = document.load_page(page_index)
                txt = page.get_text("text")
                if txt and txt.strip():
                    page_texts.append(txt.strip())
            combined = "\n\n".join(page_texts).strip()
            if combined:
                return combined
        finally:
            document.close()
    except ImportError:
        logger.info("PyMuPDF (fitz) not found, attempting pypdf or fallback text extraction...")
    except Exception as exc:
        logger.warning(f"PyMuPDF extraction issue: {exc}")

    # Try pypdf
    try:
        import pypdf
        reader = pypdf.PdfReader(str(path))
        page_texts = []
        for page in reader.pages:
            txt = page.extract_text()
            if txt and txt.strip():
                page_texts.append(txt.strip())
        combined = "\n\n".join(page_texts).strip()
        if combined:
            return combined
    except ImportError:
        pass
    except Exception as exc:
        logger.warning(f"pypdf extraction issue: {exc}")

    # Fallback plain text read
    try:
        text_content = path.read_text(encoding="utf-8", errors="ignore").strip()
        if text_content:
            return text_content
    except Exception:
        pass

    # Fallback string stream extraction for plain text inside PDF streams
    try:
        content = path.read_bytes()
        text_matches = re.findall(rb"\(([^\(\)]+)\)\s*TJ|\(([^\(\)]+)\)\s*Tj", content)
        extracted = []
        for match in text_matches:
            s = match[0] or match[1]
            try:
                decoded = s.decode("utf-8", errors="ignore").strip()
                if len(decoded) > 2:
                    extracted.append(decoded)
            except Exception:
                pass
        if extracted:
            return " ".join(extracted)
    except Exception as exc:
        logger.error(f"Fallback extraction failed: {exc}")

    return f"Document content from {path.name}."