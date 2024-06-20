import emailjs from "@emailjs/browser";
import { useRef } from "react";

function IssuePage() {
  let templateParams = {
    from_name: "James",
    message: "Check this out!",
  };

  function sendMail() {
    emailjs
      .send(
        "<EMAILJS_SERVICE_ID>",
        "template_azmnoyw",
        templateParams,
        "<EMAILJS_USER_ID>"
      )
      .then(
        function (response) {
          console.log("SUCCESS!", response.status, response.text);
        },
        function (error) {
          console.log("FAILED...", error);
        }
      );
  }

  return (
    <div className="flex justify-center h-[85vh] bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white">
      {/* The button to open modal */}
      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box bg-gray-800 text-white">
          <h3 className="font-bold text-lg">Gửi thành công 🥳</h3>
          <p className="py-4">
            Cảm ơn bạn đã gửi góp ý / báo lỗi 🤗. Chúng tôi sẽ xem xét những ý
            kiến của người dùng để ngày càng hoàn thiện sản phẩm hơn nhé!
          </p>
          <div className="modal-action">
            <label htmlFor="my-modal" className="btn btn-success">
              Đóng
            </label>
          </div>
        </div>
      </div>
      <div className="md:w-[50%]">
        <h1 className="text-3xl text-center font-bold p-5 bg-[linear-gradient(90deg,#a1c4fd,#c2e9fb)] bg-clip-text text-transparent">
          Báo lỗi hoặc góp ý
        </h1>
        <p className="text-justify font-semibold text-sm pr-2 pl-2">
          Sự đóng góp ý kiến từ các bạn sẽ là sự hỗ trợ đắc lực giúp chúng tôi
          ngày càng hoàn thiện sản phẩm hơn.
        </p>
        <textarea
          placeholder="Nhập phản hồi của bạn tại đây!"
          className="mt-5 mb-3 h-[30%] textarea textarea-bordered textarea-md w-full bg-gray-800 text-white border-gray-700"
        ></textarea>
        <input
          type="text"
          placeholder="Email của bạn"
          className="input w-full max-w-xs bg-gray-800 text-white border-gray-700"
        />
        <label
          htmlFor="my-modal"
          onClick={sendMail}
          className="mt-5 w-full btn btn-primary btn-md bg-gradient-to-tl from-purple-600 to-blue-500 border-none"
        >
          Gửi ý kiến
        </label>
      </div>
    </div>
  );
}

export default IssuePage;
