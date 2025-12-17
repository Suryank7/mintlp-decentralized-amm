import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { AptosWalletProvider } from "./contexts/AptosWalletContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AptosWalletProvider>
      <AppWrapper>
        <App />
      </AppWrapper>
    </AptosWalletProvider>
  </StrictMode>
);
