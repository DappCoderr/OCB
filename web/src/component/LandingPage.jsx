import bag from "../assets/bag.svg";
import Countdown from "./Countdown";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const targetDate = new Date(2024, 4, 30).getTime();
  return (
    <div className="grid place-items-center bg-[#090909] text-[#F5F5F5] min-h-screen p-8 sm:pl-16 sm:pr-16">
      <header className="grid w-full h-16 grid-cols-9 items-center">
        <h1 className="col-span-3 justify-self-start font-bold text-3xl font-serif">
          bag
          <Link
            className="ml-6 hover:bg-black hover:text-[#F5F5F5] mb-10 bg-[#F5F5F5] text-black px-6 py-2 rounded-md text-sm inline-block"
            to={"https://forms.gle/JHWcAdNkyKbf4jTR6"}
          >
            Join Waitlist
          </Link>
        </h1>

        <div className="col-span-3"></div>
        <div className="col-span-3 flex justify-end items-center font-serif">
          <Link to="/faq">
            <p className="cursor-pointer font-bold mr-6 hover:text-gray-400 ">
              Faq
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
      <div className="flex flex-wrap justify-center gap-5">
        <div className="flex flex-col text-center">
          <img
            className="w-72 h-72 border border-[#f5f5f5c4] rounded-lg hover:border-gray-400 transition duration-300"
            src={bag}
            alt=""
          />
          <p className="text-gray-400 text-sm mt-2">Example 1</p>
        </div>
        <div className="flex flex-col text-center">
          <img
            className="w-72 h-72 border border-[#f5f5f5c4] rounded-md hover:border-gray-400 transition duration-300"
            src={bag}
            alt=""
          />
          <p className="text-gray-400 text-sm mt-2">Example 2</p>
        </div>
        <div className="flex flex-col text-center">
          <img
            className="w-72 h-72 border border-[#f5f5f5c4] rounded-lg hover:border-gray-400 transition duration-300"
            src={bag}
            alt=""
          />
          <p className="text-gray-400 text-sm mt-2">Example 3</p>
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
