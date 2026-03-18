import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";

import { PortfolioProvider } from "./app/context/portfolio-context";

createRoot(document.getElementById("root")!).render(
  <PortfolioProvider>
    <App />
  </PortfolioProvider>
);