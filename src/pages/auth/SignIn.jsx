import { Button, Input, Form, message } from "antd";
import { login,googleIcon,companyLogo } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../features/auth/authApi";
import { saveToken } from "../../features/auth/authService";
import { baseURL } from "../../utils/BaseURL";


export default function LoginPage() {
  const route = useNavigate();
  const [Login, {isLoading}] = useLoginMutation();


  const handleGoogleLogin = () => {
    // Redirect the user to initiate Google OAuth flow
    window.location.href = `${baseURL}/api/v1/auth/google`;
  };

  const onFinish = async (values) => {
     try {
          const response = await Login(values).unwrap();
          saveToken(response?.data?.token)
          localStorage.setItem("businessLoginId", response?.data?.user?._id);
          route("/")
        } catch (error) {
          message.error(error?.data?.message);
        }
  };
  
  return (
    <div className="flex items-center justify-center h-screen overflow-hidden">
      <div className="flex w-full">
        {/* Left Side - Image */}
        <div className="hidden bg-center bg-cover md:flex md:w-6/12 lg:w-8/12">
          <img src={login} className="object-cover w-full" alt="Login Illustration" />
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center w-full p-6 bg-white md:w-6/12 lg:w-4/12 md:p-12">
          <div className="flex flex-col items-center justify-center w-full max-w-md px-4 py-8 mx-auto border rounded-lg border-primary">
            <img src={companyLogo} alt="Ubuntu Bites Logo" className="w-[150px]" />
            <h2 className="text-sm md:text-base leading-[24px] font-normal mb-4 text-[#1E1E1E] text-center">
              Welcome back! Please enter your details.
            </h2>

            <Form layout="vertical" onFinish={onFinish} className="w-full">
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, type: "email", message: "Please enter a valid email!" }]}
              >
                <Input placeholder="Enter your email" size="large" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Password is required!" }]}
              >
                <Input.Password placeholder="Enter your password" size="large" />
              </Form.Item>

              <div className="mb-4 text-sm text-end">
                <p onClick={()=>route('/auth/login/forgot_password')} className="text-[#1E1E1E] cursor-pointer hover:underline">Forgot password?</p>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                size="large"
                loading={isLoading}
                style={{ backgroundColor: "#C68C4E", borderColor: "#C68C4E" }}
              >
                Sign in
              </Button>

              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-2 text-sm text-gray-500">or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <Button onClick={handleGoogleLogin} className="flex items-center justify-center w-full gap-2 custom-google-btn" size="large">
                <img src={googleIcon} className="w-[20px] h-[20px]" alt="Google logo" />
                Sign in with Google
              </Button>

              <p className="flex items-center justify-center mt-4 text-sm text-gray-600">
                Don`t have an account?
                <span onClick={()=>route('/auth/signup')} className="font-semibold cursor-pointer text-[#C68C4E] hover:underline ml-1">Sign up</span>
              </p>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
