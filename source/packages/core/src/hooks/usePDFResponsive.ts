import { DEFAULT_LEFT_PANEL_WIDTH, MAX_PANEL_WIDTH, MIN_PANEL_WIDTH, MOBILE_BREAKPOINT } from "../constants/PDFViewer.consts"
import { useEffect, useCallback, type MutableRefObject } from "react"

export const usePDFResponsive = (
  setIsMobile: (mobile: boolean) => void,
  isDragging: boolean,
  setIsDragging: (dragging: boolean) => void,
  leftPanelWidth: number,
  setLeftPanelWidth: (width: number) => void,
  isMobile: boolean,
  setSidebar: (sidebar: boolean) => void,
  startXRef: MutableRefObject<number>,
  startWidthRef: MutableRefObject<number>,
) => {
  // Check mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [setIsMobile])

  // Handle dragging and mobile sidebar
  useEffect(() => {
    if (isMobile) {
      setSidebar(false)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const deltaX = e.clientX - startXRef.current
      let newWidth = startWidthRef.current + deltaX

      newWidth = Math.max(MIN_PANEL_WIDTH, Math.min(MAX_PANEL_WIDTH, newWidth))
      setLeftPanelWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.body.style.cursor = "default"
      document.body.style.userSelect = "auto"
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isMobile, isDragging, setLeftPanelWidth, setIsDragging, setSidebar, startXRef, startWidthRef])

  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    startXRef.current = e.clientX
    startWidthRef.current = leftPanelWidth
    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"
  }, [leftPanelWidth, setIsDragging])

  return {
    startResize,
    MOBILE_BREAKPOINT,
    DEFAULT_LEFT_PANEL_WIDTH,
    MIN_PANEL_WIDTH,
    MAX_PANEL_WIDTH,
  }
}
