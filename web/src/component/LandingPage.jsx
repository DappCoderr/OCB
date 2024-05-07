import bag from "../assets/bag.svg";
import Countdown from "./Countdown";

const LandingPage = () => {
  const targetDate = new Date(2024, 4, 30).getTime();
  return (
    <div className="grid place-items-center bg-black text-slate-200 h-screen">
      <header className="grid w-full h-16 grid-flow-col place-items-stretc">
        <h1 className="flex scol-span-3 justify-center items-center font-bold white text-3xl">
          bag_
        </h1>
        <div className="col-span-6"></div>
        <div className="flex flex-row scol-span-3 justify-center items-center">
          <p className="cursor-pointer font-bold mr-6">Faq</p>
          <p className="cursor-pointer font-bold">X</p>
        </div>
      </header>
      {/* <div className="flex justify-center items-center w-96">
        <p>
          bag is an pioneering on-chain avatar box, including weapons, helmet,
          ring, cloth & necklace etc. Bag will be the first nft project
          utilizing flow VRF with total 8888 unique nfts on flow!!
        </p>
      </div> */}
      <div className="flex flex-col items-center text-4xl font-bold">
        <h1 className="mb-8">Count-Down</h1>
        <Countdown targetDate={targetDate} />
      </div>
      <div className="flex flex-row gap-5">
        <img
          className="w-72 h-72 border-solid border-2 border-slate-300 rounded-lg"
          src={bag}
          alt=""
        />
        <img
          className="w-72 h-72 border-solid border-2 border-slate-300 rounded-lg"
          src={bag}
          alt=""
        />
        <img
          className="w-72 h-72 border-solid border-2 border-slate-300 rounded-lg"
          src={bag}
          alt=""
        />
      </div>
      <footer>
        <a className="font-bold" href="#">
          Build on flow
        </a>
      </footer>
    </div>
  );
};

export default LandingPage;
