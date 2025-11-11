import React from "react";
import PDFViewer from "./components/PDFViewer";

function App() {
  return (
    <PDFViewer data={{ url: "YOUR_PDF_URL" }} />
  );
}

export default App;