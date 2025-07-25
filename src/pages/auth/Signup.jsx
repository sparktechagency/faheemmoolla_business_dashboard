import { Button, Form, Input, notification } from "antd";
import PhoneInput from "antd-phone-input";
import { useNavigate } from "react-router-dom";
import { companyLogo, signupImages } from "../../assets/assets";
import { useSignupMutation } from "../../features/auth/authApi";
import { baseURL } from "../../utils/BaseURL";

export default function LoginPage() {
  const route = useNavigate();
  const [form] = Form.useForm();
  const [signup, { isLoading }] = useSignupMutation();

  const handleGoogleLogin = () => {
    window.location.href = `${baseURL}/api/v1/auth/google`;
  };

  // Updated phone number validator
  const validatePhoneNumber = (_, value) => {
    console.log('Phone validation value:', value); // Debug log

    // If no value provided, it's valid (optional field)
    if (!value) {
      return Promise.resolve();
    }

    // Check if value has the required structure
    if (!value.phoneNumber || !value.countryCode) {
      return Promise.reject(new Error("Please enter a valid phone number"));
    }

    // Additional validation for minimum length
    if (value.phoneNumber.length < 7) {
      return Promise.reject(new Error("Please enter a valid phone number"));
    }

    // Optional: Check if the component has isValid property
    if (value.hasOwnProperty('isValid') && !value.isValid) {
      return Promise.reject(new Error("Please enter a valid phone number"));
    }

    return Promise.resolve();
  };

  const onFinish = async (values) => {
    console.log('Form values:', values); // Debug log

    // Format the phone number with country code before sending to the server
    const phoneNumber = values.phone && values.phone.phoneNumber
      ? `+${values.phone.countryCode}${values.phone.phoneNumber}`
      : null;

    const data = {
      name: values.name,
      phone: phoneNumber,
      email: values.email,
      password: values.password
    };

    console.log('Sending data:', data); // Debug log

    try {
      const response = await signup(data).unwrap();
      localStorage.setItem("businessLoginId", response?.data?._id);
      route(`/auth/signup/verify?email=${values?.email}`);
    } catch (error) {
      console.error('Signup error:', error); // Debug log
      if (error.status === 400) {
        notification.error({
          message: "Signup Failed",
          description: `${error?.data?.message}`,
        });
      } else {
        notification.error({
          message: "Signup Failed",
          description: "An unexpected error occurred. Please try again.",
        });
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen overflow-hidden">
      <div className="flex w-full">
        <div className="flex items-center w-full bg-white md:w-6/12 lg:w-4/12">
          <div className="flex flex-col items-center justify-center w-full max-w-md px-4 pb-6 mx-auto border rounded-lg border-primary">
            <img src={companyLogo} alt="Ubuntu Bites Logo" className="w-[150px] md:w-[200px]" />
            <h2 className="text-[30px] leading-[38px] font-semibold mb-4 text-[#1E1E1E] text-center">
              Create an account
            </h2>

            <Form form={form} layout="vertical" onFinish={onFinish} className="w-full">
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input placeholder="Enter your name" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input placeholder="Enter your email" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ validator: validatePhoneNumber }]}
              >
                <PhoneInput
                  enableSearch
                  country="ng" // Default country (Nigeria)
                  placeholder="Enter your phone number"
                  searchPlaceholder="Search country"
                  searchNotFound="No country found"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please create a password" },
                  { min: 8, message: "Password must be at least 8 characters" },
                ]}
              >
                <Input.Password placeholder="Create a password" />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Passwords do not match"));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm password" />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                size="large"
                loading={isLoading}
                style={{ backgroundColor: "#C68C4E", borderColor: "#C68C4E" }}
              >
                Sign up
              </Button>

              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-2 text-sm text-gray-500">or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <Button
                onClick={handleGoogleLogin}
                className="w-full"
                size="large"
                style={{
                  backgroundColor: "transparent",
                  borderColor: "#C68C4E",
                  color: "#C68C4E"
                }}
              >
                Continue with Google
              </Button>

              <p className="flex items-center justify-center mt-4 text-sm text-gray-600">
                Already have an account?
                <span
                  onClick={() => route("/auth/login")}
                  className="ml-1 font-semibold cursor-pointer text-primary hover:underline"
                >
                  Log in
                </span>
              </p>
            </Form>
          </div>
        </div>
        <div className="hidden bg-center bg-cover md:flex md:w-6/12 lg:w-8/12">
          <img
            src={signupImages}
            className="object-cover w-full bg-center bg-cover"
            alt="Signup Illustration"
          />
        </div>
      </div>
    </div>
  );
}