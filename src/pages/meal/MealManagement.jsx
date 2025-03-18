import { ConfigProvider, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { MdTune } from "react-icons/md";
import { Link } from "react-router-dom";
import SingleMeal from "../../components/meal/SingleMeal";
import { useGetMealsByShopQuery } from "../../features/meal/mealApi";
import { useAllShopQuery } from "../../features/shop/shopApi";
import CustomLoading from "../../components/CustomLoading";

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

const ShopSelector = ({ shops, loading, value, onChange }) => (
  <ConfigProvider theme={theme}>
    <Select
      value={loading ? "Loading..." : value}
      size="large"
      style={{ minWidth: 150 }}
      onChange={onChange}
      prefix={<MdTune className="text-xl text-gray-600" />}
      loading={loading}
      disabled={loading}
      placeholder={shops?.length === 0 ? "No shops available" : "Select your shop"}
    >
      {loading ? (
        <Option value="" disabled>
          <Spin size="small" /> Loading...
        </Option>
      ) : shops?.length === 0 ? (
        <Option value="" disabled>
          No shops available
        </Option>
      ) : (
        shops.map((shop) => (
          <Option key={shop._id} value={shop._id}>
            {shop.shopName}
          </Option>
        ))
      )}
    </Select>
  </ConfigProvider>
);

const MealManagement = () => {
  const [shopId, setShopId] = useState(localStorage.getItem("shopId") || null);
  const { data: allShop, isLoading: shopLoading, error: shopError } = useAllShopQuery();
  const {
    data: meals,
    isLoading: mealLoading,
    error: mealError,
    refetch,
  } = useGetMealsByShopQuery(shopId, { skip: !shopId });

  const [isFetchingMeals, setIsFetchingMeals] = useState(false); // Track meal fetching state

  useEffect(() => {
    if (shopId) {
      setIsFetchingMeals(true); // Start fetching meals
      refetch()
        .unwrap()
        .finally(() => setIsFetchingMeals(false)); // Stop fetching meals
    }
  }, [shopId, refetch]);

  useEffect(() => {
    if (allShop?.data?.shops?.length === 0) {
      localStorage.removeItem("shopId");
      setShopId(null);
    } else if (!shopId && allShop?.data?.shops?.length > 0) {
      const firstShopId = allShop.data.shops[0]._id;
      setShopId(firstShopId);
      localStorage.setItem("shopId", firstShopId);
    }
  }, [allShop?.data?.shops, shopId]);

  const handleShopChange = (value) => {
    setShopId(value);
    localStorage.setItem("shopId", value);
  };

  if (shopError) {
    return <p className="text-center text-red-500">Error: {shopError.message}</p>;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-end p-4">
        <ShopSelector
          shops={allShop?.data?.shops}
          loading={shopLoading}
          value={shopId}
          onChange={handleShopChange}
        />
        <Link
          to="./create-new-meal"
          className="px-6 py-2 my-10 ml-4 font-semibold text-white rounded-md bg-primary"
        >
          Create New Meal
        </Link>
      </div>

      {isFetchingMeals || mealLoading ? ( // Show loading state while fetching meals
        <CustomLoading />
      ) : mealError ? (
        <div className="p-6 text-center rounded-2xl">
          <h2 className="text-2xl font-semibold text-gray-800">
            {mealError?.data?.message || "An error occurred while fetching meals."}
          </h2>
        </div>
      ) : meals?.data?.length === 0 ? ( // Show message if no meals are available
        <div className="p-6 text-center rounded-2xl">
          <h2 className="text-2xl font-semibold text-gray-800">No meals available for this shop.</h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-10 py-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {meals?.data?.map((item) => (
            <div key={item._id}>
              <SingleMeal items={item} />
            </div>
          ))}
        </div>
      )}

      {!shopId && (
        <p className="text-center h-[300px] flex justify-center font-semibold items-center gap-2">
          Create Your shop{" "}
          <Link className="text-yellow-700" to="/shop-management">
            Shop Management
          </Link>
        </p>
      )}
    </div>
  );
};

export default MealManagement;
