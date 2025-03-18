import { Spin } from "antd";
import React from "react";

const CustomLoading = () => {
  return (
    <div className="flex items-center justify-center py-10 h-[300px]">
              <div className="w-16 h-16 border-t-4 border-b-4 rounded-full border-primary animate-spin"></div>
            </div>
  );
};

export default CustomLoading;
