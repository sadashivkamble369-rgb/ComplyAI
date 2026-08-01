"""
report_service.py

Business logic layer for generating a professional PDF compliance report
from a structured analysis result.

`perform_compliance_analysis` (see analysis_service.py) produces the data;
this module is solely responsible for rendering that data into a polished
PDF document using ReportLab.

Public API:
    generate_compliance_report(analysis_result: dict, output_path: str | None = None) -> str
"""

from __future__ import annotations

import logging
import uuid
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    ListFlowable,
    ListItem,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

logger = logging.getLogger(__name__)

DEFAULT_OUTPUT_DIR = Path("reports")

RISK_COLORS = {
    "low": colors.HexColor("#2e7d32"),
    "medium": colors.HexColor("#f9a825"),
    "high": colors.HexColor("#c62828"),
    "unknown": colors.HexColor("#616161"),
}


class ReportGenerationError(Exception):
    """Raised when the PDF report cannot be generated."""


@dataclass
class ReportData:
    """Normalized, report-ready view of an analysis result."""

    title: str
    compliance_score: str
    risk_level: str
    summary: str
    missing_requirements: List[str]
    recommendations: List[str]


def _coerce_report_data(analysis_result: Dict[str, Any]) -> ReportData:
    """Validate and normalize the incoming analysis_result dictionary."""
    if not isinstance(analysis_result, dict):
        raise ReportGenerationError("analysis_result must be a dictionary")

    company_document = analysis_result.get("company_document", "Company Document")
    title = f"Compliance Report: {company_document}"

    score = analysis_result.get("compliance_score")
    if score is None:
        score = analysis_result.get("overall_status", "N/A")
    compliance_score = str(score)

    risk_level = str(analysis_result.get("risk_level", "unknown")).lower()

    summary = analysis_result.get("summary", "No summary available.")

    missing_requirements = analysis_result.get("missing_requirements")
    if missing_requirements is None:
        # Derive from findings, if present
        missing_requirements = [
            f.get("requirement", "Unnamed requirement")
            for f in analysis_result.get("findings", [])
            if f.get("status") == "non_compliant"
        ]

    recommendations = analysis_result.get("recommendations", [])

    return ReportData(
        title=title,
        compliance_score=compliance_score,
        risk_level=risk_level,
        summary=summary,
        missing_requirements=list(missing_requirements) or ["None identified."],
        recommendations=list(recommendations) or ["No specific recommendations provided."],
    )


def _build_styles() -> Dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "ReportTitle",
            parent=base["Title"],
            fontSize=22,
            alignment=TA_CENTER,
            spaceAfter=20,
        ),
        "heading": ParagraphStyle(
            "SectionHeading",
            parent=base["Heading2"],
            fontSize=14,
            spaceBefore=16,
            spaceAfter=8,
            textColor=colors.HexColor("#1a1a1a"),
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["BodyText"],
            fontSize=10.5,
            leading=15,
            alignment=TA_LEFT,
        ),
        "list_item": ParagraphStyle(
            "ListItem",
            parent=base["BodyText"],
            fontSize=10.5,
            leading=15,
        ),
    }


def _build_score_and_risk_table(data: ReportData, styles: Dict[str, ParagraphStyle]) -> Table:
    risk_color = RISK_COLORS.get(data.risk_level, RISK_COLORS["unknown"])

    table_data = [
        [Paragraph("<b>Compliance Score</b>", styles["body"]),
         Paragraph("<b>Risk Level</b>", styles["body"])],
        [Paragraph(data.compliance_score, styles["body"]),
         Paragraph(data.risk_level.upper(), styles["body"])],
    ]

    table = Table(table_data, colWidths=[2.5 * inch, 2.5 * inch])
    table.setStyle(
        TableStyle(
            [
                ("BOX", (0, 0), (-1, -1), 0.75, colors.HexColor("#cccccc")),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e0e0e0")),
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f2f2f2")),
                ("TEXTCOLOR", (1, 1), (1, 1), risk_color),
                ("FONTNAME", (1, 1), (1, 1), "Helvetica-Bold"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )
    return table


def _build_bulleted_list(items: List[str], styles: Dict[str, ParagraphStyle]) -> ListFlowable:
    return ListFlowable(
        [ListItem(Paragraph(item, styles["list_item"])) for item in items],
        bulletType="bullet",
        start="circle",
        leftIndent=18,
    )


def _resolve_output_path(output_path: Optional[str]) -> Path:
    if output_path:
        path = Path(output_path)
    else:
        DEFAULT_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        path = DEFAULT_OUTPUT_DIR / f"compliance_report_{uuid.uuid4().hex[:8]}.pdf"

    path.parent.mkdir(parents=True, exist_ok=True)
    return path


def _render_pdf(data: ReportData, output_path: Path) -> None:
    styles = _build_styles()
    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=LETTER,
        topMargin=0.9 * inch,
        bottomMargin=0.9 * inch,
        leftMargin=0.9 * inch,
        rightMargin=0.9 * inch,
        title=data.title,
    )

    story = [
        Paragraph(data.title, styles["title"]),
        _build_score_and_risk_table(data, styles),
        Spacer(1, 16),
        Paragraph("Summary", styles["heading"]),
        Paragraph(data.summary, styles["body"]),
        Paragraph("Missing Requirements", styles["heading"]),
        _build_bulleted_list(data.missing_requirements, styles),
        Paragraph("Recommendations", styles["heading"]),
        _build_bulleted_list(data.recommendations, styles),
    ]

    doc.build(story)


def generate_compliance_report(
    analysis_result: Dict[str, Any],
    output_path: Optional[str] = None,
) -> str:
    """
    Generate a professional PDF compliance report from an analysis result.

    Args:
        analysis_result: Structured dictionary produced by the analysis
            layer (e.g. analysis_service.ComplianceAnalysisResult.to_dict()).
        output_path: Optional destination path for the PDF. If omitted, a
            path is generated under ./reports/.

    Returns:
        The path to the generated PDF file, as a string.

    Raises:
        ReportGenerationError: If the report cannot be built.
    """
    try:
        data = _coerce_report_data(analysis_result)
        resolved_path = _resolve_output_path(output_path)
        _render_pdf(data, resolved_path)
    except ReportGenerationError:
        raise
    except Exception as exc:  # noqa: BLE001 - normalize into domain error
        logger.exception("Failed to generate compliance report PDF")
        raise ReportGenerationError("Failed to generate the PDF report") from exc

    logger.info("Compliance report generated at %s", resolved_path)
    return str(resolved_path)