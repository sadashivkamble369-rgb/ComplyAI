import React, { useState } from "react";
import Navbar from "./Navbar";
import UploadBox from "./UploadBox";
import Loading from "./Loading";
import ResultCard from "./ResultCard";
import { analyzeDocuments } from "./services/api";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async (companyFile, regulationFile) => {
    setLoading(true);
    setResult(null);

    try {
      const data = await analyzeDocuments(companyFile, regulationFile);
      setResult(data);
    } catch (error) {
      alert(error.message || "Something went wrong while analyzing the documents.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <style>{`
        .home-page {
          min-height: 100vh;
          background: #E7EAE2;
        }

        .home-content {
          max-width: 900px;
          margin: 0 auto;
          padding: 36px 20px 64px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
      `}</style>

      <Navbar />

      <div className="home-content">
        <UploadBox loading={loading} onAnalyze={handleAnalyze} />

        {loading && <Loading />}

        {!loading && result && <ResultCard result={result} />}
      </div>
    </div>
  );
}