import { Button, Card, Dropdown, Modal, Radio, Spin, message } from "antd";
import { useState } from "react";
import shop from "../assets/shop/Shop.png";
import { useGetEarningsDetailQuery } from "../features/earning/earningApi";
import { useGetOfferDetalsQuery } from "../features/offer/offerApi";
import {
  useSingleOrderQuery,
  useUpdateOrderMutation,
} from "../features/order/orderApi";
import { baseURL } from "../utils/BaseURL";
import CustomLoading from "./CustomLoading";
import Loading from "./Loading";

const OrderRow = ({ item, list, location }) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [detailsId, setDetailsId] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { data: details, isLoading } = useGetOfferDetalsQuery(detailsId, {
    skip: !detailsId || location !== "/offer",
  });

  const { data: order, isLoading: orderLoading } = useSingleOrderQuery(
    detailsId,
    {
      skip: !detailsId || location !== "/order",
    }
  );

  const { data: earningDetails, isLoading: earningLoadingdetails } =
    useGetEarningsDetailQuery(detailsId, {
      skip: !detailsId || location !== "/earning",
    });

  console.log(earningDetails);

  const [updateOrder, { isLoading: isLoadingStatus }] =
    useUpdateOrderMutation();

  const {
    discountPrice,
    endDate,
    itemName,
    offerTitle,
    shopCategory,
    shopName,
    stateDate,
    status,
    _id,
    orderNumber,
    orderStatus,
    userId,
    shopId,
    products,
    createdAt,
  } = item;

  const dateObj = new Date(createdAt);
  const formattedDate = `${dateObj.getDate().toString().padStart(2, "0")}-${(
    dateObj.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${dateObj.getFullYear()}`;

  const handleRadioChange = async (e) => {
    const newStatus = e.target.value;

    try {
      const response = await updateOrder({ id: _id, status: newStatus });
      if (response.error) {
        message.error(response.error.data.message);
      }
      setIsViewModalOpen(false);
    } catch (error) {
      setIsViewModalOpen(false);
      console.error("Error updating order:", error?.data?.message);
      message.error(error?.data?.message);
    }

    setDropdownVisible(false);
  };

  const showViewModal = (id) => {
    setDetailsId(id);
    setIsViewModalOpen(true);
  };

  const handleViewOk = () => {
    setIsViewModalOpen(false);
  };

  const handleViewCancel = () => {
    setIsViewModalOpen(false);
  };

  const handleDropdownVisibleChange = (visible) => {
    setDropdownVisible(visible);
  };

  console.log(item);

  const dropdownContent = (
    <Card className="relative shadow-lg w-52">
      {isLoadingStatus && (
        <div className="absolute inset-0 flex items-center justify-center bg-white opacity-50">
          <CustomLoading />
        </div>
      )}

      <Radio.Group
        onChange={handleRadioChange}
        value={item?.orderStatus}
        className="space-y-2"
        disabled={isLoadingStatus} // Disable buttons while loading
      >
        <Radio value={"preparing"}>Preparing</Radio>
        <Radio value={"ready for pickup"}>Ready for Pickup</Radio>
        <Radio value={"delivered"}>Delivered</Radio>
      </Radio.Group>
    </Card>
  );

  const detailsearning = new Date(earningDetails?.data?.createdAt);
  const EarningDetails = `${detailsearning
    .getDate()
    .toString()
    .padStart(2, "0")}-${(detailsearning.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${detailsearning.getFullYear()}`;

  console.log(order);

  const renderModalContent = () => (
    <>
      {location === "/offer" && (
        <>
          {isLoading ? (
            <Spin />
          ) : (
            <>
              <div className="mt-7">
                <img
                  className="rounded-md h-[200px]"
                  src={`${baseURL}/${details?.data?.image}`}
                  alt="Order Product"
                  width="100%"
                  height="100%"
                />
              </div>
              <div className="max-w-full p-4 mx-auto mt-5 space-y-3 border rounded-lg border-primary">
                <div className="flex gap-1 text-base font-medium">
                  <p>
                    <strong className="text-black">Shop Name:</strong>
                  </p>
                  <p className="text-black ">{shopId?.shopName}</p>
                </div>
                <div className="flex items-center gap-1 text-base font-medium">
                  <p>
                    <strong className="text-black">Item Name:</strong>
                  </p>
                  <p className="text-black ">{details?.data?.itemName}</p>
                </div>
                <div className="flex items-center gap-1 text-base font-medium">
                  <p>
                    <strong className="text-black ">Item Category:</strong>
                  </p>
                  <p className="text-black ">{details?.data?.shopCategory}</p>
                </div>

                <div className="flex items-center gap-1 text-base font-medium">
                  <p>
                    <strong className="text-black ">Offer Type:</strong>
                  </p>
                  <p className="text-black ">{details?.data?.offerTitle}</p>
                </div>
                <div className="flex items-center gap-1 text-base font-medium">
                  <p>
                    <strong className="text-black ">Discount Price:</strong>
                  </p>
                  <p className="text-black ">{details?.data?.discountPrice}</p>
                </div>
                <div className="flex items-center gap-1 text-base font-medium">
                  <p>
                    <strong className="text-black ">Start Date:</strong>
                  </p>
                  <p className="text-black ">{details?.data?.stateDate}</p>
                </div>
                <div className="flex items-center gap-1 text-base font-medium">
                  <p>
                    <strong className="text-black ">End Date:</strong>
                  </p>
                  <p className="text-black ">{details?.data?.endDate}</p>
                </div>
                <div className="flex items-center gap-1 text-base">
                  <p>
                    <strong className="text-black ">Status:</strong>
                  </p>
                  <p className="font-medium text-black">
                    {details?.data?.status}
                  </p>
                </div>
              </div>{" "}
            </>
          )}
        </>
      )}

      {location === "/earning" &&
        (earningLoadingdetails ? (
          <CustomLoading />
        ) : (
          <>
            <div className="mt-7">
              <img
                className="rounded-md"
                src={shop}
                alt="Order Product"
                width="100%"
                height="100%"
              />
            </div>
            <div className="p-4 mx-auto mt-5 space-y-3 border rounded-lg border-primary max-w-max">
              <div className="flex gap-1 text-lg font-medium">
                <p>
                  <strong className="text-black">Order Number:</strong>
                </p>
                <p className="text-black ">
                  {earningDetails?.data?.orderNumber}
                </p>
              </div>
              {/* <div className="flex items-center gap-1 text-lg font-medium">
                <p>
                  <strong className="text-black">User Name:</strong>
                </p>
                <p className="text-black ">{"jhon"}</p>
              </div> */}
              {/* <div className="flex items-center gap-1 text-lg font-medium">
                <p>
                  <strong className="text-black ">Location:</strong>
                </p>
                <p className="text-black ">{"Dhaka"}</p>
              </div> */}
              <div className="flex items-center gap-1 text-lg font-medium">
                <p>
                  <strong className="text-black ">Date:</strong>
                </p>
                <p className="text-black ">{EarningDetails}</p>
              </div>
              <div className="flex items-center gap-1 text-lg font-medium">
                <p>
                  <strong className="text-black text-nowrap">
                    Order Item & Qty:
                  </strong>
                </p>
                <p className="text-black text-nowrap">
                  {earningDetails?.data?.products
                    ?.map((item) => `${item.productName} * ${item.quantity}`)
                    .join(", ")}
                </p>
              </div>
              <div className="flex items-center gap-1 text-lg font-medium">
                <p>
                  <strong className="text-black ">Price:</strong>
                </p>
                <p className="text-black ">
                  ${earningDetails?.data?.totalAmount}
                </p>
              </div>
              <div className="flex items-center gap-1 text-lg font-medium">
                <p>
                  <strong className="text-black ">App Service charge:</strong>
                </p>
                <p className="text-black ">{"10%"}</p>
              </div>
              <div className="flex items-center gap-1 text-lg font-medium">
                <p>
                  <strong className="text-black ">Status:</strong>
                </p>
                <p className="text-black ">
                  {earningDetails?.data?.orderStatus}
                </p>
              </div>
            </div>
          </>
        ))}

      {location === "/order" &&
        (orderLoading ? (
          <div className="flex items-center justify-center">
            <CustomLoading />
          </div>
        ) : (
          <>
            <div className="mt-7">
              <img
                className="rounded-md"
                src={shop}
                alt="Order Product"
                width="100%"
                height="100%"
              />
            </div>
            <div className="p-4 mx-auto mt-5 space-y-3 border rounded-lg max-w-min border-primary">
              <div className="flex gap-1 text-lg font-medium">
                <p>
                  <strong className="text-black">Order Number:</strong>
                </p>
                <p className="text-black ">{order?.data?.orderNumber}</p>
              </div>
              <div className="flex items-center gap-1 text-lg font-medium">
                <p>
                  <strong className="text-black text-nowrap">
                    Order Item & Qty:
                  </strong>
                </p>
                <p className="text-black text-nowrap">
                  {order?.data?.products
                    ?.map((item) => `${item.productName} * ${item.quantity}`)
                    .join(", ")}
                </p>
              </div>
              <div className="flex items-center gap-1 text-lg font-medium">
                <p>
                  <strong className="text-black ">Price:</strong>
                </p>
                <p className="text-black ">${order?.data?.totalAmount}</p>
              </div>
              <div className="flex items-center gap-1 text-lg font-medium">
                <p>
                  <strong className="text-black ">App Service charge:</strong>
                </p>
                <p className="text-black "> {order?.data?.shopId?.revenue}%</p>
              </div>
              <div className="flex items-center gap-1 text-lg font-medium">
                <p>
                  <strong className="text-black ">Status:</strong>
                </p>
                <p className="text-black ">{order?.data?.orderStatus}</p>
              </div>
            </div>
          </>
        ))}

      <div className="flex justify-center mt-6">
        <Button
          type="default"
          className="px-6 py-2 bg-primary border-none text-white hover:!bg-primary hover:!text-white"
          onClick={handleViewOk}
          style={{ width: "200px" }}
        >
          Done
        </Button>
      </div>
    </>
  );

  return (
    <div
      className={`grid ${
        location === "/order" ? "grid-cols-11" : "grid-cols-10"
      } ${location === "/offer" ? "grid-cols-11" : "grid-cols-10"} ${
        location === "/earning" ? "grid-cols-10" : "grid-cols-11"
      } m-3 text-sm bg-gray-100 rounded-lg whitespace-nowrap`}
    >
      <div
        className={` py-3 overflow-hidden ${
          location === "/offer" && "text-start px-3"
        } ${location === "/earning" && "text-start "} overflow-ellipsis`}
      >
        {location === "/offer" && list + 1}{" "}
        {location === "/earning" && formattedDate}{" "}
        {location === "/order" && formattedDate}
      </div>
      <div
        className={` py-3 overflow-hidden ${
          location === "/offer" && "text-start px-3"
        }   ${location === "/earning" && "text-start px-3"} overflow-ellipsis`}
      >
        {location === "/earning" && shopName}
        {orderNumber} {location === "/offer" && shopId?.shopName}
      </div>
      <div
        className={`px-3 py-3 overflow-hidden ${
          location === "/offer" && "text-start"
        } ${location === "/earning" && "text-start px-3"} overflow-ellipsis`}
      >
        {itemName} {userId?.name}{" "}
      </div>
      <div
        className={` py-3 overflow-hidden ${
          location === "/offer" && "text-start px-1.5"
        } ${location === "/earning" && "text-start px-4"} ${
          location === "/order" && "text-center px-4"
        } overflow-ellipsis`}
      >
        {offerTitle} {shopId?.shopAddress}
      </div>
      <div
        className={` py-3 overflow-hidden ${
          location === "/offer" && "text-start px-1.5"
        } ${location === "/earning" && "text-start px-4"}  ${
          location === "/order" && "text-center px-4"
        }  overflow-ellipsis`}
      >
        {shopCategory}{" "}
        {location === "/earning" && (userId?.orders === true ? "Yes" : "No")}{" "}
        {location === "/order" && "pronab"}
      </div>
      <div
        className={` py-3 overflow-hidden ${
          location === "/offer" && "text-start px-1"
        } ${location === "/earning" && "text-start px-4"}  ${
          location === "/order" && "text-center  px-4"
        }  `}
      >
        {stateDate}{" "}
        {location === "/earning" &&
          products.map((items) => (
            <span
              key={items?.productName}
            >{`${items?.productName} * ${items?.quantity}`}</span>
          ))}{" "}
        {location === "/order" &&
          products.map((items) => (
            <span
              key={items?.productName}
            >{`${items?.productName} * ${items?.quantity}`}</span>
          ))}
      </div>
      <div
        className={`px-3 py-3 overflow-hidden ${
          location === "/offer" && "text-start px-2"
        } ${location === "/earning" && "text-start px-4"} overflow-ellipsis`}
      >
        {endDate} {location === "/earning" && item?.totalAmount}
      </div>
      <div
        className={`px-3 py-3 ${
          location === "/offer" && "text-start px-[8px]"
        } ${location === "/earning" && "text-start px-5"} truncate`}
      >
        {" "}
        {location === "/offer" && discountPrice}{" "}
        {location === "/earning" && shopId?.revenue}{location === "/earning" && "%"}
        {location === "/order" && item?.totalAmount}
      </div>
      <div
        className={` py-3 overflow-hidden ${
          location === "/offer" && "text-center px-2"
        } ${location === "/earning" && "text-start ml-2"} rounded ${
          orderStatus === "active" || status === "active"
            ? "bg-green-500 text-white"
            : ""
        } overflow-ellipsis ${
          orderStatus === "completed" || status === "completed"
            ? "bg-red-500 text-white"
            : ""
        } ${
          orderStatus === "panding" || status === "panding"
            ? "bg-orange-400 text-white"
            : ""
        }`}
      >
        {status} {location === "/offer" && orderStatus}{" "}
        {location === "/earning" && orderStatus}{" "}
        {location === "/order" && item?.shopId?.revenue}{" "}
        {location === "/order" && "%"}
      </div>
      <div
        className={`${
          location === "/earning" ? "" : "col-span-2"
        } px-5 text-center`}
      >
        <div
          className={`${
            location === "/offer" ? "" : "flex items-center justify-center"
          } gap-1 p-1 ${
            location === "/earning"
              ? ""
              : location === "/offer"
              ? ""
              : "border border-green-500"
          } rounded`}
        >
          <button
            className={`${
              location === "/earning"
                ? "bg-primary p-2 text-white"
                : `box-border border ${
                    location === "/order" ? "px-2.5" : "px-10"
                  }  py-2 border-primary `
            } rounded`}
            onClick={() => showViewModal(_id)}
          >
            View Details
          </button>
          <Modal
            title=""
            visible={isViewModalOpen}
            onOk={handleViewOk}
            onCancel={handleViewCancel}
            footer={null}
            style={{ width: "400px", padding: "0px" }}
          >
            {isLoading || earningLoadingdetails ? (
              <CustomLoading />
            ) : (
              renderModalContent()
            )}
          </Modal>
          {location !== "/earning" && (
            <div className="space-y-4 basis-1/2">
              {location === "/offer" ? null : (
                <Dropdown
                  overlay={dropdownContent}
                  disabled={
                    item.orderStatus === "delivered" ||
                    item.orderStatus === "canceled"
                  }
                  trigger={["click"]}
                  placement="bottomRight"
                  visible={dropdownVisible} // Control visibility manually
                  onVisibleChange={handleDropdownVisibleChange} // Handle visibility change
                >
                  <button
                    className={`w-[120px] p-2 text-white rounded ${
                      item.orderStatus === "delivered"
                        ? "bg-green-600"
                        : item.orderStatus === "canceled"
                        ? "bg-red-600" // You can replace with any color you want for canceled status
                        : "bg-primary"
                    }`}
                  >
                    {item?.orderStatus || "Select Status"}
                  </button>
                </Dropdown>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderRow;
