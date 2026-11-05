import "@fontsource/redaction/400.css";
import "@fontsource/redaction/400-italic.css";
import "@fontsource/redaction/700.css";
import "@fontsource-variable/plus-jakarta-sans/wght.css";
import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import { captureUtm } from "./lib/api";

captureUtm();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
