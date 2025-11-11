export interface Annotation {
  id: string
  pageNumber: number
  type: "highlight" | "note" | "drawing"
  content?: string
  color: string
  position: {
    x: number
    y: number
    width?: number
    height?: number
  }
  points?: { x: number; y: number }[]
  createdAt: number
}

export interface OutlineItem {
  title: string
  dest?: any
  items?: OutlineItem[]
  pageNumber?: number
  expanded?: boolean
  id: string
}

export interface Bookmark {
  id: string
  title: string
  pageNumber: number
  createdAt: number
}

export interface PDFViewerProps {
  data: { url: string }
}