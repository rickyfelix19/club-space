import React from "react";
import "./styles.css";

interface IProps {
  children?: any;
  alt?: boolean;
}

const Button = ({ children, alt }: IProps) => (
  <>
    {!alt && <button className="landing-button">{children}</button>}
    {alt && <button className="landing-button-alt">{children}</button>}
  </>
);
export default Button;
