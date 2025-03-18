import { Button, Modal } from "antd";
import { AnimatePresence, motion } from "framer-motion"; // Import Framer Motion
import { useEffect, useState } from "react"; // Import useEffect
import { RiLogoutCircleLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { companyLogo } from "../assets/assets";
import { menuDatas } from "../constants/menuDatas";
import { logout } from "../features/auth/authSlice";

const Sidebar = () => {
  const location = useLocation();
  const router = useNavigate();
  const dispatch = useDispatch();
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false); // State for logout modal

  // Function to toggle sub-menu visibility
  const toggleSubMenu = (index) => {
    if (openSubMenu === index) {
      setOpenSubMenu(null); // Close the sub-menu if it's already open
      localStorage.removeItem("openSubMenu"); // Remove from localStorage
    } else {
      setOpenSubMenu(index); // Open the sub-menu
      localStorage.setItem("openSubMenu", index); // Store in localStorage
    }
  };

  useEffect(() => {
    const storedOpenSubMenu = localStorage.getItem("openSubMenu");
    if (storedOpenSubMenu !== null) {
      setOpenSubMenu(parseInt(storedOpenSubMenu, 10));
    }
  }, []);

  // Close the sub-menu if the current route is not part of the sub-menu
  useEffect(() => {
    const activeMenu = menuDatas.find((item) =>
      item.subLinks?.some((subLink) => subLink.link === location.pathname)
    );
    if (!activeMenu) {
      setOpenSubMenu(null); // Close all sub-menus if no active sub-link is found
    }
  }, [location.pathname]);

  const showLogoutModal = () => {
    setIsLogoutModalVisible(true);
  };

  const handleLogoutOk = () => {
    // Handle the logout action here
    setIsLogoutModalVisible(false);
    // Redirect to login page or perform logout logic
    router("/auth/login");
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalVisible(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    router("/auth/login");
  };

  return (
    <div className="w-[300px] border-r border-r-primary h-screen overflow-y-auto custom-scrollbar2">
      <div className="h-[200px] border-b flex flex-col justify-center items-center gap-3 border-b-primary">
        <div className="flex items-center justify-center">
          <img
            onClick={() => router("/")}
            src={companyLogo}
            title="company logo"
            className="w-[100px] h-[100px] cursor-pointer"
          />
        </div>
        <h3 className="font-medium text-[18px] select-none leading-[21px]">
          Business Dashboard
        </h3>
      </div>
      <div className="pl-6">
        <ul className="pt-3">
          {menuDatas?.map((item, index) => {
            const isShopActive =
              location.pathname.startsWith("/shop-management/") &&
              item.link === "/shop-management";
            const isMealActive =
              location.pathname.startsWith("/meal-management/") &&
              item.link === "/meal-management";
            const isOfferActive =
              location.pathname.startsWith("/offer/") && item.link === "/offer";
            const isExactMatch = location.pathname === item.link;
            const isSettingsActive = location.pathname.startsWith("/settings");

            const isActive =
              isShopActive ||
              isMealActive ||
              isOfferActive ||
              isExactMatch ||
              (isSettingsActive && item.title === "Settings");

            return (
              <li key={index} className="py-1 text-textPrimary">
                <Link
                  to={item.link}
                  className={`flex items-center gap-3 text-sm py-3 font-semibold 
                    ${isActive && "active"} 
                    rounded-s-xl p-2`}
                  onClick={() => toggleSubMenu(index)}
                >
                  <span className="pl-2 text-2xl">
                    <img
                      src={item?.icon}
                      width={24}
                      height={24}
                      alt=""
                      className={isActive ? "active-icon" : "inactive-icon"}
                    />
                  </span>
                  <span className="text-lg font-normal">{item?.title}</span>
                </Link>

                <AnimatePresence>
                  {item.subLinks && openSubMenu === index && (
                    <motion.ul
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="pt-2 pl-10"
                    >
                      {item.subLinks.map((subLink, subIndex) => (
                        <motion.li
                          key={subIndex}
                          className="mt-1 text-textPrimary"
                        >
                          <Link
                            to={subLink.link}
                            className={`flex items-center gap-3 text-sm py-2 font-semibold 
                              ${
                                location.pathname === subLink.link &&
                                "activesub"
                              } 
                              rounded-s-lg p-2`}
                          >
                            <span className="pl-2 text-2xl">
                              <img
                                src={subLink.subicon}
                                width={24}
                                height={24}
                                alt=""
                              />
                            </span>
                            <span className="text-sm font-normal">
                              {subLink.title}
                            </span>
                          </Link>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
        <button
          className="flex items-center gap-2 p-3 pl-5 mt-10 font-semibold"
          onClick={showLogoutModal}
        >
          <span>
            <RiLogoutCircleLine size={20} />
          </span>
          <span>Logout</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        open={isLogoutModalVisible}
        onOk={handleLogoutOk}
        centered
        onCancel={handleLogoutCancel}
        style={{ textAlign: "center" }}
        width={300}
        footer={[
          <Button
            className="custom-button"
            key="back"
            onClick={handleLogoutCancel}
            style={{
              borderColor: "red",
              fontWeight: "bold",
              paddingLeft: "30px",
              paddingRight: "30px",
              paddingTop: "10px",
              paddingBottom: "10px",
            }}
          >
            No
          </Button>,
          <Button
            key="submit"
            type="text"
            onClick={handleLogout}
            style={{
              backgroundColor: "#C68C4E",
              paddingLeft: "30px",
              paddingRight: "30px",
              paddingTop: "10px",
              paddingBottom: "10px",
              color: "white",
            }}
          >
            Yes
          </Button>,
        ]}
      >
        <p className="pt-10 pb-4 text-xl font-bold">Do you want to Logout?</p>
      </Modal>
    </div>
  );
};

export default Sidebar;
