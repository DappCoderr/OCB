// import bag from "../assets/bag.svg";
import "./Landing.css";

const LandingPage = () => {
  const mainTitle = `
  bag is an pioneering on-chain avatar box, and the first nft project
  utilizing flow VRF. Explore 4444 unique nfts available for purchase on Flow!!
  
  Launching Soon....
  `;

  const footerTitle = `
  Build on Flow
  `;

  return (
    <div className="landing_page">
      <header>
        <div className="logo">bag_</div>
      </header>
      <main>
        <pre dangerouslySetInnerHTML={{ __html: mainTitle }} />
      </main>
      <footer>
        <pre dangerouslySetInnerHTML={{ __html: footerTitle }} />
      </footer>
    </div>
  );
};

export default LandingPage;
