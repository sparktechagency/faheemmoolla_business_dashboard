import { ConfigProvider, Select, Spin, Pagination } from "antd";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MdTune } from "react-icons/md";
import { useLocation } from "react-router-dom";
import OrderData from "../../assets/icons/orderData.png";
import shop_order from "../../assets/icons/shop_order.png";
import AnalysisCard from "../../components/AnalysisCard";
import Table from "../../components/Table";
import TableRow from "../../components/TableRow";
import { useGetOrderAnalysisQuery, useGetOrderQuery } from "../../features/order/orderApi";
import { useAllShopQuery } from "../../features/shop/shopApi";
import io from "socket.io-client";
import { baseURL } from "../../utils/BaseURL";

const { Option } = Select;

const columns = [
  "Date",
  "Order Number",
  "User Name",
  "Location",
  "Item",
  "Quantity",
  "Price",
  "Service Charge",
  "Status",
];

// Initialize socket connection
// Replace 'http://your-backend-url' with your actual backend URL
const socket = io(baseURL);

const Order = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchValue = queryParams.get("search");

  // State variables
  const [status, setStatus] = useState("");
  const [shopId, setShopId] = useState(() => localStorage.getItem("shopId") || "");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [forceRefetch, setForceRefetch] = useState(0); // For manual refetching

  // Fetch shop data
  const { data: allShop, isLoading: shopLoading } = useAllShopQuery(undefined, { 
    refetchOnFocus: true, 
    refetchOnReconnect: true 
  });

  // Fetch order analysis with socket-triggered refetching
  const { data: analysisData, isLoading: analysisLoading, refetch: refetchAnalysis } = useGetOrderAnalysisQuery(
    shopId, 
    { 
      refetchOnFocus: true, 
      refetchOnReconnect: true,
      skip: !shopId
    }
  );

  // Fetch orders with pagination and socket-triggered refetching
  const { 
    data: getOrder, 
    isLoading: orderLoading, 
    refetch: refetchOrders 
  } = useGetOrderQuery(
    { shopId, page, limit, forceRefetch }, // Added forceRefetch to dependencies
    { 
      refetchOnFocus: true, 
      refetchOnReconnect: true,
      skip: !shopId
    }
  );

  // Socket.io connection and event listeners
  useEffect(() => {
    // Listen for new orders
    socket.on(`notification::${localStorage.getItem("businessLoginId")}`, () => {
        refetchOrders();
        refetchAnalysis();
      
    });

    // Listen for order status updates
    socket.on(`notification::${localStorage.getItem("businessLoginId")}`, () => {
        refetchOrders();
        refetchAnalysis();
      
    });

    // Cleanup socket listeners on component unmount
    return () => {
      socket.off(`notification::${localStorage.getItem("businessLoginId")}`);
    };
  }, [shopId, refetchOrders, refetchAnalysis]);

  // Extract order data
  const totalOrders = getOrder?.data?.pagination?.total || 0;
  const totalPages = getOrder?.data?.pagination?.totalPage || 1;
  const orders = getOrder?.data?.order || [];

  // Check for shops and handle cases with no shops
  useEffect(() => {
    // If we have shops data from the API
    if (allShop?.data?.shops) {
      // Case 1: No shops exist at all
      if (allShop.data.shops.length === 0) {
        // Clear shopId since no shops exist
        setShopId("");
        localStorage.removeItem("shopId");
      } 
      // Case 2: Shops exist but current selection is invalid
      else if (shopId) {
        const shopExists = allShop.data.shops.some(shop => shop._id === shopId);
        if (!shopExists) {
          // Selected shop no longer exists, select first available shop
          const firstShopId = allShop.data.shops[0]._id;
          setShopId(firstShopId);
          localStorage.setItem("shopId", firstShopId);
        }
      }
      // Case 3: No shop selected but shops exist
      else if (allShop.data.shops.length > 0 && !shopId) {
        // Set default shop if none selected
        const firstShopId = allShop.data.shops[0]._id;
        setShopId(firstShopId);
        localStorage.setItem("shopId", firstShopId);
      }
    }
  }, [allShop, shopId]);

  // Debounced search
  const handleSearch = useCallback(
    debounce((searchText) => {
      console.log("Searching for:", searchText);
    }, 300),
    []
  );

  useEffect(() => {
    handleSearch(searchValue);
  }, [searchValue, handleSearch]);

  // Filter orders based on search and status
  const filteredOrders = useMemo(() => {
    const searchText = searchValue?.toLowerCase() || "";
    let filtered = orders.slice().reverse();

    if (searchText) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber?.toLowerCase().includes(searchText) ||
          order?.shopId?.shopAddress?.toLowerCase().includes(searchText) ||
          order.location?.toLowerCase().includes(searchText)
      );
    }

    if (status) {
      filtered = filtered.filter((order) => order.orderStatus === status);
    }

    return filtered;
  }, [orders, searchValue, status]);

  // Handlers for filters and pagination
  const handleShopChange = (value) => {
    setShopId(value);
    localStorage.setItem("shopId", value);
    setPage(1); // Reset to first page on shop change
  };

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const handlePageChange = (newPage) => {
    console.log("Changing page to:", newPage);
    setPage(newPage);
  };

  // Manual refresh handler for testing
  const handleManualRefresh = () => {
    setForceRefetch(prev => prev + 1); // Increment to trigger refetch
  };

  return (
    <div className="w-full">
      {/* Order Statistics */}
      <div className="flex items-end justify-between py-4 mt-4">
        <div className="flex items-center gap-8">
          <AnalysisCard
            value={analysisLoading ? <Spin /> : analysisData?.data?.completedOrdersCount || 0}
            title={"Completed Orders"}
            OrderDataImage={shop_order}
            percentage={"4% (30 days)"}
            OrderDatapercentage={OrderData}
          />
          <AnalysisCard
            value={analysisLoading ? <Spin /> : analysisData?.data?.progressOrdersCount || 0}
            title={"Orders in Progress"}
            OrderDataImage={shop_order}
            percentage={"12% (30 days)"}
            OrderDatapercentage={OrderData}
          />
          <AnalysisCard
            value={analysisLoading ? <Spin /> : analysisData?.data?.pendingOrdersCount || 0}
            title={"Pending Orders"}
            OrderDataImage={shop_order}
            percentage={"4% (30 days)"}
            OrderDatapercentage={OrderData}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <ConfigProvider>
            <Select
              size="large"
              style={{ minWidth: 150 }}
              onChange={handleStatusChange}
              value={status || undefined}
              placeholder="Select status"
              prefix={<MdTune className="text-xl text-gray-600" />}
            >
              <Option value="">All Status</Option>
              <Option value="pending">Pending</Option>
              <Option value="preparing">Preparing</Option>
              <Option value="ready for pickup">Ready for Pickup</Option>
              <Option value="delivered">Delivered</Option>
            </Select>
          </ConfigProvider>

          <ConfigProvider>
            <Select
              value={shopLoading ? "Loading..." : (allShop?.data?.shops?.length ? shopId : "")}
              size="large"
              style={{ minWidth: 150 }}
              onChange={handleShopChange}
              prefix={<MdTune className="text-xl text-gray-600" />}
              placeholder="No shops available"
              disabled={!allShop?.data?.shops?.length}
            >
              {allShop?.data?.shops?.length > 0 ? (
                allShop.data.shops.map((shop) => (
                  <Option key={shop._id} value={shop._id}>
                    {shop.shopName}
                  </Option>
                ))
              ) : (
                <Option value="" disabled>No shops available</Option>
              )}
            </Select>
          </ConfigProvider>
        </div>
      </div>

      {/* Orders Table and Pagination with Loading Spinner */}
      <Spin spinning={orderLoading} tip="Loading..." size="small">
        {allShop?.data?.shops?.length > 0 ? (
          <>
            <Table
              columns={columns}
              location={location.pathname}
              data={filteredOrders}
              renderRow={(item, i) => <TableRow key={i} item={item} columns={columns} />}
            />

            {/* Pagination */}
            <div className="flex justify-end mt-4">
              <Pagination
                current={page}
                total={totalOrders}
                pageSize={limit}
                onChange={handlePageChange}
              />
            </div>
          </>
        ) : (
          <div className="py-8 text-center">
            <p className="text-lg">No shops available. Please add a shop first.</p>
          </div>
        )}
      </Spin>
    </div>
  );
};

export default Order;