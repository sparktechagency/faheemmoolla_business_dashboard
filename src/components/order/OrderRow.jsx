import { useState } from 'react';
import { Modal, Button, Dropdown, Card, Radio } from 'antd';

const OrderRow = ({item}) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const { date, orderNumber, userName, location, offer,  orderItem, price, serviceCharge, status} = item;
 

  const handleRadioChange = (e) => {
    setSelectedValue(e.target.value);
  };
  const showViewModal = () => {
    setIsViewModalOpen(true);
  };

  const handleViewOk = () => {
    setIsViewModalOpen(false);
  };

  const handleViewCancel = () => {
    setIsViewModalOpen(false);
  };

  const dropdownContent = (
    <Card className="w-64 p-4 shadow-lg">
      <h3 className="pb-2 mb-4 text-lg font-semibold text-gray-700 border-b">Food Order Status</h3>
      <Radio.Group onChange={handleRadioChange} value={selectedValue} className="space-y-2">
        <Radio value={1}>Preparing</Radio>
        <Radio value={2}>Ready for Pickup</Radio>
        <Radio value={3}>Delivered</Radio>
      </Radio.Group>
    </Card>
  );

  return (
    <div className="grid grid-cols-10 m-3 text-sm bg-gray-100 rounded-lg">
      <div className="py-3 text-center">{date}</div>
      <div className="py-3 text-center">{orderNumber}</div>
      <div className="py-3 text-center">{userName}</div>
      <div className="py-3 text-center">{location}</div>
      <div className="py-3 text-center">{offer}</div>
      <div className="py-3 text-center">{orderItem?.name}</div>
      <div className="py-3 text-center">{price}</div>
      <div className="py-3 text-center">{serviceCharge}</div>
      <div className="col-span-2 px-5 py-1 text-center">
        <div className='flex items-center justify-center gap-1 p-1 border border-green-400 rounded'>
          <button className='box-border p-1 border border-gray-400 rounded basis-1/2' onClick={showViewModal}>View Details</button>
          <Modal title="" visible={isViewModalOpen} onOk={handleViewOk} onCancel={handleViewCancel} footer={null}
            style={{width:"400px"}}
          >
            <div className='h-60'></div>
            <div className="p-4 mx-auto space-y-3 border rounded-lg border-primary max-w-80">
              <div className="flex justify-between">
                <p><strong>Order Number:</strong></p>
                <p>{orderNumber}</p>
              </div>
              <div className="flex justify-between">
                <p><strong>User Name:</strong></p>
                <p>{userName}</p>
              </div>
              <div className="flex justify-between">
                <p><strong>Location:</strong></p>
                <p>{location}</p>
              </div>
              <div className="flex justify-between">
                <p><strong>Date:</strong></p>
                <p>{date}</p>
              </div>
              <div className="flex justify-between">
                <p><strong>Offer:</strong></p>
                <p>{offer}</p>
              </div>
              <div className="flex justify-between">
                <p><strong>Order Item:</strong></p>
                <p>{orderItem.name}*{orderItem.qty}</p>
              </div>
              <div className="flex justify-between">
                <p><strong>Price:</strong></p>
                <p>${price}</p>
              </div>
              <div className="flex justify-between">
                <p><strong>Service Charge:</strong></p>
                <p>${serviceCharge}</p>
              </div>
              <div className="flex justify-between">
                <p><strong>Status:</strong></p>
                <p>{status}</p>
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <Button 
                type="default" 
                className="px-6 py-2 bg-primary border-none hover:!bg-primary hover:!text-gray-600" 
                onClick={handleViewOk}
                style={{width:"200px"}}
              >
                Done
              </Button>
            </div>
          </Modal>
          <div className="space-y-4 basis-1/2">
          <Dropdown 
            overlay={dropdownContent} 
            trigger={['click']} 
            placement="bottomRight" 
          >
            <button className="bg-primary p-[4px] text-white rounded w-full">
              Preparing
            </button>
          </Dropdown>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default OrderRow