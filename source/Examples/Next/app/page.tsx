"use client";

import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PDFViewerWrapper } from "../components/PDFViewerWrapper";
import { SAMPLE_PDFS } from "../constants/pdfs";

export default function Home() {
  const [pdfUrl, setPdfUrl] = useState(SAMPLE_PDFS[0].url);

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <Header pdfUrl={pdfUrl} setPdfUrl={setPdfUrl} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative bg-gray-100">
        <PDFViewerWrapper data={{ url: pdfUrl }} />
      </main>

      <Footer />
    </div>
  );
}
