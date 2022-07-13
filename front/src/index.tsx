import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./main.css";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { theme } from "./styles/theme";
import { Global } from "./styles/Global";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Global />
    <MantineProvider theme={theme}>
        <App />
    </MantineProvider>
  </BrowserRouter>
);
