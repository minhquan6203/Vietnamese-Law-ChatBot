import robot_img from "../assets/robot_image.png";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="flex items-center justify-center hero min-h-screen h-full w-full bg-gradient-to-r from-blue-900 via-purple-900 to-black text-white">
      <div className="hero-content text-center min-w-[200px]">
        <div className="max-w-md flex-1">
          <img
            className="block w-[200px] h-auto mx-auto"
            src={robot_img}
            alt="Robot"
          />
          <h1 className="text-2xl lg:text-5xl font-bold [&::selection]:text-base-content brightness-100 contrast-150 [&::selection]:bg-blue-950">
            Xin chào! Mình là
          </h1>
          <h1 className="text-3xl lg:text-5xl font-bold bg-[linear-gradient(90deg,#a1c4fd,#c2e9fb)] bg-clip-text text-transparent">
            Chatbot-law
          </h1>
          <p className="py-6 font-semibold lg:text-lg text-sm">
            Mình ở đây để giúp con đừng bạn đến với nhà tù xa nhất có thể!!!
          </p>
          <Link to="/chat">
            <button className="btn btn-primary bg-gradient-to-r from-purple-600 to-blue-500 border-none">
              Bắt đầu ngay
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
