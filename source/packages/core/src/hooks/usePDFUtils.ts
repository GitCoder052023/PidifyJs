import { useCallback } from "react"

export const usePDFUtils = () => {
  const debounce = useCallback((func: any, delay: any) => {
    let timeoutId: any
    return (...args: any[]) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        func(...args)
      }, delay)
    }
  }, [])


  const calculateRotation = useCallback((currentRotation: number, clockwise: boolean) => {
    const newRotation = (currentRotation + (clockwise ? 90 : -90)) % 360
    return newRotation < 0 ? newRotation + 360 : newRotation
  }, [])

  const generatePathData = useCallback((points: { x: number; y: number }[]) => {
    return points.reduce((path, point, index) => {
      return path + (index === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`)
    }, "")
  }, [])

  return {
    debounce,
    calculateRotation,
    generatePathData
  }
}
