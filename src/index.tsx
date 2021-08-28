import React from "react";
import ReactDOM from "react-dom";
import DailyIframe from "@daily-co/daily-js";
import App from "./app";

import "./index.css";

ReactDOM.render(
  //DailyIframe.supportedBrowser().supported ? <App /> : <BrowserUnsupported />,
  <App />,
  document.getElementById("root")
);
