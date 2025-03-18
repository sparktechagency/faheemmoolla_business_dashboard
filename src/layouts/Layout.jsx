import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navber from "../components/Navber";

const Layout = () => {

  return (
    <div className="flex bg-[#FFF9FD]">      
      <div>
        <Sidebar />
      </div>
      <div className="max-h-screen px-10 py-5 overflow-y-auto grow">
        <Navber />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;