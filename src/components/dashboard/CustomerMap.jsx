import { Card, Spin } from "antd";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useCustomerMapAnalysisQuery } from "../../features/dashboard/dashboardApi";

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white border border-gray-300 rounded-lg shadow-md">
        <p className="font-semibold text-gray-700">{label}</p>
        <p className="font-bold text-primary">{`Customers : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const CustomerMap = () => {
  const [filter, setFilter] = useState("Weekly");

  const {
    data: CustomarData,
    error: queryError,
    isLoading: queryLoading,
  } = useCustomerMapAnalysisQuery(undefined);

  const mappedData =
    CustomarData?.data?.map((item) => ({
      name: item.day.substring(0, 3), // Shorten day name to 3 letters (e.g., "Sun")
      orders: item.totalOrders,
    })) || [];

  const handleChange = (value) => {
    setFilter(value);
  };

  if (queryError) {
    return (
      <section className="w-full lg:w-4/12 p-2 rounded-[10px] border border-primary">
        <Card className="w-full">
          <div className="flex items-center justify-center h-64">
            <p className="text-red-500">
              Failed to load data. Please try again later.
            </p>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section className="w-full lg:w-4/12 p-2 rounded-[10px] border border-primary">
      <Card className="w-full">
        <div className="flex flex-col items-start justify-between mb-4 sm:flex-row sm:items-center">
          <h3 className="m-0 text-xl font-bold md:text-2xl">Customer Map</h3>
          {/* Filter dropdown can be uncommented when needed */}
          {/* <Select
            defaultValue="Weekly"
            style={{ width: 120 }}
            onChange={handleChange}
            className="mt-2 sm:mt-0"
          >
            <Select.Option value="Weekly">Weekly</Select.Option>
            <Select.Option value="Monthly">Monthly</Select.Option>
          </Select> */}
        </div>

        {queryLoading ? (
          <div className="flex items-center justify-center h-64 md:h-72 lg:h-[343px]">
            <Spin />
          </div>
        ) : (
          <div className="w-full h-64 md:h-72 lg:h-[343px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mappedData}
                margin={{ top: 5, right: 5, left: 0, bottom: 10 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="orders"
                  fill="#B2742A"
                  barSize={30}
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </section>
  );
};

export default CustomerMap;
