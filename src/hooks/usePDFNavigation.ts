import { useCallback, useEffect, type MutableRefObject } from "react"

export const usePDFNavigation = (
  pageNumber: number,
  setPageNumber: (page: number) => void,
  setPreviewNumber: (page: number) => void,
  numPages: number | null,
  pageRefs: MutableRefObject<{ [key: number]: HTMLDivElement | null }>,
  previewRef: MutableRefObject<HTMLDivElement | null>,
  debounce: (func: any, delay: any) => (...args: any[]) => void,
) => {
  const goToPage = useCallback((pageNum: number) => {
    setPreviewNumber(pageNum)
    setPageNumber(pageNum)
    const pageEl = pageRefs.current[pageNum]
    if (pageEl) {
      pageEl.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [setPageNumber, setPreviewNumber, pageRefs])

  const updatePage = useCallback(
    (__page: number) => {
      if (__page > 0 && numPages !== null && __page <= numPages) {
        goToPage(__page)
      } else {
        setPreviewNumber(pageNumber)
      }
    },
    [goToPage, numPages, pageNumber, setPreviewNumber],
  )

  const updatePDFPage = useCallback(
    (e: any) => {
      const __page = Number(e.target.value)
      setPreviewNumber(__page)
      debounce(() => updatePage(__page), 500)
    },
    [debounce, updatePage, setPreviewNumber],
  )

  // Handle scroll to track current page
  useEffect(() => {
    const handleScroll = () => {
      if (!previewRef.current) return

      let closestPage: number = pageNumber

      Object.entries(pageRefs.current).forEach(([pageNum, pageEl]) => {
        if (pageEl instanceof HTMLElement) {
          const { top, bottom } = pageEl.getBoundingClientRect()
          if (top <= window.innerHeight / 2 && bottom >= 0) {
            closestPage = Number(pageNum)
          }
        }
      })
      setPreviewNumber(closestPage)
      setPageNumber(closestPage)
    }

    const debouncedHandleScroll = debounce(handleScroll, 500)

    const scrollContainer = previewRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", debouncedHandleScroll)
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", debouncedHandleScroll)
      }
    }
  }, [pageNumber, numPages, pageRefs, previewRef, setPageNumber, setPreviewNumber, debounce])

  const rotatePage = useCallback((pageNum: number, setPageRotations: any, calculateRotation: any, clockwise = true) => {
    setPageRotations((prev: any) => {
      const currentRotation = prev[pageNum] || 0
      const newRotation = calculateRotation(currentRotation, clockwise)
      return { ...prev, [pageNum]: newRotation }
    })
  }, [])

  return {
    goToPage,
    updatePage,
    updatePDFPage,
    rotatePage,
  }
}