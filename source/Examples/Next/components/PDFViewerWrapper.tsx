"use client";

import dynamic from "next/dynamic";
import type { PDFViewerProps } from "@pidifyjs/core";
import React from "react";

export const PDFViewerWrapper = dynamic<PDFViewerProps>(
  () => import("@pidifyjs/core").then((mod) => mod.PDFViewer as React.ComponentType<PDFViewerProps>),
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
