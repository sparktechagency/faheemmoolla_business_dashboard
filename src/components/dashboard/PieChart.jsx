import { Card, Select, Spin } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import React, { Suspense, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { usePieChartAnalysisQuery } from "../../features/dashboard/dashboardApi";
import Loading from "../Loading";

const colorMapping = {
  "Total Food Sell": { filled: "#FF5B5B", remaining: "#f88484" },
  "Customer Growth": { filled: "#00B074", remaining: "#c5fcce" },
  "Total Revenue": { filled: "#2D9CDB", remaining: "#bbd7f2" },
  default: { filled: "#CCCCCC", remaining: "#E5E5E5" },
};

const PieChartComponent = ({ item }) => {
  const colors = colorMapping[item.name] || colorMapping.default;

  return (
    <motion.div
      key={item.id || item.name} // Use unique key if available
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="pie-chart-container"
    >
      <ResponsiveContainer width={120} height={120}>
        <PieChart>
          <Pie
            data={[
              { value: item.value, name: item.name },
              { value: 100 - item.value, name: "Remaining" },
            ]}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={30}
            outerRadius={60}
            startAngle={90}
            endAngle={-270}
          >
            <Cell key="filled" fill={colors.filled} />
            <Cell key="remaining" fill={colors.remaining} />
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="pie-chart-percentage" style={{ color: colors.filled }}>
        {item.value}%
      </div>
      <div className="pie-chart-label">{item.name}</div>
    </motion.div>
  );
};

const PieCharts = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const { data, error, isLoading } = usePieChartAnalysisQuery(year , {refetchOnFocus:true, refetchOnReconnect:true} );

  const handleYearChange = (value) => setYear(value);

  return (
    <section className="w-full rounded-[10px] border border-primary">
      <Card
        title={<span className="text-[24px] font-bold">Pie Chart</span>}
        extra={
          <Select
            value={year}
            style={{ width: 120, marginRight: 10 }}
            onChange={handleYearChange}
          >
            {years.map((y) => (
              <Select.Option key={y} value={y}>
                {y}
              </Select.Option>
            ))}
          </Select>
        }
      >
        <div className="pie-chart-container-wrapper">
          {error ? (
            <p className="font-bold text-red-500">Error: {error.message}</p>
          ) : isLoading ? (
            <Suspense fallback={<Spin/>}>
              <Spin/>
            </Suspense>
          ) : (
            <AnimatePresence>
              {data?.data?.map((item) => (
                <PieChartComponent key={item.id || item.name} item={item} />
              ))}
            </AnimatePresence>
          )}
        </div>
      </Card>
    </section>
  );
};

export default PieCharts;
