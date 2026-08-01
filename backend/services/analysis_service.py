"""
analyze.py

Thin entry point / interface layer. Contains no business logic —
it only delegates to `analysis_service.perform_compliance_analysis`
and handles I/O concerns (CLI args, HTTP request/response, etc.).
"""

from analysis_service import (
    perform_compliance_analysis,
    ComplianceAnalysisError,
)


def analyze(company_pdf_path: str, regulation_pdf_path: str) -> dict:
    """Run compliance analysis and return a plain dict result."""
    try:
        result = perform_compliance_analysis(company_pdf_path, regulation_pdf_path)
    except ComplianceAnalysisError as exc:
        return {"error": str(exc)}

    return result.to_dict()


if __name__ == "__main__":
    import sys
    import json

    if len(sys.argv) != 3:
        print("Usage: python analyze.py <company_pdf_path> <regulation_pdf_path>")
        sys.exit(1)

    output = analyze(sys.argv[1], sys.argv[2])
    print(json.dumps(output, indent=2))