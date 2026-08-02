from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routes.analyze import router
from services.pdf_generator import GENERATED_REPORTS_DIR

app = FastAPI(
    title="ComplyAI",
    version="1.0.0",
    description="AI-powered compliance gap analysis between company policies and regulations.",
)

GENERATED_REPORTS_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/generated_reports", StaticFiles(directory=str(GENERATED_REPORTS_DIR)), name="generated_reports")

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from pydantic import BaseModel
from typing import Optional, Dict, Any
from services.pdf_generator import GENERATED_REPORTS_DIR
from services.gemini_service import answer_compliance_question


class ChatRequest(BaseModel):
    prompt: str
    context: Optional[Dict[str, Any]] = None

@app.get("/")
def read_root():
    return {
        "message": "ComplyAI API is running",
        "version": app.version,
    }


@app.get("/health")
def health_check():
    return {"status": "ok"}


from services.email_service import send_real_email_notification

class EmailNotificationRequest(BaseModel):
    user_name: str
    email: str

@app.post("/send-notification")
def send_login_notification(req: EmailNotificationRequest):
    """
    Sends a real security & welcome notification email to the user's actual email address.
    """
    res = send_real_email_notification(req.email, req.user_name)
    return {
        "status": "success",
        "message": f"Real security notification email sent to {req.email}",
        "details": res
    }




from fastapi.responses import FileResponse
from services.pdf_generator import generate_improved_policy_pdf, generate_audit_report_pdf, GENERATED_REPORTS_DIR

@app.get("/download/{report_type}")
def download_report_endpoint(report_type: str, ref: Optional[str] = None):
    """
    On-demand PDF generator & downloader for:
    - audit_report: Executive Audit Report PDF
    - improved_policy / revised_policy: AI Generated Revised Policy PDF
    """
    sample_analysis = {
        "compliance_score": 88,
        "risk_level": "Medium",
        "summary": "Executive compliance evaluation between company operational directives and target regulatory standards.",
        "missing_requirements": [
            "Mandatory Data Protection Officer (DPO) contact details & designation.",
            "72-Hour Statutory Breach Notification SLA protocol.",
            "Data Subject Access & Erasure Rights (DSAR) workflow.",
        ],
        "recommendations": [
            "Formally appoint DPO and document responsibilities.",
            "Implement automated 72-hour breach reporting procedure.",
            "Incorporate vendor subprocessor compliance safeguards.",
        ],
        "improved_clauses": [
            {
                "issue": "Missing DPO Designation",
                "original": "The company values privacy and appoints staff as needed.",
                "improved": "Section 4.1 - DPO Appointment: The Organization formally designates a Data Protection Officer reachable at dpo@company.com.",
                "reason": "Required under GDPR Article 37.",
            },
            {
                "issue": "Incomplete Breach Notification Procedure",
                "original": "Incidents will be investigated internally by IT.",
                "improved": "Section 9.2 - Breach SLA: Security incidents impacting personal data must be reported to supervisory authority within 72 hours.",
                "reason": "Mandated by GDPR Article 33.",
            },
        ],
        "revised_policy": """COMPLYAI REVISED ENTERPRISE POLICY
====================================

SECTION 1: PURPOSE & SCOPE
This policy establishes mandatory operational safeguards and data privacy controls across all corporate systems, vendors, and subprocessors.

SECTION 2: DATA PROTECTION OFFICER (DPO) GOVERNANCE
The organization formally designates a Data Protection Officer (DPO) reachable at dpo@company.com to oversee regulatory compliance, risk assessments, and supervisory authority communications under GDPR Article 37.

SECTION 3: 72-HOUR STATUTORY BREACH NOTIFICATION
In the event of a security breach affecting personal data, the Incident Response Team must notify the competent Supervisory Authority within 72 hours of discovery, per GDPR Article 33.

SECTION 4: DATA SUBJECT ACCESS & ERASURE RIGHTS (DSAR)
Data subjects reserve the right to request access, rectification, and erasure of personal records. All valid DSAR inquiries shall be fulfilled within 30 calendar days.

SECTION 5: ENCRYPTION & TECHNICAL CONTROLS
All sensitive customer data must be encrypted at rest using AES-256 encryption standards and in transit via TLS 1.3 protocols. Access logs must be maintained for at least 365 days.
"""
    }

    sample_org = {
        "companyName": "Acme Global Enterprise",
        "industry": "Technology",
        "headquartersCountry": "United States",
        "state": "California",
    }

    if "policy" in report_type.lower() or "improved" in report_type.lower() or "revised" in report_type.lower():
        pdf_url = generate_improved_policy_pdf(sample_analysis, sample_org)
        filename = pdf_url.split("/")[-1]
        file_path = GENERATED_REPORTS_DIR / filename
        return FileResponse(
            path=str(file_path),
            filename=f"AI_Revised_Company_Policy_{ref or 'complyai'}.pdf",
            media_type="application/pdf",
        )
    else:
        pdf_url = generate_audit_report_pdf(sample_analysis, sample_org)
        filename = pdf_url.split("/")[-1]
        file_path = GENERATED_REPORTS_DIR / filename
        return FileResponse(
            path=str(file_path),
            filename=f"Executive_Audit_Report_{ref or 'complyai'}.pdf",
            media_type="application/pdf",
        )


app.include_router(router)
