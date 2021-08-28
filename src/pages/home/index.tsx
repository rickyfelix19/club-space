import React from "react";
import NavBar from "./nav-bar";
import "./styles.css";

import screenshot1 from "../../assets/screenshot-1.png";

const Home = () => (
  <div>
    <NavBar />
    <div className="home-section-1">
      <div>
        <div className="section-heading">A better way to form communities</div>
        <div className="section-paragraph">
          Create your own unique virtual space and bring your events, game
          nights and communities to life
          <button>Get started for free</button>
        </div>
      </div>
      <div>
        <img src={screenshot1} alt="screenshot" />
      </div>
    </div>
  </div>
);

export default Home;
