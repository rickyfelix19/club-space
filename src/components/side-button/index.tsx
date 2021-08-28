import React from "react";
import "./styles.css";

interface IProps {
  children?: any;
  onClick?: any;
}

const SideButton = ({ children, onClick }: IProps) => {
  return (
    <button
      className="side-general-btn"
      onClick={() => {
        onClick && onClick();
      }}
    >
      {children}
    </button>
  );
};

export default SideButton;
