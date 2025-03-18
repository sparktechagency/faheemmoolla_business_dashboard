import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { ConfigProvider, Modal, Button, Form, Input, Select, DatePicker, message } from 'antd';
import { useUpdateAccountDetailsMutation } from '../../features/bank/bankApi';

const MyFormItemContext = createContext([]);

function toArr(str) {
  return Array.isArray(str) ? str : [str];
}

const MyFormItemGroup = ({ prefix, children }) => {
  const prefixPath = useContext(MyFormItemContext);
  const concatPath = useMemo(() => [...prefixPath, ...toArr(prefix)], [prefixPath, prefix]);
  return <MyFormItemContext.Provider value={concatPath}>{children}</MyFormItemContext.Provider>;
};

const MyFormItem = ({ name, ...props }) => {
  const prefixPath = useContext(MyFormItemContext);
  const concatName = name !== undefined ? [...prefixPath, ...toArr(name)] : undefined;
  return <Form.Item name={concatName} {...props} />;
};

const BankRow = ({ item, list, data , allShop}) => {
  const [shopName , setShopName] = useState("");

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [id, setId] = useState(null);
  const [updateAccountDetails, { isLoading }] = useUpdateAccountDetailsMutation();

  const showViewModal = useCallback((id) => {
     const result = allShop?.data?.shops?.find(shop => shop?.bankCard._id === id);
     setShopName(result?.shopName)
  
    const selectedItem = data?.find(item => item?.bankCard?._id === id);
    if (selectedItem) {
      setId(selectedItem?._id);
    } else {
      alert("No matching item found");
    }
    setIsViewModalOpen(true);
  }, [data]);

  const handleViewCancel = useCallback(() => {
    setIsViewModalOpen(false);
  }, []);

  const onFinish = useCallback(async (values) => {
    const year = values?.Date.$y; 
    const month = (values?.Date?.$M) + 1; 

    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedYear = year.toString().slice(-2); 
  
    const user = {
      cardNumber: values?.name?.Card_Number,
      cardHolderName: values.name.Card_Holder_Name,
      expireDate: `${formattedMonth}/${formattedYear}`,
      cvv: values.CVV
    };
    try {
      await updateAccountDetails({ id, data: user }).unwrap();
      setIsViewModalOpen(false);
    } catch (error) {
      message.error(error);
    }
  }, [id, updateAccountDetails]);
  

  const onChange = useCallback((value) => {
    message.error('selected:', value);
  }, []);

  const onSearch = useCallback((value) => {
    message.error('search:', value);
  }, []);

  return (
    <div className="grid grid-cols-7 m-3 text-sm bg-gray-100 rounded-lg">
      <div className="py-3 text-center">{list + 1}</div>
      <div className="py-3 text-center">{item?.cardHolderName}</div>
      <div className="py-3 text-center">{item.cardNumber}</div>
      <div className="py-3 text-center">{item.expireDate}</div>
      <div className="py-3 text-center">{item.cvv}</div>
      <div className="py-3 text-center">Active</div>
      <div className="px-5 py-1 text-center">
        <div className='p-1 border border-[#00721E] rounded'>
          <button 
            className='bg-primary p-[4px] text-white rounded w-full' 
            onClick={() => showViewModal(item?._id)}
            aria-label="Edit"
          >
            Edit
          </button>
          <Modal 
            title="" 
            open={isViewModalOpen} 
            onCancel={handleViewCancel} 
            footer={null}
            style={{ width: "200px" }}
          >
            <div className='w-[447px] mx-auto'>
              <h2 className='py-8 text-3xl font-bold text-center'>Add Your Bank Card</h2>
              <ConfigProvider
                theme={{
                  components: {
                    Button: {
                      colorPrimary: '#EF9F27',
                      colorBgContainer: '#EF9F27',
                      colorText: '#FFFFFF',
                    },
                    Input: {
                      colorBorder: '#EF9F27',
                      colorBgContainer: '#F5F5F5',
                      hoverBorderColor: '#EF9F27',
                      activeBorderColor: '#FCA210',
                      activeShadow: '0 0 0 2px rgba(239, 159, 39, 0.2)',
                    },
                    Select: {
                      colorBorder: '#EF9F27',
                      colorBgContainer: '#F5F5F5',
                      hoverBorderColor: '#EF9F27',
                      activeBorderColor: '#FCA210',
                      activeShadow: '0 0 0 2px rgba(239, 159, 39, 0.2)',
                    },
                    DatePicker:{
                      colorBorder:"#EF9F27",
                      activeBorderColor: '#EF9F27',
                      hoverBorderColor: '#EF9F27',
                    },
                    Card: {
                      colorBgContainer: '#FFFFFF',
                      colorBorderSecondary: '#EF9F27',
                    },
                  },
                }}
              >
                <Form 
                  name="form_item_path" 
                  layout="vertical" 
                  onFinish={onFinish}
                  initialValues={{
                    name: {
                      Shop_Name: shopName,
                    },
                  }}
                >
                  <MyFormItemGroup prefix={['name']}>
                    <MyFormItem name="Shop_Name" label="Shop Name*">
                      <Input size="large" readOnly />
                    </MyFormItem>
                    <MyFormItem 
                      name="Card_Number" 
                      label="Card Number*" 
                      rules={[
                        { required: true, message: <span style={{ fontSize: "14px" }}>Please enter the bank card number!</span> },
                        { pattern: /^\d{16}$/, message: <span style={{ fontSize: "14px" }}>Card number must be 16 digits!</span> }
                      ]}
                    >
                      <Input size="large" maxLength={16} />
                    </MyFormItem>
                    <MyFormItem name="Card_Holder_Name" label="Card Holder Name*">
                      <Input size="large" />
                    </MyFormItem>
                  </MyFormItemGroup>
                  <MyFormItem name="Date" label="Date">
                    <DatePicker 
                      autoFocus={false}
                      className='custom-date-picker w-full py-2.5 border'
                      size="large" 
                      format="MM/DD" 
                    />
                  </MyFormItem>
                  <MyFormItem name="CVV" label="CVV"  rules={[
                        { required: true, message: <span style={{ fontSize: "14px" }}>Please enter the cvv Number!</span> },
                        { pattern: /^\d{3}$/, message: <span style={{ fontSize: "14px" }}>Card number must be 3 digits!</span> }
                      ]}>
                    <Input size="large" maxLength={3} />
                  </MyFormItem>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      type="text"
                      htmlType="submit"
                      style={{ backgroundColor: "#EF9F27", color: "white" }}
                      loading={isLoading}
                    >
                      Save Card
                    </Button>
                  </div>
                </Form>
              </ConfigProvider>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default React.memo(BankRow);