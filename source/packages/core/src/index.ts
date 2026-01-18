import PDFViewer from "./components/PDFViewer"
export { PDFViewer }

export * from "./hooks/usePDFState"
export * from "./hooks/usePDFUtils"
export * from "./hooks/usePDFDocument"
export * from "./hooks/usePDFNavigation"
export * from "./hooks/usePDFResponsive"
export * from "./hooks/useShimmer"

export type {
  Annotation,
  OutlineItem,
  Bookmark,
  PDFViewerProps,
} from "./types/PDFViewer.types"

export {
  SCALE_SETS,
  DEFAULT_PAGE,
  MOBILE_BREAKPOINT,
  DEFAULT_LEFT_PANEL_WIDTH,
  MIN_PANEL_WIDTH,
  MAX_PANEL_WIDTH,
  MAX_RETRIES,
  INITIAL_RETRY_DELAY,
  TEXT_LAYER_ENABLED,
  TOOLBAR_VISIBLE_BY_DEFAULT,
} from "./constants/PDFViewer.consts"
