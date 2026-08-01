"""
ComplyAI Backend - Gemini Service

Provides the AI compliance analysis layer. Sends extracted company policy
and regulation text to Google's Gemini 2.5 Flash model with an engineered
prompt, and returns a structured compliance gap analysis as a dictionary.
"""

import json
import logging
import os

import google.generativeai as genai
from dotenv import load_dotenv

# ---------------------------------------------------------------------------
# Environment & Logging Setup
# ---------------------------------------------------------------------------
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL_NAME = "gemini-2.5-flash"

# Required keys expected in every successful Gemini JSON response.
REQUIRED_RESPONSE_KEYS = (
    "compliance_score",
    "risk_level",
    "summary",
    "missing_requirements",
    "recommendations",
)

# Maximum number of attempts if Gemini returns malformed/invalid JSON.
MAX_RETRIES = 2


class GeminiServiceError(Exception):
    """Raised when the Gemini compliance analysis fails irrecoverably."""


def _get_model() -> genai.GenerativeModel:
    """
    Configure the Gemini SDK with the API key and return a ready-to-use
    GenerativeModel instance.
    """
    if not GEMINI_API_KEY:
        raise GeminiServiceError(
            "GEMINI_API_KEY is not set. Please define it in your .env file."
        )

    genai.configure(api_key=GEMINI_API_KEY)
    return genai.GenerativeModel(GEMINI_MODEL_NAME)


def _build_prompt(company_text: str, regulation_text: str) -> str:
    """
    Build the prompt sent to Gemini.
    """
    return f"""
You are a professional compliance analyst.

Compare the COMPANY POLICY against the REGULATION below and identify compliance gaps.

Respond with STRICT JSON ONLY.
Do not include markdown formatting, code fences, explanations,
or any text outside the JSON object.

Return EXACTLY this schema:

{{
  "compliance_score": <integer 0-100>,
  "risk_level": "<Low | Medium | High>",
  "summary": "<2-3 sentence overview>",
  "missing_requirements": [
      "<requirement>",
      ...
  ],
  "recommendations": [
      "<recommendation>",
      ...
  ]
}}

COMPANY POLICY:
\"\"\"
{company_text}
\"\"\"

REGULATION:
\"\"\"
{regulation_text}
\"\"\"
""".strip()


def _parse_json_response(raw_text: str) -> dict:
    """
    Parse and validate Gemini's JSON response.
    """
    cleaned = raw_text.strip()

    # Remove markdown code fences if Gemini adds them.
    if cleaned.startswith("```"):
        lines = cleaned.splitlines()

        if lines[0].startswith("```"):
            lines = lines[1:]

        if lines and lines[-1].startswith("```"):
            lines = lines[:-1]

        cleaned = "\n".join(lines).strip()

    try:
        parsed = json.loads(cleaned)
    except json.JSONDecodeError as exc:
        raise ValueError(f"Response is not valid JSON: {exc}") from exc

    missing_keys = [
        key for key in REQUIRED_RESPONSE_KEYS
        if key not in parsed
    ]

    if missing_keys:
        raise ValueError(
            f"Response JSON is missing required keys: {missing_keys}"
        )

    return parsed


def analyze_compliance(company_text: str, regulation_text: str) -> dict:
    """
    Analyze company policy against regulation using Gemini.

    Returns:
        dict containing:
            compliance_score
            risk_level
            summary
            missing_requirements
            recommendations
    """
    if not company_text.strip():
        raise ValueError("company_text must not be empty.")

    if not regulation_text.strip():
        raise ValueError("regulation_text must not be empty.")

    model = _get_model()
    prompt = _build_prompt(company_text, regulation_text)

    last_error = None

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            logger.info(
                "Sending compliance analysis request to Gemini (attempt %d)...",
                attempt,
            )

            response = model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.2,
                    response_mime_type="application/json",
                ),
            )

            if not response or not getattr(response, "text", None):
                raise ValueError("Gemini returned an empty response.")

            # --------------------------------------------------------------
            # Debug: Print Raw Gemini Response
            # --------------------------------------------------------------
            logger.info("=" * 80)
            logger.info("RAW GEMINI RESPONSE:")
            logger.info(response.text)
            logger.info("=" * 80)

            return _parse_json_response(response.text)

        except ValueError as exc:
            last_error = exc
            logger.warning(
                "Attempt %d produced invalid JSON: %s",
                attempt,
                exc,
            )

        except Exception as exc:
            logger.exception("Gemini API call failed.")
            raise GeminiServiceError(
                f"Gemini compliance analysis failed due to an API error: {exc}"
            ) from exc

    logger.error(
        "Gemini failed to return valid JSON after %d attempts.",
        MAX_RETRIES,
    )

    raise GeminiServiceError(
        f"Gemini did not return a valid compliance analysis after "
        f"{MAX_RETRIES} attempts. Last error: {last_error}"
    )