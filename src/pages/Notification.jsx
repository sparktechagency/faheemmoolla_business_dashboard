import { CheckCircleOutlined, CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm, Spin, Tag } from "antd";
import { motion } from "framer-motion";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import massageNotify from "../assets/notification.png";
import {
  useDeleteAllNotificationMutation,
  useDeleteSingleNotificationMutation,
  useGetNotificationQuery,
  useReadNotificationMutation,
} from "../features/notification/notification";
import { useProfileQuery } from "../features/profile/profileApi";
import { SocketBaseURL } from "../utils/BaseURL";

const NotificationPopup = () => {
  const path = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const popupRef = useRef(null);
  const iconRef = useRef(null);

  const { data: profile } = useProfileQuery();
  const { data: notifications, refetch, isLoading } = useGetNotificationQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [readNotification, { isLoading: updateLoading }] = useReadNotificationMutation();
  const [deleteAllNotification, { isLoading: isDeletingAll }] = useDeleteAllNotificationMutation();
  const [deleteSingleNotification, { isLoading: isDeletingSingle }] = useDeleteSingleNotificationMutation();

  useEffect(() => {
    socketRef.current = io(SocketBaseURL);

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id);
    });

    const handleNewNotification = (notification) => {
      refetch();
    };

    socketRef.current.on(`notification::${localStorage.getItem("businessLoginId")}`, handleNewNotification);

    return () => {
      if (socketRef.current) {
        socketRef.current.off("connect");
        socketRef.current.off(`notification::${localStorage.getItem("businessLoginId")}`, handleNewNotification);
        socketRef.current.disconnect();
      }
    };
  }, [refetch]);

  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading]);

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
    } else {
      if (path.pathname === "/business-management") {
        navigate(`/business-management?search=${searchQuery}`);
      } else if (path.pathname === "/earning") {
        navigate(`/earning?search=${searchQuery}`);
      }
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read) {
        await readNotification(notification._id);
      }
      refetch();
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "Just now";
    const bangladeshTime = moment(timestamp).add(6, 'hours');
    return bangladeshTime.fromNow();
  };

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

  const unreadCount = notifications?.data?.result.filter(notif => !notif.read).length || 0;

  const markAllAsRead = async () => {
    try {
      await Promise.all(notifications.data.result.map(notif => readNotification(notif._id)));
      refetch();
      message.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      message.error("Failed to mark all as read");
    }
  };

  const handleDeleteAllNotifications = async () => {
    try {
      await deleteAllNotification().unwrap();
      refetch();
      message.success("All notifications deleted successfully");
    } catch (error) {
      console.error("Error deleting all notifications:", error);
      message.error("Failed to delete all notifications");
    }
  };

  const handleDeleteSingleNotification = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteSingleNotification(id).unwrap();
      refetch();
      message.success("Notification deleted successfully");
    } catch (error) {
      console.error("Error deleting notification:", error);
      message.error("Failed to delete notification");
    }
  };

  return (
    <div className="flex items-center justify-between pt-10">
      <motion.div
        ref={popupRef}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="w-full p-10 bg-white border border-gray-200 rounded-xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <div className="flex space-x-2">
            {notifications?.data?.result?.length > 0 && (
              <>
                <Button
                  type="primary"
                  size="small"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0 || updateLoading}
                  loading={updateLoading}
                >
                  Mark all as read
                </Button>
                <Popconfirm
                  title="Are you sure to delete all notifications?"
                  onConfirm={handleDeleteAllNotifications}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    disabled={notifications?.data?.result?.length === 0 || isDeletingAll}
                    loading={isDeletingAll}
                  >
                    Delete all
                  </Button>
                </Popconfirm>
              </>
            )}
          </div>
        </div>
        <div>
          <div className="w-full cursor-pointer">
            {loading || updateLoading || isDeletingAll ? (
              <div className="flex justify-center py-4">
                <Spin size="small" />
              </div>
            ) : notifications?.data?.result?.length === 0 ? (
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
                  There's no notifications
                </h3>
                <p className="pb-[5px]">
                  Your notifications will appear on this page.
                </p>
              </div>
            ) : (
              notifications?.data?.result.map((notif, index) => (
                <div
                  key={notif._id || index}
                  className={`flex items-start p-3 transition duration-300 border-b border-gray-100 hover:bg-gray-50 ${!notif.read ? "bg-blue-50" : ""
                    }`}
                  onClick={() => handleNotificationClick(notif)}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        {notif.showAlert && notif.type && (
                          <Tag color={getTypeColor(notif.type)}>
                            {notif.type}
                          </Tag>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-2">
                          {formatTime(notif.createdAt)}
                        </span>
                        <Popconfirm
                          title="Delete this notification?"
                          onConfirm={(e) => handleDeleteSingleNotification(notif._id, e)}
                          onCancel={(e) => e.stopPropagation()}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button
                            type="text"
                            size="small"
                            icon={<CloseOutlined />}
                            onClick={(e) => e.stopPropagation()}
                            loading={isDeletingSingle}
                            className="text-gray-400 hover:text-red-500"
                          />
                        </Popconfirm>
                      </div>
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
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationPopup;