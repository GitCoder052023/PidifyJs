import { useState } from "react"

export const usePDFState = () => {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1)
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null)
  const [sidebar, setSidebar] = useState<boolean>(true)
  const [previewNumber, setPreviewNumber] = useState<number>(1)
  const [retryCount, setRetryCount] = useState<number>(0)
  const [retryTimeoutDelay, setRetryTimeoutDelay] = useState<number>(1000)
  const [metadata, setMetadata] = useState<any>(null)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [pageRotations, setPageRotations] = useState<{ [key: number]: number }>({})
  const [pdfDocument, setPdfDocument] = useState<any>(null)
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(250)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [leftPanel, setLeftPanel] = useState<number>(0)

  return {
    numPages,
    setNumPages,
    pageNumber,
    setPageNumber,
    scale,
    setScale,
    pdfBlobUrl,
    setPdfBlobUrl,
    sidebar,
    setSidebar,
    previewNumber,
    setPreviewNumber,
    retryCount,
    setRetryCount,
    retryTimeoutDelay,
    setRetryTimeoutDelay,
    metadata,
    setMetadata,
    isMobile,
    setIsMobile,
    pageRotations,
    setPageRotations,
    pdfDocument,
    setPdfDocument,
    leftPanelWidth,
    setLeftPanelWidth,
    isDragging,
    setIsDragging,
    leftPanel,
    setLeftPanel,
  }
}