import React, { useEffect, useState, useCallback } from "react";
import DailyIframe from "@daily-co/daily-js";

import Call from "../components/call";
import api from "../lib/api";
import Tray from "../components/tray";
import CallObjectContext from "../lib/callContext";
import { roomUrlFromPageUrl, pageUrlFromRoomUrl } from "../lib/urls";
import { logDailyEvent } from "../lib/logger";

import "./styles.css";
import NavBar from "../components/nav-bar";

import screenshot1 from "../assets/screenshot-1.png";
import SideBar from "../components/side-bar";
import MarketPlace from "../components/marketplace";
import { Application } from "../applets";

const STATE_IDLE = "STATE_IDLE";
const STATE_CREATING = "STATE_CREATING";
const STATE_JOINING = "STATE_JOINING";
const STATE_JOINED = "STATE_JOINED";
const STATE_LEAVING = "STATE_LEAVING";
const STATE_ERROR = "STATE_ERROR";

export default function App() {
  const [appState, setAppState] = useState<any>(STATE_IDLE);
  const [roomUrl, setRoomUrl] = useState<any>(null);
  const [callObject, setCallObject] = useState<any>(null);
  const [storeOpen, setStoreOpen] = useState(true);
  const [apps, setApps] = useState<Application[]>([]);

  /**
   * Creates a new call room.
   */
  const createCall = useCallback(() => {
    setAppState(STATE_CREATING);
    return api
      .createRoom()
      .then((room) => room.url)
      .catch((error) => {
        console.log("Error creating room", error);
        setRoomUrl(null);
        setAppState(STATE_IDLE);
      });
  }, []);

  /**
   * Starts joining an existing call.
   *
   * NOTE: In this demo we show how to completely clean up a call with destroy(),
   * which requires creating a new call object before you can join() again.
   * This isn't strictly necessary, but is good practice when you know you'll
   * be done with the call object for a while and you're no longer listening to its
   * events.
   */
  const startJoiningCall = useCallback((url) => {
    const newCallObject: any = DailyIframe.createCallObject();
    setRoomUrl(url);
    setCallObject(newCallObject);
    setAppState(STATE_JOINING);
    newCallObject.join({ url });
  }, []);

  /**
   * Starts leaving the current call.
   */
  const startLeavingCall = useCallback(() => {
    if (!callObject) return;
    // If we're in the error state, we've already "left", so just clean up
    if (appState === STATE_ERROR) {
      callObject.destroy().then(() => {
        setRoomUrl(null);
        setCallObject(null);
        setAppState(STATE_IDLE);
      });
    } else {
      setAppState(STATE_LEAVING);
      callObject.leave();
    }
  }, [callObject, appState]);

  /**
   * If a room's already specified in the page's URL when the component mounts,
   * join the room.
   */
  useEffect(() => {
    const url = roomUrlFromPageUrl();
    url && startJoiningCall(url);
  }, [startJoiningCall]);

  /**
   * Update the page's URL to reflect the active call when roomUrl changes.
   *
   * This demo uses replaceState rather than pushState in order to avoid a bit
   * of state-management complexity. See the comments around enableCallButtons
   * and enableStartButton for more information.
   */
  useEffect(() => {
    const pageUrl = pageUrlFromRoomUrl(roomUrl);
    if (pageUrl === window.location.href) return;
    // @ts-ignore
    window.history.replaceState(null, null, pageUrl);
  }, [roomUrl]);

  /**
   * Uncomment to attach call object to window for debugging purposes.
   */
  // useEffect(() => {
  //   window.callObject = callObject;
  // }, [callObject]);

  /**
   * Update app state based on reported meeting state changes.
   *
   * NOTE: Here we're showing how to completely clean up a call with destroy().
   * This isn't strictly necessary between join()s, but is good practice when
   * you know you'll be done with the call object for a while and you're no
   * longer listening to its events.
   */
  useEffect(() => {
    if (!callObject) return;

    const events = ["joined-meeting", "left-meeting", "error"];

    function handleNewMeetingState(event: any) {
      event && logDailyEvent(event);
      switch (callObject.meetingState()) {
        case "joined-meeting":
          setAppState(STATE_JOINED);
          break;
        case "left-meeting":
          callObject.destroy().then(() => {
            setRoomUrl(null);
            setCallObject(null);
            setAppState(STATE_IDLE);
          });
          break;
        case "error":
          setAppState(STATE_ERROR);
          break;
        default:
          break;
      }
    }

    // Use initial state
    // @ts-ignore
    handleNewMeetingState();

    // Listen for changes in state
    for (const event of events) {
      callObject.on(event, handleNewMeetingState);
    }

    // Stop listening for changes in state
    return function cleanup() {
      for (const event of events) {
        callObject.off(event, handleNewMeetingState);
      }
    };
  }, [callObject]);

  /**
   * Listen for app messages from other call participants.
   */
  useEffect(() => {
    if (!callObject) {
      return;
    }

    function handleAppMessage(event: any) {
      if (event) {
        logDailyEvent(event);
        console.log(`received app message from ${event.fromId}: `, event.data);
      }
    }

    callObject.on("app-message", handleAppMessage);

    return function cleanup() {
      callObject.off("app-message", handleAppMessage);
    };
  }, [callObject]);

  /**
   * Show the call UI if we're either joining, already joined, or are showing
   * an error.
   */
  const showCall = [STATE_JOINING, STATE_JOINED, STATE_ERROR].includes(
    appState
  );

  /**
   * Only enable the call buttons (camera toggle, leave call, etc.) if we're joined
   * or if we've errored out.
   *
   * !!!
   * IMPORTANT: calling callObject.destroy() *before* we get the "joined-meeting"
   * can result in unexpected behavior. Disabling the leave call button
   * until then avoids this scenario.
   * !!!
   */
  const enableCallButtons = [STATE_JOINED, STATE_ERROR].includes(appState);

  /**
   * Only enable the start button if we're in an idle state (i.e. not creating,
   * joining, etc.).
   *
   * !!!
   * IMPORTANT: only one call object is meant to be used at a time. Creating a
   * new call object with DailyIframe.createCallObject() *before* your previous
   * callObject.destroy() completely finishes can result in unexpected behavior.
   * Disabling the start button until then avoids that scenario.
   * !!!
   */
  const enableStartButton = appState === STATE_IDLE;
  return (
    <div className="app">
      {showCall ? (
        <div className="callWrapper">
          {storeOpen && (
            <MarketPlace
              onClose={() => {
                setStoreOpen(false);
              }}
              applications={apps}
              onAppsChange={(appList: Application[]) => {
                setApps(appList);
              }}
            />
          )}
          <CallObjectContext.Provider value={callObject}>
            <SideBar
              disabled={!enableCallButtons}
              onClickLeaveCall={startLeavingCall}
              onMarketClick={() => {
                setStoreOpen(true);
              }}
              applications={apps}
            />
            <div className="mainCallContent">
              <Call roomUrl={roomUrl} />
              <Tray disabled={!enableCallButtons} />
            </div>
          </CallObjectContext.Provider>
        </div>
      ) : (
        <div>
          <NavBar
            onClickStart={() => {
              createCall().then((url) => startJoiningCall(url));
            }}
          />
          <div className="home-section-1">
            <div>
              <div className="section-heading">
                A better way to form communities
              </div>
              <div className="section-paragraph">
                Create your own unique virtual space and bring your events, game
                nights and communities to life
                <button
                  disabled={!enableStartButton}
                  onClick={() => {
                    createCall().then((url) => startJoiningCall(url));
                  }}
                >
                  Get started for free
                </button>
              </div>
            </div>
            <div>
              <img src={screenshot1} alt="screenshot" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
