import { Card, Select, Spin } from "antd";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Dot,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useRevinueChartAnalysisQuery } from "../../features/dashboard/dashboardApi";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#fff",
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #ddd",
          boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <p style={{ margin: 0, fontWeight: "bold" }}>{label}</p>
        <p style={{ margin: 0, color: "#1890ff" }}>
          Revenue: ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const CustomDot = (props) => {
  const { cx, cy, value, maxRevenue, minRevenue } = props;
  if (value === maxRevenue || value === minRevenue) {
    return (
      <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}>
        <Dot
          cx={cx}
          cy={cy}
          r={6}
          fill={value === maxRevenue ? "#1890ff" : "#ff4d4f"}
        />
        <foreignObject 
          x={cx - 30} 
          y={cy - 40} 
          width={80} 
          height={20}
          className="hidden sm:block" // Hide on very small screens
        >
          <div
            style={{
              background: value === maxRevenue ? "#e6f7ff" : "#fff1f0",
              color: value === maxRevenue ? "#1890ff" : "#ff4d4f",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            ${value.toLocaleString()}
          </div>
        </foreignObject>
      </motion.g>
    );
  }
  return null;
};

const Revenue = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const {
    data: revenueData,
    error: queryError,
    isLoading: queryLoading,
  } = useRevinueChartAnalysisQuery(selectedYear, {refetchOnFocus:true, refetchOnReconnect:true});

  const yearOptions = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );

  return (
    <section className="w-full md:w-10/12 lg:w-8/12 mx-auto px-2 sm:px-1 py-1 rounded-[10px] border border-primary">
      <Card style={{ width: "100%" }} bodyStyle={{ padding: "12px 16px" }}>
        <div
          className="flex flex-col items-start justify-between gap-2 mb-2 sm:flex-row sm:items-center"
        >
          <h3 className="text-lg font-bold sm:text-xl md:text-2xl">
            Total Revenue
          </h3>
          <Select
            defaultValue={selectedYear}
            style={{ width: 100 }}
            onChange={(value) => setSelectedYear(value)}
            loading={queryLoading}
          >
            {yearOptions.map((year) => (
              <Select.Option key={year} value={year}>
                {year}
              </Select.Option>
            ))}
          </Select>
        </div>
        {queryLoading ? (
          <div className="flex items-center justify-center h-64 sm:h-72 md:h-80 lg:h-96">
            <Spin size="large" />
          </div>
        ) : (
          <div className="h-64 sm:h-72 md:h-80 lg:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={revenueData?.data}
                margin={{ 
                  top: 20, 
                  right: 10, 
                  left: 0, 
                  bottom: 10 
                }}
              >
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: '11px' }}
                  tickMargin={10}
                />
                <YAxis
                  tick={{ fill: "#aaa", fontSize: '11px' }}
                  tickFormatter={(tick) => `R${tick / 1000}k`}
                  width={40}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="totalRevenue"
                  stroke="#1890ff"
                  strokeWidth={2}
                  dot={<CustomDot />}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </section>
  );
};

export default Revenue;