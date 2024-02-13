import React from "react";
import bag from "../assets/bag.svg";
import "./Landing.css";

const LandingPage = () => {
  return (
    <div className="landing_page">
      <header>
        <div className="logo">bag_</div>
      </header>
      <main>
        <div className="content">
          <p>
            bag is a first every randomize gear box NFT completely on-chian and
            also a first every NFT project using Flow VRF. There are total 4444
            nft for sale.
          </p>
          <p>Launching Soon....</p>
        </div>
        <div className="image_wrapper">
          <img src={bag} />
          <img src={bag} />
          <img src={bag} />
        </div>
      </main>
      <footer>
        <section>
          <div>Build on Flow</div>
          <div>Flow Logo</div>
        </section>
      </footer>
    </div>
  );
};

export default LandingPage;
