import { useMemo, useRef } from "react"
import type React from "react"
import { Document, Page, pdfjs } from "react-pdf"
import {
  LayoutPanelLeft,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  RotateCw
} from "lucide-react"

import "react-pdf/dist/esm/Page/TextLayer.css"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"

import type { PDFViewerProps } from "@/types/PDFViewer.types"
import {
  SCALE_SETS,
  DEFAULT_PAGE,
  TEXT_LAYER_ENABLED,
  TOOLBAR_VISIBLE_BY_DEFAULT,
} from "@/constants/PDFViewer.consts"

import { usePDFState } from "@/hooks/usePDFState"
import { usePDFUtils } from "@/hooks/usePDFUtils"
import { usePDFDocument } from "@/hooks/usePDFDocument"
import { usePDFNavigation } from "@/hooks/usePDFNavigation"
import { usePDFResponsive } from "@/hooks/usePDFResponsive"
import { useShimmer } from "@/hooks/useShimmer"

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

const ShimmerBlock: React.FC<{ className?: string }> = ({ className }) => {
  const shimmerRef = useRef<HTMLSpanElement>(null)
  useShimmer(shimmerRef)

  return (
    <span
      ref={shimmerRef}
      className={`relative block overflow-hidden rounded-[5px] border border-[rgba(0,0,0,0.1)] ${className || ""}`}
    />
  )
}

