import React from "react";
import ReactDOM from "react-dom";
import DailyIframe from "@daily-co/daily-js";
import App from "./components/app";
import BrowserUnsupported from "./components/browser-unsupported";

import "./index.css";

ReactDOM.render(
  DailyIframe.supportedBrowser().supported ? <App /> : <BrowserUnsupported />,
  document.getElementById("root")
);
