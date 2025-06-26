import { Button, Input, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useResendOtpMutation, useVerifyEmailMutation } from "../../features/auth/authApi";
import { saveToken } from "../../features/auth/authService";
import SuccessSign from "../auth/SuccessSign"; // Ensure the correct import path

const { Title, Text } = Typography;

const Verification = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [success, setSuccess] = useState(false);
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [resendOtp, { isLoading: resendLoading }] = useResendOtpMutation();
  const [timer, setTimer] = useState(0); // Timer state

  useEffect(() => {
    document.getElementById("digit-0")?.focus();
  }, []);

  // Countdown effect for the timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        document.getElementById(`digit-${index + 1}`)?.focus();
      }
    }
  };

  const handleSubmit = async () => {
    const enteredCode = code.join("");
    if (enteredCode.length !== 6) {
      alert("Please enter a valid 6-digit code.");
      return;
    }

    try {
      const response = await verifyEmail({ email, oneTimeCode: parseFloat(enteredCode) }).unwrap();
      saveToken(response?.data?.accessToken);
      setSuccess(true);
    } catch (error) {
      message.error(error?.data?.message);
      console.error("OTP verification failed:", error.data.message);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return; // Prevent multiple clicks

    try {
      await resendOtp({ email }).unwrap();
      setTimer(60); // Start 1-minute timer
    } catch (error) {
      message.error(error);
    }
  };

  return (
    <section>
      {success ? (
        <SuccessSign />
      ) : (
        <div className="flex items-center justify-center h-screen">
          <div className="p-6 text-center bg-white border rounded-2xl border-primary w-96">
            <Title level={4}>Enter the Verification Code to Verify Your Email</Title>
            <div className="flex justify-center gap-2 mt-4">
              {code.map((digit, index) => (
                <Input
                  key={index}
                  id={`digit-${index}`}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  className="w-10 h-10 text-lg text-center border border-gray-400 rounded"
                />
              ))}
            </div>
            <Text className="block mt-2">
              If you didn’t receive a code,{" "}
              <Text
                onClick={handleResend}
                strong
                className={`text-blue-500 cursor-pointer ${timer > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {timer > 0 ? `Resend in ${timer}s` : "Resend"}
              </Text>
            </Text>
            <Button
              onClick={handleSubmit}
              type="primary"
              className="w-full"
              size="large"
              style={{ backgroundColor: "#C68C4E", borderColor: "#C68C4E", marginTop: "10px" }}
              loading={isLoading}
            >
              Submit
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Verification;
