import { useState, useEffect } from "react";
import { PiMapPinAreaFill } from "react-icons/pi";
import { Link } from "react-router-dom";
import { Modal, Button, message, Spin } from "antd";
import {
  useDeleteShopMutation,
  useUpdateShopStatusMutation,
} from "../../features/shop/shopApi";
import { baseURL } from "../../utils/BaseURL";
import Loading from "../Loading";

const SingleShop = ({ shop }) => {

  const [isModalVisible, setIsModalVisible] = useState({
    off: false,
    delete: false,
  });
  const [shopStatus, setShopStatus] = useState(shop.turnOffShop);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteShop, { isLoading: shopDeleteLoading }] =
    useDeleteShopMutation();
  const [updateShopStatus, { isLoading: shopStatusLoading }] =
    useUpdateShopStatusMutation();

  const handleModalToggle = (type, state) => {
    setIsModalVisible((prev) => ({ ...prev, [type]: state }));
  };

  const handleAction = async (type, id) => {
    setIsLoading(true);
    try {
      if (type === "delete") {
        await deleteShop(id).unwrap();
        window.location.reload();
      } else if (type === "off") {
        const response = await updateShopStatus(id).unwrap();
        if (response.success) {
          setShopStatus((prev) => !prev);
          message.success(shopStatus ? "Shop turned ON!" : "Shop turned OFF!");
        }
      }
    } catch (error) {
      message.error(
        `Error ${type === "delete" ? "deleting" : "updating"} shop.`
      );
    }
    setIsLoading(false);
    handleModalToggle(type, false);
  };

  return (
    <div className="relative w-full max-w-[360px] bg-white rounded-xl overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Loading />
        </div>
      )}

      <img
        src={`${baseURL}/${shop?.banner}`}
        alt="Shop"
        className="w-full h-[250px]"
        loading="lazy"
      />
      <div className="px-5">
        <div className="flex gap-3">
          <img
            src={`${baseURL}/${shop?.logo}`}
            alt="Shop Logo"
            className="w-[70px] h-[70px] rounded-full p-2"
            loading="lazy"
          />
          <div className="py-2 text-[12px] font-semibold text-gray-700 space-y-2">
            <h3 className="text-xl text-gray-800">{shop?.shopName}</h3>
            <p className="flex items-center gap-2">
              <PiMapPinAreaFill className="text-xl" />
              <span>{shop?.shopAddress}</span>
            </p>
            <p>Open Time: {shop?.shopOpenTime}:00 AM</p>
            <p>Close Time: {shop?.shopCloseTime}:00 PM</p>
          </div>
        </div>

        <textarea
          readOnly
          placeholder="Description"
          defaultValue={shop?.shopDescription}
          className="border border-primary w-full p-2 h-[150px] rounded-xl focus:outline-none"
        />

        <div className="flex px-3 py-3 text-sm justify-evenly">
          <button
            onClick={() => handleModalToggle("off", true)}
            className={`px-4 py-1 font-semibold text-gray-700 border ${
              shopStatus ? "border-gray-600 opacity-50" : "border-green-600"
            } rounded-md`}
            disabled={shopStatusLoading || isLoading}
          >
            {shopStatus ? "Turn On" : "Turn Off"}
          </button>
          <button
            onClick={() => handleModalToggle("delete", true)}
            className="px-4 py-1 font-semibold text-gray-700 border border-red-400 rounded-md"
            disabled={shopDeleteLoading || isLoading}
          >
            Delete Shop
          </button>
          <Link
            to={`/shop-management/edit-shop/${shop._id}`}
            className="px-4 py-1 font-semibold text-gray-700 border rounded-md border-btnClr"
          >
            Edit
          </Link>
        </div>
      </div>

      {/* Turn Off Shop Modal */}
      <Modal
        title={
          <h3 className="text-center">
            {shopStatus ? "Turn On Shop?" : "Turn Off Shop?"}
          </h3>
        }
        width={380}
        open={isModalVisible.off}
        centered
        onOk={() => handleAction("off", shop._id)}
        onCancel={() => handleModalToggle("off", false)}
        confirmLoading={shopStatusLoading || isLoading}
        footer={
          <div className="flex justify-center gap-3 pt-5">
            <button
              className="px-12 border rounded border-primary"
              onClick={() => handleModalToggle("off", false)}
            >
              No
            </button>
            <button
              className="px-10 py-3.5 text-white bg-red-500 border rounded"
              type="primary"
              loading={shopStatusLoading || isLoading}
              onClick={() => handleAction("off", shop._id)}
            >
              {shopStatus ? "Turn On" : "Turn Off"}
            </button>
          </div>
        }
      >
        <p className="text-center">
          Are you sure you want to {shopStatus ? "turn on" : "turn off"} this
          shop?
        </p>
      </Modal>

      {/* Delete Shop Modal */}
      <Modal
        title={<h3 className="text-center">{"Delete Shop"}</h3>}
        width={380}
        open={isModalVisible.delete}
        centered
        onOk={() => handleAction("delete", shop._id)}
        onCancel={() => handleModalToggle("delete", false)}
        confirmLoading={shopDeleteLoading || isLoading}
        footer={
          <div className="flex justify-center gap-3 pt-5">
            <button
              className="px-12 border rounded border-primary"
              onClick={() => handleModalToggle("delete", false)}
            >
              No
            </button>
            <button
              className="px-10 py-3.5 text-white bg-red-500 border rounded"
              type="primary"
              loading={shopDeleteLoading || isLoading}
              onClick={() => handleAction("delete", shop._id)}
            >
              Delete
            </button>
          </div>
        }
      >
        <p className="text-center">
          Are you sure you want to delete this shop? This action cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
};

export default SingleShop;
