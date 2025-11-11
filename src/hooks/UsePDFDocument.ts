import { INITIAL_RETRY_DELAY, MAX_RETRIES } from "@/constants/PDFViewer.consts"
import { useEffect } from "react"

export const usePDFDocument = (
  data: { url: string } | undefined,
  retryCount: number,
  setRetryCount: (count: number) => void,
  retryTimeoutDelay: number,
  setRetryTimeoutDelay: (delay: number) => void,
  pdfBlobUrl: string | null,
  setPdfBlobUrl: (url: string | null) => void,
) => {

  useEffect(() => {
    let retryTimer: ReturnType<typeof setTimeout> | null = null

    const fetchPdfBlob = async () => {
      try {
        const response = await fetch(data?.url!)
        if (!response.ok) throw new Error("Failed to fetch PDF")

        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setPdfBlobUrl(url)
        setRetryCount(0)

        if (retryTimer) {
          clearTimeout(retryTimer)
          retryTimer = null
        }
      } catch (error) {
        console.error(`Failed to load PDF (Attempt ${retryCount + 1}):`, error)
        if (retryCount < MAX_RETRIES) {
          retryTimer = setTimeout(() => {
            setRetryCount(retryCount + 1)
          }, retryTimeoutDelay)
          setRetryTimeoutDelay(retryTimeoutDelay * 2)
        }
      }
    }

    if (data?.url) fetchPdfBlob()

    return () => {
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl)
      if (retryTimer) clearTimeout(retryTimer)
    }
  }, [data?.url, retryCount])

  return {
    MAX_RETRIES,
    INITIAL_RETRY_DELAY,
  }
}