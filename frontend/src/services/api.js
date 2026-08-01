import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export async function analyzeDocuments(companyPolicy, regulationDocument) {
  if (!companyPolicy || !regulationDocument) {
    throw new Error("Both companyPolicy and regulationDocument files are required.");
  }

  const formData = new FormData();
  formData.append("company_policy", companyPolicy);
  formData.append("regulation_document", regulationDocument);

  try {
    const response = await apiClient.post("/analyze", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      const detail = error.response.data?.error || error.response.data?.detail;
      throw new Error(
        detail || `Analysis request failed with status ${error.response.status}.`
      );
    }

    if (error.request) {
      throw new Error(
        "No response from ComplyAI backend. Confirm the API is running at http://127.0.0.1:8000."
      );
    }

    throw new Error(`Failed to send analysis request: ${error.message}`);
  }
}