import React from "react";

const available = false;
const id = "humanity";
const title = "Cards Against Humanity";
const icon =
  "https://static.thenounproject.com/avatars/CAH/resized/150/cah_icon-01.png";
const description =
  "Play cards against humanity virtually, point out with your hands what card you want to pick and read out the cards your find most funny";

interface IProps {
  onClose?: any;
  isOpen?: boolean;
}

const Interface = ({ onClose, isOpen }: IProps) => {
  return <></>;
};

const Applet = { id, title, icon, description, available, Interface };

export default Applet;
