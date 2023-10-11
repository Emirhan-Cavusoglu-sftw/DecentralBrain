import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { BrowserRouter } from 'react-router-dom'


import { wagmiConfig, chains } from "./wagmi";
import { WagmiConfig } from "wagmi";

import { ChakraProvider } from "@chakra-ui/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <ChakraProvider>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider
          chains={chains}
          theme={{ lightMode: lightTheme(), darkMode: darkTheme() }}
          >
          <App />
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
          </BrowserRouter>
  </React.StrictMode>
);
