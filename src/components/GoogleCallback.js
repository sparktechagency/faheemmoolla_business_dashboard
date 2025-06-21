import { message } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../utils/BaseURL";

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (!code) {
          throw new Error('Authorization code not found');
        }
        const response = await fetch(`${baseURL}/api/v1/auth/google/callback?code=${code}`);
        const data = await response.json();

        if (data?.data?.token) {
          localStorage.setItem("businessToken", data.data.token);
          localStorage.setItem("businessLoginId", data.data.user._id);
          navigate("/");
        } else {
          throw new Error('Token not received');
        }
      } catch (error) {
        message.error("Google login failed. Please try again.");
        navigate("/auth/login");
      }
    };

    handleGoogleCallback();
  }, [navigate]);

  return <div>Processing Google login...</div>;
}