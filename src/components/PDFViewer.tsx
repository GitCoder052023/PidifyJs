import { useRef, useMemo } from "react"
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
import "../index.css"
import "../themes/acrobat-theme.css"

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

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

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
      className={`PDFViewer adex-viewer ${state.sidebar ? "thumbs-slide-in" : "thumbs-slide-out"} ${state.isMobile ? "adex-mobile" : ""} disable-text-selection acrobat-theme`}
    >
      {TOOLBAR_VISIBLE_BY_DEFAULT && (
        <div className="adex-topbar">
          <div className="adex-control-page">
            <button
              onClick={() => state.setSidebar(!state.sidebar)}
              aria-label="Toggle sidebar"
              title="Toggle sidebar"
            >
              <LayoutPanelLeft size={16} />
            </button>

            <button
              disabled={state.pageNumber <= 1}
              onClick={() => goToPage(state.pageNumber - 1)}
              aria-label="Previous page"
              title="Previous page"
            >
              <ChevronUp size={16} />
            </button>

            <p>
              <input
                className="page-number"
                type="number"
                onChange={updatePDFPage}
                value={state.previewNumber}
                aria-label="Page"
                title="Page"
              />{" "}
              / {state.numPages || "?"}
            </p>

            <button
              disabled={state.numPages === null || state.pageNumber >= state.numPages}
              onClick={() => goToPage(state.pageNumber + 1)}
              aria-label="Next page"
              title="Next page"
            >
              <ChevronDown size={16} />
            </button>
          </div>

          <div className="adex-control-zoom">
            <button
              onClick={() =>
                rotatePage(state.pageNumber, state.setPageRotations, calculateRotation, false)
              }
              aria-label="Rotate counterclockwise"
              title="Rotate counterclockwise"
            >
              <RotateCcw size={16} />
            </button>

            <select
              onChange={(e) => state.setScale(+e.target.value)}
              value={state.scale}
              aria-label="Zoom level"
              title="Zoom level"
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
            >
              <RotateCw size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="adex-preview-panel" style={{ display: "flex" }}>
        <div
          className="adex-left-panel"
          style={{
            width: state.sidebar ? `${state.leftPanelWidth}px` : "0px",
            flexShrink: 0,
            transition: state.isDragging ? "none" : "0.2s width ease",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {state.pdfBlobUrl && (
            <div className="adex-preview-thumbs">
              <Document
                file={state.pdfBlobUrl}
                loading={
                  <div className="adex-thumb-loader">
                    <span className="thumb-loader"></span>
                    <span className="thumb-loader"></span>
                    <span className="thumb-loader"></span>
                  </div>
                }
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
              >
                {state.numPages &&
                  Array.from({ length: state.numPages }, (_, index) => (
                    <button
                      key={`thumb-${index}`}
                      className={`adex-page-thumb ${state.pageNumber === index + 1 ? "active" : ""
                        }`}
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
                    </button>
                  ))}
              </Document>
            </div>
          )}
        </div>

        {state.sidebar && (
          <div
            ref={resizeDividerRef}
            style={{
              width: "8px",
              cursor: "col-resize",
              background: "rgba(0, 0, 0, 0.05)",
              flexShrink: 0,
              zIndex: 10,
              position: "relative",
            }}
            onMouseDown={startResize}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "4px",
                height: "30px",
                borderRadius: "2px",
                background: "rgba(0, 0, 0, 0.2)",
              }}
            />
          </div>
        )}

        <div
          ref={previewRef}
          className="adex-preview"
          style={{ flex: 1, overflow: "auto" }}
        >
          {state.pdfBlobUrl && (
            <Document
              file={state.pdfBlobUrl}
              loading={
                <div className="adex-preview-loader">
                  <span className="page-loader"></span>
                  <span className="page-loader"></span>
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
                    className="adex-page"
                    aria-label={`Page ${index + 1} content`}
                    title={`Page ${index + 1} content`}
                  >
                    <Page
                      loading={
                        <div className="adex-preview-loader">
                          <span className="page-loader"></span>
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