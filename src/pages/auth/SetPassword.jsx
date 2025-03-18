import { Button, Input, Form, message } from "antd";
import { FaArrowLeftLong } from "react-icons/fa6";
import { forgotKeyIcon } from "../../assets/assets";
import { useLocation, useNavigate } from "react-router-dom";
import setpassword from '../../assets/auth/setpassword.jpg';
import { useResetPasswordMutation } from "../../features/auth/authApi";
import { saveToken } from "../../features/auth/authService";

// import { setCredentials } from "../../authSlice";

export default function LoginPage() {
  const router = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  // const email = params.get('email');
  const token = params.get('token');
  const [resetPassword, { isLoading }] = useResetPasswordMutation();


  const onFinish = async (values) => {
    try {
      const credentials = {
        ...values,
        token: token,
      };
      await resetPassword(credentials).unwrap();
      saveToken(token)
      // Redirect to the success page
      router('/auth/success');
    } catch (error) {
      // Log the full error response
      console.error("Password reset failed:", error);
      console.error("Full error response:", error.data);
  
      // Show an error message to the user
      message.error("Password reset failed. Please try again.");
    }
  };

  const handleBackToLogin = () => {
    router.push('/auth/login');
  };

  return (
    <div className="flex items-center justify-center h-screen overflow-hidden">
      <div className="flex w-full">
        <div className="hidden bg-center bg-cover md:flex md:w-6/12 lg:w-8/12">
          <img src={setpassword} className="object-cover w-full" alt="Login Illustration" />
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center w-full p-6 bg-white md:w-6/12 lg:w-4/12 md:p-12">
          <div className="flex flex-col items-center justify-center w-full max-w-md px-4 py-8 mx-auto border rounded-lg border-primary">
            <img src={forgotKeyIcon} alt="Ubuntu Bites Logo" className="w-[60px] md:w-[60px]" />
            <h3 className="text-[30px] font-semibold leading-[38px] pb-2">Set new password</h3>
            <h2 className="text-sm md:text-base leading-[24px] font-normal mb-4 text-[#1E1E1E] text-center">
              Welcome back! Please enter your details.
            </h2>

            <Form layout="vertical" onFinish={onFinish} className="w-full">
              <Form.Item
                name="newPassword"
                label="Password"
                rules={[{ required: true, message: "Password is required!" }]}
              >
                <Input.Password placeholder="Enter your password" size="large" />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm password"
                dependencies={['newPassword']}
                hasFeedback
                rules={[
                  { required: true, message: "Please confirm your password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords that you entered do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm your password" size="large" />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                size="large"
                loading={isLoading}
                style={{ backgroundColor: "#C68C4E", borderColor: "#C68C4E" }}
              >
                Reset password
              </Button>
            </Form>
            <div className="flex items-center gap-2 pt-5 text-base text-gray-500 cursor-pointer" onClick={handleBackToLogin}>
              <FaArrowLeftLong />
              <h3>Back to log in</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}