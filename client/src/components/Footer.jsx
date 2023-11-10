import React from "react";
import Logo from "../img/logo.png";

const Footer = () => {
  return (
    <footer>
      <img src={Logo} alt="" />
      <span>
        Made with Express.js and <b>React.js</b>.
      </span>
    </footer>
  );
};
//
export default Footer;
