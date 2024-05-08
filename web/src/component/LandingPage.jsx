import bag from "../assets/bag.svg";
import Countdown from "./Countdown";

const LandingPage = () => {
  const targetDate = new Date(2024, 4, 30).getTime();
  return (
    <div className="grid place-items-center bg-black text-white min-h-screen p-8">
      <header className="grid w-full h-16 grid-cols-9 items-center">
        <h1 className="col-span-3 justify-self-start font-bold text-3xl">
          bag_
        </h1>
        <div className="col-span-3"></div>
        <div className="col-span-3 flex justify-end items-center">
          <p className="cursor-pointer font-bold mr-6 hover:text-gray-400">
            Faq
          </p>
          <p className="cursor-pointer font-bold hover:text-gray-400">X</p>
        </div>
      </header>
      <div className="flex flex-col items-center text-4xl font-bold my-8">
        <div className="text-center text-4xl sm:flex sm:flex-col sm:items-center sm:text-8xl">
          <Countdown targetDate={targetDate} />
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-5">
        <img
          className="w-72 h-72 border-2 border-slate-300 rounded-lg hover:border-gray-400 transition duration-300"
          src={bag}
          alt=""
        />
        <img
          className="w-72 h-72 border-2 border-slate-300 rounded-lg hover:border-gray-400 transition duration-300"
          src={bag}
          alt=""
        />
        <img
          className="w-72 h-72 border-2 border-slate-300 rounded-lg hover:border-gray-400 transition duration-300"
          src={bag}
          alt=""
        />
      </div>
      <footer className="mt-auto mt-8 text-center">
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
