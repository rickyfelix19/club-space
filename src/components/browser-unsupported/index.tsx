import React from "react";
import "./styles.css";

const BrowserUnsupported = () => (
  <p className="browser-unsupported">
    Looks like you need to upgrade your browser to make Daily video calls.
    <br />
    See&nbsp;
    <a href="https://docs.daily.co/docs/browsers">this page</a>
    &nbsp;for help getting on a supported browser version.
  </p>
);

export default BrowserUnsupported;
