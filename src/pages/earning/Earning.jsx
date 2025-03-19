import { CalendarOutlined, DownOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, DatePicker, Select, Pagination } from "antd";
import dayjs from "dayjs";
import { debounce } from "lodash";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MdTune } from "react-icons/md";
import { useLocation } from "react-router-dom";
import CustomLoading from "../../components/CustomLoading";
import Table from "../../components/Table";
import { useGetEarningsQuery } from "../../features/earning/earningApi";
import { useAllShopQuery } from "../../features/shop/shopApi";

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
  "Date",
  "Order Number",
  "User Name",
  "Location",
  "Offer",
  "Item & Qty",
  "Revinue",
  "Service Charge",
  "Status",
  "Action",
];

const Earning = () => {
  const location = useLocation();
  const datePickerRef = useRef(null);
  const queryParams = new URLSearchParams(location.search);
  const searchValue = queryParams.get("search");

  const [date, setDate] = useState({
    year: dayjs().year(),
    month: dayjs().month() + 1,
  });
  const [shopId, setShopId] = useState(localStorage.getItem("shopId") || "");
  const [page, setPage] = useState(1); // Track the current page
  const limit = 10; // Define the number of items per page

  const { data: allShop, isLoading: queryLoading } = useAllShopQuery();

  const { data, error, isLoading } = useGetEarningsQuery(
    { year: date.year, shopId: shopId, month: date.month, page, limit },
    { skip: !date.year || !shopId || !date.month }
  );

  const handleSearch = useCallback(
    debounce((searchText) => {}, 300),
    []
  );

  useEffect(() => {
    handleSearch(searchValue);
  }, [searchValue, handleSearch]);

  const filteredOrders = useMemo(() => {
    const searchText = searchValue?.toLowerCase() || "";

    if (!searchText) {
      return data?.data?.earning?.slice().reverse() || [];
    }

    return data?.data?.earning
      ?.filter((order) => {
        return (
          order.orderNumber?.toLowerCase().includes(searchText) ||
          order?.shopId?.shopAddress?.toLowerCase().includes(searchText) ||
          order.location?.toLowerCase().includes(searchText) ||
          order?.products?.some((product) =>
            product?.productName?.toLowerCase().includes(searchText)
          )
        );
      })
      .slice()
      .reverse();
  }, [searchValue, data?.data?.earning]);

  useEffect(() => {
    if (allShop?.data?.length && !shopId) {
      const firstShopId = allShop.data[0]._id;
      setShopId(firstShopId);
      localStorage.setItem("shopId", firstShopId);
    }
  }, [allShop, shopId]);

  const handleDateChange = useCallback((selectedDate) => {
    if (selectedDate) {
      setDate({
        year: selectedDate.year(),
        month: selectedDate.month() + 1,
      });
    }
  }, []);

  const openDatePicker = useCallback(() => datePickerRef.current?.focus(), []);

  const handleChange = (value) => {
    localStorage.setItem("shopId", value);
    setShopId(value);
  };

  const onPageChange = (newPage) => {
    setPage(newPage); // Update current page
  };

  if (error) return <p>Error fetching earnings</p>;

  return (
    <section>
      <div className="flex justify-end gap-5 py-6 mt-4">
        <ConfigProvider theme={theme}>
          <Select
            value={queryLoading ? "Loading..." : shopId }
            size="large"
            style={{ minWidth: 150 }}
            onChange={handleChange}
            prefix={<MdTune className="text-xl text-gray-600" />}
          >
            <Option value="" disabled>
              Select your shop
            </Option>
            {allShop?.data?.shops?.map((shop) => (
              <Option key={shop._id} value={shop._id}>
                {shop.shopName}
              </Option>
            ))}
          </Select>
        </ConfigProvider>

        <Button
          className="flex items-center gap-3 px-3 py-[18px] bg-white border border-gray-300 rounded-lg cursor-pointer"
          onClick={openDatePicker}
        >
          <CalendarOutlined />{" "}
          {dayjs().month(date.month - 1).year(date.year).format("MMMM YYYY")}{" "}
          <DownOutlined />
        </Button>
        <DatePicker
          ref={datePickerRef}
          onChange={handleDateChange}
          picker="month"
          format="MMMM YYYY"
          className="absolute opacity-0 cursor-pointer"
        />
      </div>

      {
        isLoading ? <CustomLoading /> : <Table
        columns={columns}
        data={filteredOrders}
        location={location.pathname}
        renderRow={(item, i) => ""}
      />
      }

      <div className="flex justify-end">
      <Pagination
        current={page}
        pageSize={limit}
        total={data?.data?.pagination?.total || 0}
        onChange={onPageChange}
        showSizeChanger={false} // Optional: Show option to change items per page
        style={{ marginTop: 20, textAlign: "center" }}
      />
      </div>
    </section>
  );
};

export default Earning;
