import React, { useEffect, useState } from "react";
import { allApps, Application } from "../../applets";
import Icon from "../icon";
import PopUp from "../pop-up";
import Applet from "./applet";
import "./styles.css";

interface IPros {
  onClose?: any;
  applications: Application[];
  onAppsChange?: any;
}

const MarketPlace = ({ onClose, applications, onAppsChange }: IPros) => {
  const [selectedApps, setSelectedApps] = useState<Application[]>([
    ...applications,
  ]);

  const getAppIndex = (app: Application) => {
    let index = -1;
    if (selectedApps.length > 0) {
      selectedApps.forEach((a: Application, i) => {
        if (a.id === app.id) {
          index = i;
        }
      });
    }
    return index;
  };

  useEffect(() => {
    onAppsChange && onAppsChange(selectedApps);
    // @ts-ignore
  }, [selectedApps]);

  const toggleApp = (app: Application) => {
    const newAppList: Application[] = [];
    let removing = false;
    selectedApps.forEach((a) => {
      if (app.id !== a.id) {
        newAppList.push(a);
      } else {
        removing = true;
      }
    });

    if (!removing) {
      newAppList.push(app);
    }

    setSelectedApps(newAppList);
  };

  return (
    <PopUp>
      <div className="market-wrapper">
        <div className="market-heading">
          <p>Marketplace</p>
          <button
            onClick={() => {
              onClose && onClose();
            }}
          >
            <Icon type="cross" />
          </button>
        </div>
        <div className="store-applets">
          <div>
            {allApps.map((app) => (
              <Applet
                onToggle={toggleApp}
                app={app}
                isInstalled={getAppIndex(app) !== -1}
              />
            ))}
          </div>
        </div>
      </div>
    </PopUp>
  );
};

export default MarketPlace;
