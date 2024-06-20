
import robot_img from "../assets/robot_image.png";
import { useState, useRef, useEffect } from "react";
import ScaleLoader from "react-spinners/ScaleLoader";
import { TypeAnimation } from "react-type-animation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";

function ChatBot(props) {
  const messagesEndRef = useRef(null);
  const [timeOfRequest, setTimeOfRequest] = useState(0);
  const [promptInput, setPromptInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGen, setIsGen] = useState(false);
  const [dataChat, setDataChat] = useState([
    [
      "start",
      [
        "Lúc bạn tìm đến tôi thì chắc bạn cũng đã phạm một lỗi lầm nào đó có thể đi tù. Hãy để tôi an ủi tâm hồn của bạn bằng thông tin những bản án bạn có thể nhận. 😄",
        null,
      ],
    ],
  ]);

  useEffect(() => {
    ScrollToEndChat();
  }, [dataChat]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOfRequest((prevTime) => prevTime + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const ScrollToEndChat = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const onChangeHandler = (event) => {
    setPromptInput(event.target.value);
  };

  const SendMessageChat = async () => {
    if (promptInput && !isLoading) {
      setTimeOfRequest(0);
      setIsGen(true);
      setPromptInput("");
      setIsLoading(true);
      setDataChat((prev) => [...prev, ["end", [promptInput]]]);
      setChatHistory((prev) => [promptInput, ...prev]);

      try {
        const response = await axios.post(
          "http://38.80.122.119:49594/chat",
          { message: promptInput },
          { headers: { "Content-Type": "application/json" } }
        );

        setDataChat((prev) => [
          ...prev,
          ["start", [response.data.response]],
          ["start", ["Các tài liệu liên quan:", response.data.retriever.join("\n")]],
        ]);
      } catch (error) {
        setDataChat((prev) => [
          ...prev,
          ["start", ["Lỗi, không thể kết nối với server"]],
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      SendMessageChat();
    }
  };

  const clearChat = () => {
    setDataChat([
      [
        "start",
        [
          "Lúc bạn tìm đến tôi thì chắc bạn cũng đã phạm một lỗi lầm nào đó có thể đi tù. Hãy để tôi an ủi tâm hồn của bạn bằng thông tin những bản án bạn có thể nhận. 😄",
          null,
        ],
      ],
    ]);
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-black min-h-screen h-full">
      <div className="hidden lg:block drawer-side absolute w-64 h-[20vh] left-3 mt-2 drop-shadow-md">
        <div className="menu p-4 w-full min-h-full bg-gray-800 text-white rounded-2xl mt-3 overflow-auto scroll-y-auto max-h-[80vh]">
          <ul className="menu text-sm">
            <h2 className="font-bold mb-2 text-white">Lịch sử trò chuyện</h2>
            {chatHistory.length === 0 ? (
              <p className="text-sm text-gray-500">Hiện chưa có cuộc hội thoại nào</p>
            ) : (
              chatHistory.map((mess, i) => (
                <li key={i}>
                  <p>
                    <FontAwesomeIcon icon={faMessage} />
                    {mess.length < 20 ? mess : mess.slice(0, 20) + "..."}
                  </p>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div className="flex justify-center h-[80vh]">
        <div
          id="chat-area"
          className="mt-5 text-sm scrollbar-thin scrollbar-thumb-gray-500 bg-gray-900 scrollbar-thumb-rounded-full scrollbar-track-rounded-full rounded-3xl border-2 md:w-[60%] md:p-3 p-1 w-full overflow-auto scroll-y-auto h-[75%]"
        >
          {dataChat.map((dataMessages, i) =>
            dataMessages[0] === "start" ? (
              <div className="chat chat-start drop-shadow-md" key={i}>
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full border-2 border-blue-500">
                    <img className="scale-150" src={robot_img} />
                  </div>
                </div>
                <div className="chat-bubble chat-bubble-info break-words bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white">
                  <TypeAnimation
                    style={{ whiteSpace: "pre-line" }}
                    sequence={[
                      dataMessages[1][0],
                      () => setIsGen(false),
                    ]}
                    cursor={false}
                    speed={100}
                  />
                  {dataMessages[1][1] && (
                    <div className="text-xs mt-2 text-gray-200">{dataMessages[1][1]}</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="chat chat-end" key={i}>
                <div className="chat-bubble shadow-xl chat-bubble-primary bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white">
                  {dataMessages[1][0]}
                </div>
              </div>
            )
          )}
          {isLoading && (
            <div className="chat chat-start">
              <div className="chat-image avatar">
                <div className="w-10 rounded-full border-2 border-blue-500">
                  <img src={robot_img} />
                </div>
              </div>
              <div className="chat-bubble chat-bubble-info bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white">
                <ScaleLoader
                  color="#ffffff"
                  loading={true}
                  height={10}
                  width={10}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
                <p className="text-xs font-medium">{timeOfRequest + "/60s"}</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="absolute bottom-[1rem] md:w-[60%] grid grid-cols-12 gap-2 p-3">
          <input
            type="text"
            placeholder="Nhập câu hỏi tại đây..."
            className="mr-1 shadow-xl border-2 focus:outline-none px-2 rounded-2xl input-primary col-span-10 bg-gray-800 text-white"
            onChange={onChangeHandler}
            onKeyDown={handleKeyDown}
            disabled={isGen}
            value={promptInput}
          />

          <button
            disabled={isGen}
            onClick={SendMessageChat}
            className="drop-shadow-md rounded-2xl col-span-1 btn btn-active bg-gradient-to-tl from-transparent via-blue-600 to-indigo-500"
          >
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              color="white"
              height="15px"
              width="15px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>

          <button
            onClick={clearChat}
            className="drop-shadow-md rounded-2xl col-span-1 btn btn-active btn-danger btn-square"
          >
            <FontAwesomeIcon icon={faTrashAlt} color="white" />
          </button>
        </div>

        <div className="absolute bottom-[0.2rem] md:w-[60%] grid">
          <p className="text-xs col-start-1 col-end-12 text-center p-1 text-white">
            <b>Lưu ý: </b>Mô hình có thể đưa ra câu trả lời không chính xác ở một số trường hợp, vì vậy hãy luôn kiểm chứng thông tin bạn nhé!
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