const PDFViewer: React.FC<PDFViewerProps> = ({ data }) => {
  const pageRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})
  const previewRef = useRef<HTMLDivElement>(null)
  const resizeDividerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<HTMLDivElement>(null)
  const startXRef = useRef<number>(0)
  const startWidthRef = useRef<number>(0)

  const state = usePDFState()
  const { debounce, calculateRotation } = usePDFUtils()
  const { MAX_RETRIES } = usePDFDocument(
    data,
    state.retryCount,
    state.setRetryCount,
    state.retryTimeoutDelay,
    state.setRetryTimeoutDelay,
    state.pdfBlobUrl,
    state.setPdfBlobUrl,
  )

  const { goToPage, updatePDFPage, rotatePage } = usePDFNavigation(
    state.pageNumber,
    state.setPageNumber,
    state.setPreviewNumber,
    state.numPages,
    pageRefs,
    previewRef,
    debounce,
  )

  const { startResize } = usePDFResponsive(
    state.setIsMobile,
    state.isDragging,
    state.setIsDragging,
    state.leftPanelWidth,
    state.setLeftPanelWidth,
    state.isMobile,
    state.setSidebar,
    startXRef,
    startWidthRef,
  )

  const documentOptions = useMemo(() => ({
    cMapUrl: "https://unpkg.com/pdfjs-dist@3.4.120/cmaps/",
    cMapPacked: true,
    standardFontDataUrl: "https://unpkg.com/pdfjs-dist@3.4.120/standard_fonts/",
  }), [])

  async function onDocumentLoadSuccess(pdf: any) {
    state.setNumPages(pdf.numPages)
    state.setPdfDocument(pdf)
    const meta = await pdf.getMetadata()
    state.setMetadata(meta.info)
    if (DEFAULT_PAGE > 1 && DEFAULT_PAGE <= pdf.numPages) {
      goToPage(DEFAULT_PAGE)
    }
  }

  function onDocumentLoadError() {
    console.error(`Failed to load PDF (Attempt ${state.retryCount + 1})`)
    if (state.retryCount < MAX_RETRIES) {
      state.setRetryCount(state.retryCount + 1)
    }
  }

  return (
    <div
      ref={viewerRef}
      className="relative flex flex-col overflow-hidden rounded-[5px] border border-[#d8d8d8] bg-[#f5f5f5] text-[#333333] shadow-[0_2px_10px_rgba(0,0,0,0.05)] box-border [font-family:'Source_Sans_Pro',-apple-system,BlinkMacSystemFont,sans-serif] [&_*]:box-border [&_*]:[font-family:'Source_Sans_Pro',-apple-system,BlinkMacSystemFont,sans-serif] [&_.react-pdf__Page__textContent]:pointer-events-none [&_.react-pdf__Page__textContent]:select-none"
    >
      {TOOLBAR_VISIBLE_BY_DEFAULT && (
        <div className={`flex items-center justify-between border-b border-[#d8d8d8] bg-[#f0f0f0] px-2 py-[6px] ${state.isMobile ? "flex-wrap gap-[5px]" : ""}`}>
          <div className={`grid items-center gap-[5px] ${state.isMobile ? "w-full grid-cols-[30px_30px_auto_30px]" : "grid-cols-[30px_30px_auto_30px]"}`}>
            <button
              onClick={() => state.setSidebar(!state.sidebar)}
              aria-label="Toggle sidebar"
              title="Toggle sidebar"
              className="mx-[2px] my-0 flex h-[30px] w-[30px] items-center justify-center rounded-[2px] border-0 bg-transparent p-[6px] text-[#5a5a5a] transition-all duration-100 [transition-timing-function:ease] hover:bg-[#e6e6e6] hover:text-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#333333]/40"
            >
              <LayoutPanelLeft size={16} />
            </button>

            <button
              disabled={state.pageNumber <= 1}
              onClick={() => goToPage(state.pageNumber - 1)}
              aria-label="Previous page"
              title="Previous page"
              className="mx-[2px] my-0 flex h-[30px] w-[30px] items-center justify-center rounded-[2px] border-0 bg-transparent p-[6px] text-[#5a5a5a] transition-all duration-100 [transition-timing-function:ease] hover:bg-[#e6e6e6] hover:text-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#333333]/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronUp size={16} />
            </button>

            <div className={`m-0 flex items-center gap-[10px] text-[14px] ${state.isMobile ? "text-[12px]" : ""}`}>
              <input
                type="number"
                onChange={updatePDFPage}
                value={state.previewNumber}
                aria-label="Page"
                title="Page"
                className={`w-[40px] rounded-[2px] border border-[#cccccc] bg-white px-2 py-1 text-center text-[14px] text-[#333333] outline-none focus-visible:ring-2 focus-visible:ring-[#333333]/30 ${state.isMobile ? "max-w-[50px]" : "max-w-[70px]"}`}
              />
              / {state.numPages || "?"}
            </div>

            <button
              disabled={state.numPages === null || state.pageNumber >= state.numPages}
              onClick={() => goToPage(state.pageNumber + 1)}
              aria-label="Next page"
              title="Next page"
              className="mx-[2px] my-0 flex h-[30px] w-[30px] items-center justify-center rounded-[2px] border-0 bg-transparent p-[6px] text-[#5a5a5a] transition-all duration-100 [transition-timing-function:ease] hover:bg-[#e6e6e6] hover:text-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#333333]/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronDown size={16} />
            </button>
          </div>

          <div className={`grid items-center gap-[10px] grid-cols-[30px_auto_30px] ${state.isMobile ? "ml-auto" : ""}`}>
            <button
              onClick={() =>
                rotatePage(state.pageNumber, state.setPageRotations, calculateRotation, false)
              }
              aria-label="Rotate counterclockwise"
              title="Rotate counterclockwise"
              className="mx-[2px] my-0 flex h-[30px] w-[30px] items-center justify-center rounded-[2px] border-0 bg-transparent p-[6px] text-[#5a5a5a] transition-all duration-100 [transition-timing-function:ease] hover:bg-[#e6e6e6] hover:text-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#333333]/40"
            >
              <RotateCcw size={16} />
            </button>

            <select
              onChange={(e) => state.setScale(+e.target.value)}
              value={state.scale}
              aria-label="Zoom level"
              title="Zoom level"
              className="mx-[2px] cursor-pointer rounded-[5px] border-0 bg-transparent px-[10px] py-[3px] text-[#333333] transition-all duration-100 [transition-timing-function:ease] hover:bg-[rgba(0,0,0,0.1)] focus:bg-[rgba(0,0,0,0.1)] active:bg-[rgba(0,0,0,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#333333]/30"
            >
              {SCALE_SETS.map((scaleLevel) => (
                <option key={scaleLevel} value={scaleLevel}>
                  {(scaleLevel * 100).toFixed(0)}%
                </option>
              ))}
            </select>

            <button
              onClick={() =>
                rotatePage(state.pageNumber, state.setPageRotations, calculateRotation, true)
              }
              aria-label="Rotate clockwise"
              title="Rotate clockwise"
              className="mx-[2px] my-0 flex h-[30px] w-[30px] items-center justify-center rounded-[2px] border-0 bg-transparent p-[6px] text-[#5a5a5a] transition-all duration-100 [transition-timing-function:ease] hover:bg-[#e6e6e6] hover:text-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#333333]/40"
            >
              <RotateCw size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="relative flex overflow-hidden transition-all duration-200 [transition-timing-function:ease] [&_.textLayer]:absolute [&_.textLayer]:left-0 [&_.textLayer]:top-0 [&_.textLayer]:right-0 [&_.textLayer]:bottom-0 [&_.textLayer]:overflow-hidden [&_.textLayer]:opacity-20 [&_.textLayer]:leading-[1] [&_.textLayer]:z-[2] [&_.textLayer>span]:absolute [&_.textLayer>span]:text-transparent [&_.textLayer>span]:whitespace-pre [&_.textLayer>span]:cursor-text [&_.textLayer>span]:origin-[0_0] [&_.textLayer_.highlight]:m-[-1px] [&_.textLayer_.highlight]:p-[1px] [&_.textLayer_.highlight]:bg-[rgb(180,0,170)] [&_.textLayer_.highlight.selected]:bg-[rgb(0,100,0)] [&_.textLayer_.highlight]:rounded-[4px] [&_.textLayer_.highlight.begin]:rounded-[4px_0_0_4px] [&_.textLayer_.highlight.end]:rounded-[0_4px_4px_0] [&_.textLayer_.highlight.middle]:rounded-[0px] [&_.textLayer]::selection:bg-[rgba(0,0,255,0.3)]">
        <div
          className="relative flex-shrink-0 overflow-hidden border-r border-[#d8d8d8] bg-[#f5f5f5] transition-[width] duration-100 [transition-timing-function:ease]"
          style={{
            width: state.sidebar ? `${state.leftPanelWidth}px` : "0px",
            flexShrink: 0,
            transition: state.isDragging ? "none" : "0.2s width ease",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {state.pdfBlobUrl && (
            <div className="min-h-[400px] scroll-smooth bg-[#f5f5f5] overflow-auto border-r border-[#d8d8d8] [&>div]:flex [&>div]:flex-col [&>div]:justify-center [&>div]:scroll-smooth [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#f5f5f5] [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:border-[2px] [&::-webkit-scrollbar-thumb]:border-[#f5f5f5] [&::-webkit-scrollbar-thumb]:bg-[#b3b3b3] [&::-webkit-scrollbar-thumb:hover]:bg-[#999999]">
              <Document
                file={state.pdfBlobUrl}
                loading={
                  <div className="flex flex-col items-center space-y-[10px] py-[10px]">
                    <ShimmerBlock className="mx-auto h-[170px] w-[120px]" />
                    <ShimmerBlock className="mx-auto h-[170px] w-[120px]" />
                    <ShimmerBlock className="mx-auto h-[170px] w-[120px]" />
                  </div>
                }
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
              >
                {state.numPages &&
                  Array.from({ length: state.numPages }, (_, index) => (
                    <button
                      key={`thumb-${index}`}
                      className="relative mx-auto my-[8px] flex items-center justify-center rounded-[5px] border border-[#cccccc] bg-white p-0 shadow-[0_1px_4px_rgba(0,0,0,0.15)] transition-all duration-100 [transition-timing-function:ease] hover:bg-[#f0f0f0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#333333]/30"
                      onClick={() => goToPage(index + 1)}
                      aria-label={`Page ${index + 1}`}
                      title={`Page ${index + 1}`}
                      aria-current={
                        state.pageNumber === index + 1 ? "page" : undefined
                      }
                    >
                      <Page
                        scale={0.2}
                        loading={
                          <div className="adex-thumb-loader">
                            <span className="thumb-loader"></span>
                          </div>
                        }
                        pageNumber={index + 1}
                        width={600}
                        rotate={state.pageRotations[index + 1] || 0}
                      />
                      {state.pageNumber === index + 1 && (
                        <span className="pointer-events-none absolute inset-0 border-[2px] border-[#222222] bg-transparent" />
                      )}
                    </button>
                  ))}
              </Document>
            </div>
          )}
        </div>

        {state.sidebar && (
          <div
            ref={resizeDividerRef}
            className="relative z-10 w-2 flex-shrink-0 cursor-col-resize bg-[rgba(0,0,0,0.05)]"
            onMouseDown={startResize}
          >
            <div className="absolute left-1/2 top-1/2 h-[30px] w-1 -translate-x-1/2 -translate-y-1/2 rounded-[2px] bg-[rgba(0,0,0,0.2)]" />
          </div>
        )}

        <div
          ref={previewRef}
          className="relative flex-1 overflow-auto bg-[#f5f5f5] p-5 scroll-smooth [&>div]:flex [&>div]:flex-col [&>div]:justify-center [&>div]:scroll-smooth [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#f5f5f5] [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:border-[2px] [&::-webkit-scrollbar-thumb]:border-[#f5f5f5] [&::-webkit-scrollbar-thumb]:bg-[#b3b3b3] [&::-webkit-scrollbar-thumb:hover]:bg-[#999999]"
        >
          {state.pdfBlobUrl && (
            <Document
              file={state.pdfBlobUrl}
              loading={
                <div className="flex flex-col items-center space-y-[10px] py-[10px]">
                  <ShimmerBlock className="mx-auto h-[800px] w-[80%]" />
                  <ShimmerBlock className="mx-auto h-[800px] w-[80%]" />
                </div>
              }
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              options={documentOptions}
            >
              {state.numPages &&
                Array.from({ length: state.numPages }, (_, index) => (
                  <div
                    key={`page-${index}`}
                    ref={(el) => {
                      if (el) pageRefs.current[index + 1] = el
                    }}
                    className={`relative mx-auto mb-5 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] border border-[#cccccc] rounded-[5px] transition-all duration-200 [&_.react-pdf__Page__textContent]:absolute [&_.react-pdf__Page__textContent]:left-0 [&_.react-pdf__Page__textContent]:top-0 [&_.react-pdf__Page__textContent]:right-0 [&_.react-pdf__Page__textContent]:bottom-0 [&_.react-pdf__Page__textContent]:overflow-hidden [&_.react-pdf__Page__textContent]:opacity-20 [&_.react-pdf__Page__textContent]:border [&_.react-pdf__Page__textContent]:border-transparent [&_.react-pdf__Page__textContent]:cursor-text [&_.react-pdf__Page__textContent]:pointer-events-none [&_.react-pdf__Page__textContent]:select-none [&_.react-pdf__Page__textContent>span]:absolute [&_.react-pdf__Page__textContent>span]:text-transparent [&_.react-pdf__Page__textContent>span]:whitespace-pre [&_.react-pdf__Page__textContent>span]:origin-[0_0] [&_.react-pdf__Page__textContent_.highlight]:m-[-1px] [&_.react-pdf__Page__textContent_.highlight]:p-[1px] [&_.react-pdf__Page__textContent_.highlight]:bg-[rgb(180,0,170)] [&_.react-pdf__Page__textContent_.highlight.selected]:bg-[rgb(0,100,0)] [&_.react-pdf__Page__textContent_.highlight]:rounded-[4px] [&_.react-pdf__Page__textContent_.highlight.begin]:rounded-[4px_0_0_4px] [&_.react-pdf__Page__textContent_.highlight.end]:rounded-[0_4px_4px_0] [&_.react-pdf__Page__textContent_.highlight.middle]:rounded-[0px] [&_.react-pdf__Page__textContent]::selection:bg-[rgba(0,0,255,0.3)] [&_.react-pdf__Page]:flex [&_.react-pdf__Page]:justify-center [&_.react-pdf__Page canvas]:bg-white [&_.react-pdf__Page canvas]:transition-transform [&_.react-pdf__Page canvas]:duration-300 [&_.react-pdf__Page canvas]:[transition-timing-function:ease] [&>div>div]:block ${state.isMobile ? "max-w-full overflow-auto [&_.react-pdf__Page canvas]:h-auto [&_.react-pdf__Page canvas]:max-w-full" : "overflow-hidden"}`}
                    aria-label={`Page ${index + 1} content`}
                    title={`Page ${index + 1} content`}
                  >
                    <Page
                      loading={
                        <div className="flex flex-col items-center space-y-[10px] py-[10px]">
                          <ShimmerBlock className="mx-auto h-[800px] w-[80%]" />
                        </div>
                      }
                      scale={state.scale}
                      pageNumber={index + 1}
                      width={600}
                      rotate={state.pageRotations[index + 1] || 0}
                      renderTextLayer={TEXT_LAYER_ENABLED}
                      renderAnnotationLayer={TEXT_LAYER_ENABLED}
                      canvasBackground="white"
                    />
                  </div>
                ))}
            </Document>
          )}
        </div>
      </div>
    </div>
  )
}

export default PDFViewer