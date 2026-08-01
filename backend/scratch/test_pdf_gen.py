import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from services.pdf_generator import generate_improved_policy_pdf, generate_audit_report_pdf

sample_analysis = {
    "compliance_score": 88,
    "risk_level": "Medium",
    "summary": "The policy aligns with core data protection requirements but requires explicit procedures for international data transfers and breach notification timelines.",
    "missing_requirements": [
        "Mandatory 72-hour data breach notification to supervisory authorities.",
        "Formal Data Protection Impact Assessment (DPIA) protocol for high-risk processing."
    ],
    "recommendations": [
        "Incorporate a dedicated Breach Incident Response procedure.",
        "Add explicit DPIA triggers and documentation guidelines."
    ],
    "improved_clauses": [
        {
            "issue": "Missing 72-hour breach notification mandate",
            "original": "The company will report incidents when feasible.",
            "improved": "Section 4.2: In the event of a personal data breach, the Data Protection Officer shall notify the competent supervisory authority within 72 hours of becoming aware of the breach.",
            "reason": "Required under Article 33 of GDPR / DPDP guidelines."
        }
    ],
    "revised_policy": "ARTICLE 1: GENERAL PROVISIONS\n1.1 PURPOSE\nThis policy defines corporate data governance standards.\n\nARTICLE 2: INCIDENT NOTIFICATION\n2.1 BREACH TIMELINES\nThe Data Protection Officer shall notify supervisory authorities within 72 hours of becoming aware of a personal data breach."
}

sample_org = {
    "companyName": "Acme Global Solutions Inc.",
    "industry": "FinTech / SaaS",
    "headquartersCountry": "United States",
    "state": "Delaware",
    "complianceFrameworks": "GDPR, SOC 2, DPDP Act",
}

print("Testing PDF Generation...")
policy_url = generate_improved_policy_pdf(sample_analysis, sample_org)
report_url = generate_audit_report_pdf(sample_analysis, sample_org)

print(f"Policy PDF generated: {policy_url}")
print(f"Audit Report PDF generated: {report_url}")
