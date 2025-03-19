import { Link, useLocation } from "react-router-dom";
import CustomLoading from "../../components/CustomLoading";
import Table from "../../components/Table";
import { useGetAllOfferQuery } from "../../features/offer/offerApi";
import { ConfigProvider, Select, Spin } from "antd";
import { useAllShopQuery } from "../../features/shop/shopApi";
import { useEffect, useState } from "react";
import { MdTune } from "react-icons/md";

const { Option } = Select;

const theme = {
  components: {
    Select: {
      activeOutlineColor: "none",
      activeBorderColor: "none",
      hoverBorderColor: "none",
    },
  },
};

const columns = [
  "SL",
  "Shop Name",
  "Item Name",
  "Offer Type",
  "Category",
  "Start Date",
  "End Date",
  "Price",
  "Status",
  "Action",
];

const Offer = () => {
  const path = useLocation();
  const [shopId, setShopId] = useState(() => localStorage.getItem("shopId") || "");

  const { data: allShop, error: queryError, isLoading: queryLoading } = useAllShopQuery();
  const { data, isLoading } = useGetAllOfferQuery(shopId); // Enable real-time updates

  useEffect(() => {
    if (allShop?.data?.length && !shopId) {
      const firstShopId = allShop.data[0]._id;
      setShopId(firstShopId);
      localStorage.setItem("shopId", firstShopId);
    }
  }, [allShop, shopId]);

  const handleChange = (value) => {
    setShopId(value);
    localStorage.setItem("shopId", value);
  };

  return (
    <div className="w-full pt-10 space-y-20">
      <div>
        <div className="flex items-center justify-end gap-3 pb-6">
          <div>
            <ConfigProvider theme={theme}>
              <Select
                value={queryLoading ? "Loading..." : shopId}
                size="large"
                style={{ minWidth: 150 }}
                onChange={handleChange}
                prefix={<MdTune className="text-xl text-gray-600" />}
                placeholder={queryLoading ? "Loading..." : allShop?.data?.length === 0 ? "No shops available" : "Select your shop"}
                disabled={queryLoading || allShop?.data?.length === 0} 
              >
                {queryLoading ? (
                  <Option value="" disabled>
                    <Spin size="small" /> Loading...
                  </Option>
                ) : allShop?.data?.length === 0 ? (
                  <Option value="" disabled>
                    No shops available
                  </Option>
                ) : (
                  allShop?.data?.shops.map((shop) => (
                    <Option key={shop._id} value={shop._id}>
                      {shop.shopName}
                    </Option>
                  ))
                )}
              </Select>
            </ConfigProvider>
          </div>
          <Link
            to="./create_offer"
            className="px-16 py-2 font-semibold text-white rounded-md bg-primary"
          >
            Create New Offer
          </Link>
        </div>

        {isLoading ? (
          <CustomLoading />
        ) : (
          <Table
            columns={columns}
            location={path.pathname}
            data={data?.data ? [...data.data].reverse() : []}
          />
        )}
      </div>
    </div>
  );
};

export default Offer;
