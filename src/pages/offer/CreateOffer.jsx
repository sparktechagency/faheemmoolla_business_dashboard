import {
  Button,
  Col,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Spin,
  Upload,
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import CustomLoading from "../../components/CustomLoading";
import { useGetMealsByShopQuery } from "../../features/meal/mealApi";
import { useCreateOfferMutation } from "../../features/offer/offerApi";
import { useAllShopQuery } from "../../features/shop/shopApi";
dayjs.extend(customParseFormat);
const { TextArea } = Input;
const { Option } = Select;

const inputStyle = {
  width: "100%",
  height: "44px",
  background: "transparent",
  border: "1px solid #C68C4E",
  fontSize: "14px",
};

const selectStyle = {
  width: "100%",
  height: "44px",
  border: "1px solid #C68C4E",
  background: "transparent",
  borderRadius: "10px",
  fontSize: "12px",
};

const theme = {
  token: {
    fontSize: 20,
    lineHight: 20,
    colorBgContainer: "transparent",
    colorBorder: "none",
  },
  components: {
    Select: {
      activeBorderColor: "none",
      activeOutlineColor: "none",
      optionFontSize: "14px",
    },
  },
};

const CreateOffer = () => {
  const navigate = useNavigate();
  const [mealLogoFileList, setMealLogoFileList] = useState([]);
  const [shop, setShop] = useState({});
  const [items, setItems] = useState({});
  const [form] = Form.useForm();
  const [category, setCategory] = useState(null);

  const {
    data: allShop,
    error: queryError,
    isLoading: queryLoading,
  } = useAllShopQuery();
  const {
    data: meals,
    error,
    isLoading: mealsLoading,
  } = useGetMealsByShopQuery(shop?.shopId);
  const [createOffer, { isLoading }] = useCreateOfferMutation();

  if (queryLoading || mealsLoading) {
    return <CustomLoading/>;
  }

  if (queryError) {
    return <div>Error: {queryError.message}</div>;
  }

  const handleOfferImage = (info) => {
    setMealLogoFileList(info.fileList);
  };

  const handleChangeShopSelect = (value, option) => {
    const find = allShop?.data?.shops?.find((shop) => shop?._id === value);

    setShop((prevShop) => ({
      ...prevShop,
      shopName: find?.shopName,
      shopId: option?.id,
    }));
  };

  const handleChangeitems = (value, option) => {
    setItems((prevShop) => ({
      ...prevShop,
      itemName: value,
      itemId: option?.id,
    }));

    const find = meals.data.find((meal) => meal.name === value);
    setCategory(find);
  };

  const onFinish = async (values) => {
    const startedDate = dayjs(
      `${values?.startDate.$y}-${values?.startDate.$M + 1}-${
        values?.startDate.$D
      }`
    ).format("YYYY-MM-DD");
    const endDate = dayjs(
      `${values?.endDate.$y}-${values?.endDate.$M + 1}-${values?.endDate.$D}`
    ).format("YYYY-MM-DD");

    const data = {
      shopId: shop?.shopId,
      itemId: items.itemId,
      shopName: shop?.shopName,
      itemName: items.itemName,
      shopCategory: category?.category,
      offerTitle: values?.offerTitle,
      discountPrice: parseFloat(values?.discount),
      stateDate: startedDate,
      endDate: endDate,
      description: values?.description,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    if (mealLogoFileList.length > 0) {
      formData.append("image", mealLogoFileList[0].originFileObj);
    }

    try {
      const response = await createOffer(formData).unwrap();
      if (response.success === true) {
        message.success("Offer created successfully!");
        navigate("/offer");
        window.location.reload();
      }
    } catch (error) {
      console.error("Creating offer failed:", error);
      message.error("Creating offer failed. Please try again.");
    }
  };

  return (
    <div className="w-full">
      <div className="mt-16">
        <div>
          <div
            onClick={() => navigate("/offer")}
            className="flex items-end w-48 gap-3 pb-8 text-xl font-semibold cursor-pointer"
          >
            <IoIosArrowBack className="font-semibold" />
            <span>Create Offer</span>
          </div>
          <ConfigProvider theme={theme}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Row gutter={[40, 2]}>
                <Col span={8}>
                  <Form.Item
                    label="Shop Name*"
                    name="shopName"
                    className="custom-label"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: "14px" }}>
                            Please enter your Shop Name
                          </span>
                        ),
                      },
                    ]}
                  >
                    <Select
                      onChange={handleChangeShopSelect}
                      placeholder="Select Your Shop"
                      style={selectStyle}
                    >
                      {allShop?.data?.shops?.map((shop, index) => (
                        <Option
                          key={index}
                          id={shop._id}
                          value={`${shop?._id}`}
                        >
                          {shop?.shopName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Item Name*"
                    name="itemName"
                    className="custom-label"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: "14px" }}>
                            Please enter your Items Name
                          </span>
                        ),
                      },
                    ]}
                  >
                    <Select
                      onChange={handleChangeitems}
                      placeholder="Select Your Item"
                      style={selectStyle}
                    >
                      {meals?.data.map((mealItems, index) => (
                        <Option
                          key={index}
                          id={mealItems._id}
                          value={mealItems?.name}
                        >
                          {mealItems?.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Category*"
                    name="addCategory"
                    className="custom-label"
                  >
                    <Input
                      type="text"
                      readOnly
                      placeholder={category?.category}
                      style={inputStyle}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Upload Offer Picture*"
                    name="offerPicture"
                    className="custom-label"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: "14px" }}>
                            Please enter your picture!
                          </span>
                        ),
                      },
                    ]}
                  >
                    <Space style={selectStyle}>
                      <Upload
                        fileList={mealLogoFileList}
                        onChange={handleOfferImage}
                        beforeUpload={() => false}
                        maxCount={1}
                        showUploadList={false}
                        className="ms-2"
                      >
                        <Button style={{ fontSize: "14px" }}>
                          Choose File
                        </Button>
                      </Upload>
                      {mealLogoFileList.length > 0 && (
                        <span>{mealLogoFileList[0].name}</span>
                      )}
                    </Space>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Offer Title*"
                    name="offerTitle"
                    className="custom-label"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: "14px" }}>
                            Please enter your Offer title !
                          </span>
                        ),
                      },
                    ]}
                  >
                    <Input placeholder="Enter Offer Title" style={inputStyle} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Offer Type*"
                    name="offerType"
                    className="custom-label"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: "14px" }}>
                            Please enter offer type!
                          </span>
                        ),
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      placeholder="Input Offer type"
                      style={inputStyle}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Discount Price*"
                    name="discount"
                    className="custom-label"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: "14px" }}>
                            Please enter your Discount price!
                          </span>
                        ),
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter Discount Price"
                      style={inputStyle}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Start Date"
                    name="startDate"
                    className="custom-label"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: "14px" }}>
                            Please enter startDate
                          </span>
                        ),
                      },
                    ]}
                  >
                    <DatePicker
                      placeholder="Select Start Date"
                      style={inputStyle}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="End Date"
                    name="endDate"
                    className="custom-label"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: "14px" }}>
                            Please enter endDate!
                          </span>
                        ),
                      },
                    ]}
                  >
                    <DatePicker
                      placeholder="Select End Date"
                      style={inputStyle}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}></Col>
                <Col span={24}>
                  <Form.Item
                    label="Description*"
                    name="description"
                    className="custom-label"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: "14px" }}>Description</span>
                        ),
                      },
                    ]}
                  >
                    <TextArea
                      placeholder="Write Offer Description"
                      rows={12}
                      style={{ ...inputStyle, minHeight: "151px" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => navigate("/offer")}
                  type="text"
                  htmlType="submit"
                  style={{
                    minWidth: "200px",
                    height: "40px",
                    border: "1px solid red",
                  }}
                >
                  Cancel Offer
                </Button>
                <Button
                  onClick={() => form.submit()}
                  loading={isLoading}
                  type="text"
                  style={{
                    minWidth: "200px",
                    height: "40px",
                    background: "#C68C4E",
                    color: "white",
                  }}
                >
                  Publish Offer
                </Button>
              </div>
            </Form>
          </ConfigProvider>
        </div>
      </div>
    </div>
  );
};

export default CreateOffer;
