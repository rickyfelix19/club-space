import React from "react";

const available = false;
const id = "ping-pong";
const title = "Ping Pong";
const icon =
  "https://cdn.dribbble.com/users/4356437/screenshots/15508580/media/7842aa6e503621067792187c6d93d46c.png?compress=1&resize=400x300";
const description =
  "Wield a virtual bat as you rally against your next challenger in an Augmented Reality ping pong tournament";

interface IProps {
  onClose?: any;
  isOpen?: boolean;
}

const Interface = ({ onClose, isOpen }: IProps) => {
  return <></>;
};

const Applet = { id, title, icon, description, available, Interface };

export default Applet;
