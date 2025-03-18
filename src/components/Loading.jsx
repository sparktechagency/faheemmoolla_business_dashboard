import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import React from "react";

const Loading = () => {
  return (

      <Spin 
        indicator={<LoadingOutlined style={{ fontSize: 40, color: "#C68C4E" }} spin />} 
        size="large" 
      />

  );
};

export default Loading;
