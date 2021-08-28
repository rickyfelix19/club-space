import React from "react";
import "./styles.css";

interface IProps {
  children?: any;
}

const PopUp = ({ children }: IProps) => (
  <div className="pop-overlay">
    {children}
    <div className="pop-bg"></div>
  </div>
);
export default PopUp;
