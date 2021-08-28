import React from "react";

const available = false;
const id = "sea";
const title = "Sea Tank";
const icon =
  "https://wompampsupport.azureedge.net/fetchimage?siteId=7575&v=2&jpgQuality=100&width=700&url=https%3A%2F%2Fi.kym-cdn.com%2Fentries%2Ficons%2Foriginal%2F000%2F035%2F572%2Fwater_monke_cover.jpg";
const description =
  "Experience life under the sea, interact with water as it fills your screen. Encounter ";

interface IProps {
  onClose?: any;
  isOpen?: boolean;
}

const Interface = ({ onClose, isOpen }: IProps) => {
  return <></>;
};

const Applet = { id, title, icon, description, available, Interface };

export default Applet;
