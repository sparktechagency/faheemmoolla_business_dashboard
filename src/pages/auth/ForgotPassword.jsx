import { Button, Input, Form } from "antd";
import { FaArrowLeftLong } from "react-icons/fa6";
import forgotImage from "../../assets/auth/forget.png";
import forgotKeyIcon from "../../assets/auth/forgotkeyicon.png"; // Ensure correct path
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../../features/auth/authApi";

export default function ForgotPassword() {
  const route = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const onFinish = async (values) => {
    try {
      await forgotPassword(values).unwrap();
      route("/auth/login/check_email");
    } catch (error) {
      console.error("OTP verification failed:", error);
      alert("Email does not exist.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen overflow-hidden">
      <div className="flex w-full">
        {/* Left Side - Image */}
        <div className="hidden bg-center bg-cover md:flex md:w-6/12 lg:w-8/12">
          <img
            src={forgotImage}
            className="object-cover w-full"
            alt="Forgot Password Illustration"
          />
        </div>

        {/* Right Side - Forgot Password Form */}
        <div className="flex items-center w-full p-6 bg-white md:w-6/12 lg:w-4/12 md:p-12">
          <div className="flex flex-col items-center justify-center w-full max-w-md px-4 py-8 mx-auto border rounded-lg border-primary">
            <img
              src={forgotKeyIcon}
              alt="Key Icon"
              className="w-[56px] h-[56px]"
            />
            <h3 className="text-[30px] font-semibold leading-[38px] pb-2">
              Forgot password?
            </h3>
            <h2 className="text-sm md:text-base leading-[24px] font-normal mb-4 text-[#1E1E1E] text-center">
              No worries, we’ll send you reset instructions.
            </h2>

            <Form layout="vertical" onFinish={onFinish} className="w-full">
              <Form.Item
                style={{ paddingBottom: "10px" }}
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Please enter a valid email!",
                  },
                ]}
              >
                <Input placeholder="Enter your email" size="large" />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                size="large"
                loading={isLoading}
                style={{ backgroundColor: "#C68C4E", borderColor: "#C68C4E" }}
              >
                Submit
              </Button>
            </Form>

            <button
              onClick={() => route("/auth/login")}
              className="flex items-center gap-2 pt-5 text-base text-gray-500 cursor-pointer"
            >
              <FaArrowLeftLong />
              <h3>Back to log in</h3>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
