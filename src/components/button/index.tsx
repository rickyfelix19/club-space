import React from "react";
import "./styles.css";

interface IProps {
  children?: any;
  alt?: boolean;
  onClick?: any;
}

const Button = ({ children, alt, onClick }: IProps) => (
  <>
    {!alt && (
      <button
        className="landing-button"
        onClick={() => {
          onClick && onClick();
        }}
      >
        {children}
      </button>
    )}
    {alt && (
      <button
        className="landing-button-alt"
        onClick={() => {
          onClick && onClick();
        }}
      >
        {children}
      </button>
    )}
  </>
);
export default Button;
