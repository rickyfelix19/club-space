import React from "react";
import "./styles.css";

interface IProps {
  icon: string;
}

const AppIcon = ({ icon }: IProps) => {
  return <img className="app-icon" src={icon} alt="icon" />;
};

export default AppIcon;
