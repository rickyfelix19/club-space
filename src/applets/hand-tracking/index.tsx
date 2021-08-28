import React from "react";

const available = false;
const id = "hand-tracker";
const title = "Hand Tracking";
const icon =
  "https:////raw.githubusercontent.com/kulin-patel/Hand-Tracking/master/Output.png";
const description =
  "Track your hand movement using your webcam to discover a new world of gesture fun";

interface IProps {
  onClose?: any;
  isOpen?: boolean;
}

const Interface = ({ onClose, isOpen }: IProps) => {
  return <></>;
};

const Applet = { id, title, icon, description, available, Interface };

export default Applet;
