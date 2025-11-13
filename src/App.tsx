import React from "react";
import PDFViewer from "./components/PDFViewer";

function App() {
  return (
    <PDFViewer data={{ url: "http://192.168.1.4:5000/api/v1/beta/pdfs/UP-Board-SST-2026" }} />
  );
}

export default App;