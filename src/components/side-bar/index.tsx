import React from "react";
import TrayButton, { TYPE_LEAVE } from "../tray-button";
import "./styles.css";

import logoSquare from "../../assets/logo-square.svg";

interface IProps {
  onClickLeaveCall: any;
  disabled?: boolean;
}

const SideBar = ({ onClickLeaveCall, disabled }: IProps) => {
  function leaveCall() {
    onClickLeaveCall && onClickLeaveCall();
  }
  return (
    <div className="side-nav">
      <img src={logoSquare} className="square-logo" alt="logo" />
      <div>
        <TrayButton
          type={TYPE_LEAVE}
          disabled={disabled}
          newButtonGroup={true}
          highlighted={true}
          onClick={leaveCall}
        />
      </div>
    </div>
  );
};

export default SideBar;
