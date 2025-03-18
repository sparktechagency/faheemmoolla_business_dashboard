import { useState } from "react";
import { Dropdown, Card, Radio } from "antd";
import { Link } from "react-router-dom";

const OfferRow = ({ item }) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const {
    key,
    shopName,
    itemName,
    offerType,
    category,
    startDate,
    endDate,
    price,
    status,
  } = item;

  const handleRadioChange = (e) => {
    setSelectedValue(e.target.value);
  };

  const dropdownContent = (
    <Card className="w-64 p-4 shadow-lg">
      <h3 className="pb-2 mb-4 text-lg font-semibold text-gray-700 border-b">
        Food Order Status
      </h3>
      <Radio.Group
        onChange={handleRadioChange}
        value={selectedValue}
        className="space-y-2"
      >
        <Radio value={1}>Preparing</Radio>
        <Radio value={2}>Ready for Pickup</Radio>
        <Radio value={3}>Delivered</Radio>
      </Radio.Group>
    </Card>
  );

  return (
    <div className="grid grid-cols-11 m-3 text-sm bg-gray-100 rounded-lg">
      <div className="py-3 text-center">{key}</div>
      <div className="py-3 text-center">{shopName}</div>
      <div className="py-3 text-center">{itemName}</div>
      <div className="py-3 text-center">{offerType}</div>
      <div className="py-3 text-center">{category}</div>
      <div className="py-3 text-center">{startDate}</div>
      <div className="py-3 text-center">{endDate}</div>
      <div className="py-3 text-center">{price}</div>
      <div className="py-3 text-center">{status}</div>
      <div className="col-span-2 px-5 py-1 text-center">
        <div className="flex items-center justify-center gap-1 p-1 border border-green-400 rounded">
          <Link to="./view-details" className="box-border p-1 border border-gray-400 rounded basis-1/2" >
            Details
          </Link>
          <div className="space-y-4 basis-1/2">
            <Dropdown
              menu={dropdownContent}
              trigger={["click"]}
              placement="bottomRight"
            >
              <button className="bg-primary p-[4px] text-white rounded w-full">
                Completed
              </button>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferRow;
