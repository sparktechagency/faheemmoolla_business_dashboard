import { Button } from "antd";
import { FaArrowLeftLong } from "react-icons/fa6";
import checkMail from "../../assets/auth/checkmail.png";
import { mailIcon } from "../../assets/assets"; // Ensure this is correctly imported
import { useNavigate } from "react-router-dom";

export default function CheckEmail() {
  const route = useNavigate();
  return (
    <div className="flex items-center justify-center h-screen overflow-hidden">
      <div className="flex w-full">
        {/* Left Side - Image */}
        <div className="hidden bg-center bg-cover md:flex md:w-6/12 lg:w-8/12">
          <img
            src={checkMail}
            className="object-cover w-full bg-center"
            alt="Check Mail Illustration"
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center w-full p-6 bg-white md:w-6/12 lg:w-4/12 md:p-12">
          <div className="flex flex-col items-center justify-center w-full max-w-md px-4 py-8 mx-auto border rounded-lg border-primary">
            {/* Mail Icon */}
            <img
              src={mailIcon}
              alt="Mail Icon"
              className="w-[56px] h-[56px]" // Fixed height issue
            />

            {/* Heading */}
            <h3 className="text-[30px] font-semibold leading-[38px] pb-2">
              Check your email
            </h3>
            <h2 className="text-sm md:text-base leading-[24px] font-normal mb-4 text-[#667085] text-center">
              We sent a password reset link to olivia@untitledui.com
            </h2>

            {/* Button */}

              <Button
                onClick={() => window.location.href = "https://mail.google.com/mail/"}
                type="primary"
                className="w-full"
                size="large"
                style={{ backgroundColor: "#C68C4E", borderColor: "#C68C4E" }}
              >
                Open email app
              </Button>


            {/* Back to Login */}
            <div onClick={()=>route('/auth/login')} className="flex items-center gap-2 pt-5 text-base text-gray-500 cursor-pointer">
              <FaArrowLeftLong />
              <h3>Back to log in</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
