import React from "react";
import Icon from "../icon";
import "./styles.css";

interface IProps {
  title: string;
  onClose?: any;
  children?: any;
}

const AppSideMenu = ({ title, onClose, children }: IProps) => (
  <div className="application-menu">
    <div className="application-menu-heading">
      <p>{title}</p>
      <button
        onClick={() => {
          onClose && onClose();
        }}
      >
        <Icon type="cross" />
      </button>
    </div>
    <div className="application-menu-body">
      <div>{children}</div>
    </div>
  </div>
);

export default AppSideMenu;
