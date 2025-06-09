import { BellOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Card, Input, Spin, Tag } from "antd";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useLocation, useNavigate } from "react-router-dom";
import massageNotify from "../assets/notification.png";
import { useProfileQuery } from "../features/profile/profileApi";

import moment from "moment";
import 'moment-timezone';
import io from "socket.io-client";
import {
  useGetNotificationQuery,
  useReadNotificationMutation,
} from "../features/notification/notification";
import { baseURL, SocketBaseURL } from "../utils/BaseURL";

const NotificationPopup = () => {
  const path = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const popupRef = useRef(null);
  const iconRef = useRef(null);
  const notificationContainerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const { data: profile } = useProfileQuery();
  const {
    data: notifications,
    refetch,
    isLoading,
  } = useGetNotificationQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [readNotification, { isLoading: updateLoading }] =
    useReadNotificationMutation();

  // Update current time periodically for accurate relative time display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Socket connection for real-time notifications
  useEffect(() => {
    socketRef.current = io(SocketBaseURL);

    socketRef.current.on("connect", () => {
      // console.log("Socket connected");
    });

    const handleNewNotification = (notification) => {
      // Force immediate refetch when new notification arrives
      refetch();
      setCurrentTime(new Date()); // Update current time for accurate relative time

      // When a new notification arrives, scroll to top
      if (notificationContainerRef.current && visible) {
        notificationContainerRef.current.scrollTop = 0;
      }
    };

    socketRef.current.on(
      `notification::${localStorage.getItem("businessLoginId")}`,
      handleNewNotification
    );

    return () => {
      if (socketRef.current) {
        socketRef.current.off("connect");
        socketRef.current.off(
          `notification::${localStorage.getItem("businessLoginId")}`,
          handleNewNotification
        );
        socketRef.current.disconnect();
      }
    };
  }, [refetch, visible]);

  // Update loading state when query completes
  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading]);

  // Scroll to top when notifications panel opens
  useEffect(() => {
    if (visible && notificationContainerRef.current) {
      notificationContainerRef.current.scrollTop = 0;
      // Refetch notifications when panel opens to ensure fresh data
      refetch();
      setCurrentTime(new Date()); // Update current time for accurate relative time
    }
  }, [visible, refetch]);

  // Click outside to close popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        iconRef.current &&
        !iconRef.current.contains(event.target)
      ) {
        setVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    const searchQuery = encodeURIComponent(e.target.value);
    if (!e.target.value) {
      if (path.pathname === "/order") {
        navigate("/order");
      } else if (path.pathname === "/earning") {
        navigate("/earning");
      }
      else if (path.pathname === "/payouts") {
        navigate("/payouts");
      }
    } else {
      if (path.pathname === "/business-management") {
        navigate(`/business-management?search=${searchQuery}`);
      } else if (path.pathname === "/earning") {
        navigate(`/earning?search=${searchQuery}`);
      }
      else if (path.pathname === "/payouts") {
        navigate(`/payouts?search=${searchQuery}`);
      }
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read) {
        await readNotification(notification._id);
        refetch();
      }
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  // Function to handle See Details button click
  const handleSeeDetailsClick = () => {
    setVisible(false); // Close the modal
    navigate("/settings/notification"); // Navigate to notification settings
  };

  // Updated formatTime function with explicit timezone offset
  const formatTime = useCallback((timestamp) => {
    if (!timestamp) return "Just now";
    const bangladeshTime = moment(timestamp).add(6, 'hours');
    return bangladeshTime.fromNow();
  }, []);




  const getTypeColor = (type) => {
    switch (type) {
      case "ALERT":
        return "red";
      case "INFO":
        return "blue";
      case "SUCCESS":
        return "green";
      default:
        return "gray";
    }
  };

  const unreadCount =
    notifications?.data?.result.filter((notif) => !notif.read).length || 0;

  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications.data.result.map((notif) =>
          !notif.read ? readNotification(notif._id) : Promise.resolve()
        )
      );
      refetch();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  // Ensure notifications are sorted by createdAt (newest first)
  const sortedNotifications = notifications?.data?.result
    ? [...notifications.data.result].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
    : [];


  return (
    <div className="flex items-center justify-between">
      {path.pathname === "/order" || path.pathname === "/earning" || path.pathname === "/payouts" ? (
        <div className="flex items-center justify-between w-7/12">
          <Input
            size="large"
            onChange={handleSearch}
            placeholder="Please Input your Order Number"
            style={{
              borderColor: "#FCA210",
              color: "#333",
            }}
            suffix={
              <CiSearch className="text-2xl text-opacity-50 text-textPrimary" />
            }
          />
        </div>
      ) : (
        <div className="flex items-center justify-between w-7/12"></div>
      )}

      <div className="relative z-40 flex items-center justify-end gap-5 px-5">
        <div
          onClick={() => navigate("/settings/profile")}
          className="cursor-pointer"
        >
          <span className="mr-2 text-gray-700">
            Hello, <b>{profile?.data?.name}</b>
          </span>
          <Avatar
            src={
              profile?.data?.image
                ? `${baseURL}${profile?.data?.image}`
                : `/avator2.png`
            }
            size={30}
          />
        </div>

        <Badge
          count={unreadCount}
          className="ml-3 cursor-pointer"
          onClick={() => setVisible(!visible)}
          ref={iconRef}
        >
          <BellOutlined className="text-2xl text-gray-600 transition duration-300 hover:text-gray-800" />
        </Badge>

        {visible && (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute overflow-hidden bg-white border border-gray-200 shadow-xl right-4 top-12 w-96 rounded-xl"
          >
            <Card
              title="Notifications"
              className="p-0"
              extra={
                unreadCount > 0 && (
                  <Button size="small" type="link" onClick={markAllAsRead}>
                    Mark all as read
                  </Button>
                )
              }
            >
              <div
                ref={notificationContainerRef}
                className="overflow-y-auto cursor-pointer max-h-96 custom-scrollbar"
              >
                {loading || updateLoading ? (
                  <div className="flex justify-center py-4">
                    <Spin size="small" />
                  </div>
                ) : sortedNotifications.length === 0 ? (
                  <div className="text-center text-gray-500">
                    <div className="flex justify-center">
                      <img
                        src={massageNotify}
                        width={100}
                        height={100}
                        alt="Notification Icon"
                      />
                    </div>
                    <h3 className="font-bold text-lg leading-[26px] pb-[5px]">
                      There`s no notifications
                    </h3>
                    <p className="pb-[5px]">
                      Your notifications will appear on this page.
                    </p>
                    <Button
                      onClick={handleSeeDetailsClick}
                      type="primary"
                      className="w-full"
                      size="large"
                      style={{
                        backgroundColor: "#C68C4E",
                        borderColor: "#C68C4E",
                      }}
                    >
                      See details
                    </Button>
                  </div>
                ) : (
                  sortedNotifications.map((notif, index) => {
                    const time = formatTime(notif.createdAt)
                    return (<div
                      key={notif._id || index}
                      className={`flex items-start p-3 transition duration-300 border-b border-gray-100 hover:bg-gray-50 ${!notif.read ? "bg-blue-50" : ""
                        }`}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          {notif.showAlert && notif.type && (
                            <Tag color={getTypeColor(notif.type)}>
                              {notif.type}
                            </Tag>
                          )}
                          <span className="ml-auto text-xs text-gray-500">
                            {time}
                          </span>
                        </div>
                        <p
                          className={`text-sm ${!notif.read ? "font-medium" : "text-gray-600"
                            }`}
                        >
                          {notif.text}
                        </p>
                        {notif.read && !notif.showAlert && (
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <CheckCircleOutlined className="mr-1" /> Read
                          </div>
                        )}
                      </div>
                    </div>)
                  })
                )}
              </div>
            </Card>
          </motion.div>
        )}
        <button onClick={() => navigate("/wallet")} className="px-4 py-2 text-white bg-[#C68C4E] rounded-lg hover:bg-[#74512d] font-bold duration-300">Wallet</button>
        {profile?.data?.yocoAccountStatus && profile?.data?.yocoAccountStatus && <button onClick={() => navigate("/bank-information")} className="px-4 py-2 text-white bg-[#C68C4E] rounded-lg hover:bg-[#74512d] font-bold duration-300">Bank Info</button>}
      </div>

    </div>
  );
};

export default NotificationPopup;
