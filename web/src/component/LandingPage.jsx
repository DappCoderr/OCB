import bag from "../assets/bag.svg";
import Countdown from "./Countdown";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const targetDate = new Date(2024, 5, 9).getTime();
  return (
    <div className="grid place-items-center bg-[#000000] text-[#F5F5F5] min-h-screen p-8 sm:pl-16 sm:pr-16">
      <header className="flex flex-col sm:flex-row justify-between w-full h-auto sm:h-16 items-center">
        <div className="flex items-center justify-between w-full sm:w-auto mb-4 sm:mb-0">
          <img className="w-24 h-14" src="../../logo.svg" alt="Logo" />
          <Link
            className="ml-6 bg-[#F5F5F5] text-black px-4 py-2 rounded-md text-sm inline-block h-10 font-bold my-auto sm:ml-4"
            to={"https://tally.so/r/nr6Dkp"}
          >
            Join Waitlist
          </Link>
        </div>
        <div className="flex justify-end items-center w-full sm:w-auto font-serif">
          <Link to="/faq">
            <p className="cursor-pointer font-bold mr-4 hover:text-gray-400">
              FAQ
            </p>
          </Link>
          <a
            href="https://twitter.com/onchainbag"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="cursor-pointer font-bold hover:text-gray-400">X</p>
          </a>
        </div>
      </header>
      <div className="flex flex-col items-center text-4xl font-bold my-8">
        <div className="text-center text-2xl sm:flex sm:flex-col sm:items-center sm:text-4xl">
          <p className="text-2xl mb-8">Project Launch Countdown</p>
          <div className="border-b-2 border-t-2  border-white px-5 py-3">
            <Countdown targetDate={targetDate} />
          </div>
        </div>
      </div>
      <p className="text-gray-400 text-sm mt-2 font-bold">Example Bag</p>
      <div className="flex flex-wrap justify-center gap-5">
        <div className="flex flex-col text-center">
          <img
            className="w-72 h-72 border border-[#f5f5f5c4] rounded-lg hover:border-gray-400 transition duration-300"
            src={bag}
            alt=""
          />
        </div>
        <div className="flex flex-col text-center">
          <img
            className="w-72 h-72 border border-[#f5f5f5c4] rounded-md hover:border-gray-400 transition duration-300"
            src={bag}
            alt=""
          />
        </div>
        <div className="flex flex-col text-center">
          <img
            className="w-72 h-72 border border-[#f5f5f5c4] rounded-lg hover:border-gray-400 transition duration-300"
            src={bag}
            alt=""
          />
        </div>
      </div>
      <footer className="mt-8 text-center">
        <a
          className="font-bold text-gray-400 hover:text-white hover:underline"
          href="#"
        >
          Build on flow
        </a>
      </footer>
    </div>
  );
};

export default LandingPage;
