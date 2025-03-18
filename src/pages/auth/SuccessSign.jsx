import { Button, Typography } from "antd";
import success from '../../assets/icons/successSignup.png'
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Verification = () => {
  const route = useNavigate();
  return (
    <div className="flex items-center justify-center h-screen">
    <div className="bg-white p-6 rounded-2xl  w-[882px] h-[452px] text-center">
       <div className="flex justify-center pb-2">
       <img src={success} width={150} height={150} alt="" />
       </div>
      <Title level={6} className="text-[40px] pb-2">Sign Up Successful</Title>
     
      <Button
      onClick={()=>route('/')}
        type="primary"
        htmlType="submit"
        className="w-full"
        size="large"
        style={{ backgroundColor: "#C68C4E", borderColor: "#C68C4E", marginTop: "10px" }} >
        Done
      </Button>
    </div>
  </div>
  );
};

export default Verification;
