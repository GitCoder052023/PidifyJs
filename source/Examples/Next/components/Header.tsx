"use client";

import { FileText, Github } from "lucide-react";
import { SAMPLE_PDFS } from "../constants/pdfs";

interface HeaderProps {
  pdfUrl: string;
  setPdfUrl: (url: string) => void;
}

export const Header = ({ pdfUrl, setPdfUrl }: HeaderProps) => {
  return (
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
          rel="noreferrer"
        >
          <Github size={20} />
        </a>
      </div>
    </header>
  );
};
