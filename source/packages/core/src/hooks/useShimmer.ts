import { useEffect } from "react"
import type React from "react"

export const useShimmer = (ref: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const element = ref.current
    if (!element) return undefined
    
    element.style.backgroundColor = "#f6f7f8"
    element.style.backgroundImage =
      "linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%)"
    element.style.backgroundSize = "1000px 170px"
    element.style.backgroundPosition = "-468px 0"

    const animation = element.animate(
      [
        { backgroundPosition: "-468px 0" },
        { backgroundPosition: "468px 0" },
      ],
      {
        duration: 1000,
        easing: "linear",
        iterations: Infinity,
        fill: "forwards",
      },
    )

    return () => {
      animation.cancel()
    }
  }, [ref])
}
