import { Spin } from "antd";
import { lazy, useEffect } from "react";
import { useAllCountAnalysisQuery } from "../../features/dashboard/dashboardApi";

const AnalysisCard = lazy(() => import("../../components/AnalysisCard"));
const CustomerMap = lazy(() =>
  import("../../components/dashboard/CustomerMap")
);
const OrderChart = lazy(() => import("../../components/dashboard/OrderChart"));
const PieCharts = lazy(() => import("../../components/dashboard/PieChart"));
const Revenue = lazy(() => import("../../components/dashboard/Revenue"));

import { useNavigate } from "react-router-dom";
import down from "../../assets/icons/down.png";
import Icon_Order from "../../assets/icons/Icon_Order.png";
import Items_Delivered from "../../assets/icons/Items_Delivered.png";
import OrderData from "../../assets/icons/orderData.png";
import revenue from "../../assets/icons/revenue.png";
import shop_order from "../../assets/icons/shop_order.png";

const Dashboard = () => {
  const {
    data: allShop,
    error: queryError,
    isLoading: queryLoading,
  } = useAllCountAnalysisQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (status === "rejected" && queryError) {
      localStorage.removeItem("businessToken");
      navigate("/auth/login");
    }
  }, [queryError, navigate]);
  const analysisCards = [
    {
      value: queryLoading ? <div className="text-center"><Spin /></div> : allShop?.data?.totalFoodSell,
      title: "Total Food Sell",
      icon: Icon_Order,
      percentage: "4% (30 days)",
      orderData: OrderData,
    },
    {
      value: queryLoading ? <div className="text-center"><Spin /></div> : `R${allShop?.data?.totalRevenue?.toFixed(2)}`,
      title: "Total Revenue",
      icon: revenue,
      percentage: "12% (30 days)",
      orderData: down,
    },
    {
      value: queryLoading ? <div className="text-center"><Spin /></div> : allShop?.data?.totalItems || 0,
      title: "Total Items",
      icon: shop_order,
    },
    {
      value: queryLoading ? <div className="text-center"><Spin /></div> : allShop?.data?.totalShops || 0,
      title: "Total Shops",
      icon: Items_Delivered,
    },
  ];

  return (
    <div className="flex flex-col gap-10 py-10">
      {/* Analysis Cards with Skeleton Loading */}
      <div className="grid items-center grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4">
        {analysisCards.map((card, index) => (
          <div key={index}>
            <AnalysisCard
              value={card.value}
              title={card.title}
              OrderDataImage={card.icon}
              percentage={card.percentage}
              OrderDatapercentage={card.orderData || ""}
            />
          </div>
        ))}
      </div>


      {/* PieCharts and OrderChart with Skeleton Loading */}
      <div className="flex items-center justify-between gap-10">
        <PieCharts />
        <OrderChart />
      </div>

      {/* Revenue and CustomerMap with Skeleton Loading */}
      <div className="flex items-center justify-between gap-10">
        <Revenue />
        <CustomerMap />
      </div>
    </div>
  );
};

export default Dashboard;
