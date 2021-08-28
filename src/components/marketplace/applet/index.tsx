import React from "react";
import { Application } from "../../../applets";
import "./styles.css";

interface IProps {
  onToggle?: any;
  app: Application;
  isInstalled: boolean;
}

const Applet = ({ onToggle, app, isInstalled }: IProps) => {
  return (
    <div className="applet-wrapper">
      <div className="applet-heading">
        <div>{app.title}</div>
        <img className="applet-icon" src={app.icon} alt={app.title} />
      </div>
      <div className="applet-description">{app.description}</div>
      <div className="applet-button-holder">
        {app.available ? (
          <>
            {!isInstalled && (
              <button
                className="install-button"
                onClick={() => {
                  onToggle && onToggle(app);
                }}
              >
                Add
              </button>
            )}
            {isInstalled && (
              <button
                className="remove-button"
                onClick={() => {
                  onToggle && onToggle(app);
                }}
              >
                Remove
              </button>
            )}
          </>
        ) : (
          <button className="app-disabled-button" disabled>
            Coming soon
          </button>
        )}
      </div>
    </div>
  );
};

export default Applet;
