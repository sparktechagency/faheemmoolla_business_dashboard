import { Button } from "antd";
import { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { checkCircle , passwordReset } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

export default function CheckEmail() {
  const router = useNavigate();
  const [loading, setLoading] = useState(false);

  

  return (
    <div className="flex items-center justify-center h-screen overflow-hidden">
      <div className="flex w-full">
        {/* Left Side - Image */}
        <div className="hidden bg-center bg-cover md:flex md:w-6/12 lg:w-8/12">
          <img src={passwordReset} className="object-cover w-full" alt="Login Illustration" />
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center w-full p-6 bg-white md:w-6/12 lg:w-4/12 md:p-12">
          <div className="flex flex-col items-center justify-center w-full max-w-md px-4 py-8 mx-auto border rounded-lg border-primary">
            <img src={checkCircle} alt="Ubuntu Bites Logo" className="w-[56px] h-[56]" />
            <h3 className="text-[30px] font-semibold leading-[38px] pb-2">Password reset</h3>
            <h2 className="text-sm md:text-sm font-normal mb-4 text-[#667085] text-center">
            Your password has been successfully reset. Click below to log in magically.
            </h2>
              <Button
              onClick={()=>router('/')}
                type="primary"
                htmlType="submit"
                className="w-full"
                size="large"
                loading={loading}
                style={{ backgroundColor: "#C68C4E", borderColor: "#C68C4E" }}
              >
                Continue
              </Button>
            

            <div onClick={()=>router('/auth/login')} className="flex items-center gap-2 pt-5 text-base text-gray-500 cursor-pointer">
                <FaArrowLeftLong />
                <h3>Back to log in</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
