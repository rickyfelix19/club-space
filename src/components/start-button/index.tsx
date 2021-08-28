import React from "react";
import "./styles.css";

/**
 * Props:
 * - disabled: boolean
 * - onClick: () => ()
 */
export default function StartButton(props: any) {
  return (
    <button
      className="start-button"
      disabled={props.disabled}
      onClick={props.onClick}
    >
      Click to start a call
    </button>
  );
}
