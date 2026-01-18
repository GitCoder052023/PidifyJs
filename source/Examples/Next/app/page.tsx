"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { FileText, Github, ExternalLink } from "lucide-react";

// Dynamically import the PDFViewer with SSR disabled as it relies on browser APIs
const PDFViewer = dynamic(
  () => import("@pidifyjs/core").then((mod) => mod.PDFViewer),
  { 
    ssr: false, 
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <p className="text-sm text-gray-500 font-medium">Initializing PidifyJs...</p>
        </div>
      </div>
    ) 
  }
);

const SAMPLE_PDFS = [
  { name: "TraceMonkey (Sample)", url: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf" },
];

export default function Home() {
  const [pdfUrl, setPdfUrl] = useState(SAMPLE_PDFS[0].url);

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-1.5 rounded-lg shadow-sm shadow-red-200">
            <FileText className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-gray-900 leading-tight">
              Pidify<span className="text-red-600">Js</span>
            </h1>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Advanced PDF Playground</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-100">
            <span className="text-[11px] font-bold text-gray-400 px-2">SOURCE</span>
            <select 
              className="text-sm border-0 rounded-md px-3 py-1 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer font-medium"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
            >
              {SAMPLE_PDFS.map(pdf => (
                <option key={pdf.url} value={pdf.url}>{pdf.name}</option>
              ))}
            </select>
          </div>
          
          <div className="h-6 w-px bg-gray-200"></div>
          
          <a 
            href="https://github.com/GitCoder052023/PidifyJs" 
            target="_blank" 
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
            title="View on GitHub"
          >
            <Github size={20} />
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative bg-gray-100">
        <PDFViewer data={{ url: pdfUrl }} />
      </main>

      {/* Status Bar */}
      <footer className="px-6 py-1.5 border-t border-gray-100 bg-white text-[10px] text-gray-400 flex justify-between items-center z-30">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="font-medium">System Ready</span>
          </div>
          <span className="h-3 w-px bg-gray-200"></span>
          <span>React 19.2.3</span>
          <span>Next.js 16.1.3</span>
        </div>
        <div className="flex gap-5 items-center">
          <span className="flex items-center gap-1 hover:text-red-600 cursor-pointer transition-colors font-medium uppercase tracking-tighter">
            Documentation <ExternalLink size={10} />
          </span>
          <span className="text-gray-200">|</span>
          <span className="font-bold">v0.1.0-alpha</span>
        </div>
      </footer>
    </div>
  );
}
