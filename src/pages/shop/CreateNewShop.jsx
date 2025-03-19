import {
  Button,
  Col,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Space,
  TimePicker,
  Upload,
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setShopId } from "../../features/ids/idSlice";
import { useCreateMutation } from "../../features/shop/shopApi";
import useGeoLocation from "../../hooks/useGeoLocation";
dayjs.extend(customParseFormat);
const { TextArea } = Input;

const inputStyle = {
  width: "100%",
  height: "44px",
  background: "transparent",
  border: "1px solid #C68C4E",
  fontSize: "14px",
  borderRadius: "12px",
};

const disabledDate = (current) => {
  return current && current < dayjs().endOf("day");
};

const theme = {
  token: {
    fontSize: 20,
    lineHight: 20,
  },
};

const CreateSingleShop = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [shopLogoFileList, setShopLogoFileList] = useState([]);
  const [shopBannerFileList, setShopBannerFileList] = useState([]);
  const [create, { isLoading, isError }] = useCreateMutation();

  const {
    coordinates,
    error: locationError,
    getLocation,
    loading: locationLoading,
  } = useGeoLocation();

  // console.log(coordinates);

  const handleShopLogoChange = (info) => {
    setShopLogoFileList(info.fileList);
  };

  const handleShopBannerChange = (info) => {
    setShopBannerFileList(info.fileList);
  };

  const logoFile = shopLogoFileList[0];
  const bannerFile = shopBannerFileList[0];

  const onFinish = async (values) => {
    console.log(values);
    const closetimehour = values.shopCloseTime?.hour() || "00";
    const closeTimeMinute = values.shopCloseTime?.minute() || "00";
    const opentimehour = values.shopOpenTime?.hour() || "00";
    const openTimeMinute = values.shopOpenTime?.minute() || "00";

    const closeTime = `${closetimehour
      .toString()
      .padStart(2, "0")}:${closeTimeMinute.toString().padStart(2, "0")}`;
    const openTime = `${opentimehour
      .toString()
      .padStart(2, "0")}:${openTimeMinute.toString().padStart(2, "0")}`;

    const formData = new FormData();

    const shopData = {
      shopName: values.shopName,
      shopOwnerName: values?.shopOwnerName,
      shopLicence: values?.shopLicence,
      shopLocationName: values?.shopLocationName,
      shopLocation: {
        coordinates: [
          parseFloat(values?.latitude),
          parseFloat(values?.longitude),
        ],
      },
      shopOpenTime: openTime,
      shopAddress: values?.shopLocationName,
      shopCloseTime: closeTime,
      minOrderPrice: parseFloat(values.minOrderPrice),
      minOrderOfferPrice: parseFloat(values?.minOrderOfferPrice),
      shopDescription: values.shopDescription,
    };

    formData.append("data", JSON.stringify(shopData));
    formData.append("logo", logoFile.originFileObj);
    formData.append("banner", bannerFile.originFileObj);

    try {
      const response = await create(formData).unwrap();
      dispatch(setShopId(response?.data?.userId));
      
      localStorage.setItem("shopId" , response.data._id)

      if (response.success === true) {
        navigate("/shop-management");
        window.location.reload();
      }
    } catch (error) {
      error?.data?.errorMessages?.map((text) => message.error(text.message));
      console.log(error);
    }
  };

  const handleBeforeUpload = (file) => {
    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedFormats.includes(file.type)) {
      message.error("Invalid image format. Allowed: jpg, jpeg, png, webp");
      return Upload.LIST_IGNORE; // Prevents file from being added
    }
    return false; // Prevent automatic upload
  };

  return (
    <div className="w-full">
      <div className="mt-16">
        <div>
          <div
            onClick={() => navigate("/shop-management")}
            className="flex items-end w-48 gap-3 pb-8 text-xl font-semibold cursor-pointer"
          >
            <IoIosArrowBack className="font-semibold" />
            <span>Add New Shop</span>
          </div>
          <ConfigProvider theme={theme}>
            <Form layout="vertical" onFinish={onFinish}>
              <Row gutter={[40, 2]}>
                <Col span={8}>
                  <Form.Item
                    label="Shop Name"
                    className="custom-label"
                    name="shopName"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: "14px" }}>
                            Please enter your shop name!
                          </span>
                        ),
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter your shop name"
                      style={inputStyle}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Shop Owner Name"
                    className="custom-label"
                    name="shopOwnerName"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: "14px" }}>
                            {" "}
                            Please enter the owner name
                          </span>
                        ),
                      },
                    ]}
                  >
                    <Input placeholder="Enter Owner name" style={inputStyle} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Shop Licence"
                    className="custom-label"
                    name="shopLicence"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: "14px" }}>
                            Please enter the shop licence!
                          </span>
                        ),
                      },
                    ]}
                  >
                    <Input placeholder="Shop Licence" style={inputStyle} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Shop Location"
                    className="custom-label"
                    name="shopLocationName"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: "14px" }}>
                            Please enter your shop location!
                          </span>
                        ),
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter your shop location"
                      style={inputStyle}
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="longitude"
                    className="custom-label"
                    name="longitude"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: "14px" }}>
                            Please enter your longitude
                          </span>
                        ),
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      placeholder="Enter your longitude"
                      style={inputStyle}
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Latitude"
                    className="custom-label"
                    name="latitude"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: "14px" }}>
                            Please enter your Latitude
                          </span>
                        ),
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      placeholder="Enter your Latitude"
                      style={inputStyle}
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Shop Open Time"
                    className="custom-label"
                    name="shopOpenTime"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: "14px", color: "#ff4d4f" }}>
                            Please enter your shop open time!
                          </span>
                        ),
                      },
                    ]}
                  >
                    <TimePicker
                      format="HH:mm"
                      size="large"
                      className="text-[20px] py-[11px]"
                      style={inputStyle}
                      popupClassName="custom-timepicker-popup"
                      hideDisabledOptions
                      onSelect={() => document.activeElement?.blur()}
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Shop Close Time"
                    className="custom-label"
                    name="shopCloseTime"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: "14px", color: "#ff4d4f" }}>
                            Please enter your shop open time!
                          </span>
                        ),
                      },
                    ]}
                  >
                    <TimePicker
                      format="HH:mm"
                      size="large"
                      style={inputStyle}
                      className="text-[20px] py-[11px]"
                      popupClassName="custom-timepicker-popup"
                      hideDisabledOptions
                      onSelect={() => document.activeElement?.blur()} // Closes popup after selecting hour & minute
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Min Order Price"
                    className="custom-label"
                    name="minOrderPrice"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: "14px" }}>
                            Please min order price
                          </span>
                        ),
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      placeholder="Min Order Price"
                      style={inputStyle}
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Min Order Offer Price"
                    className="custom-label"
                    name="minOrderOfferPrice"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: "14px" }}>
                            please min order offer price
                          </span>
                        ),
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      placeholder="Min Order Offer Price"
                      style={inputStyle}
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Shop Logo*"
                    className="custom-label"
                    name="logo"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: "14px" }}>
                            Please upload a shop logo!
                          </span>
                        ),
                      },
                    ]}
                  >
                    <Space style={inputStyle}>
                      <Upload
                        fileList={shopLogoFileList}
                        onChange={handleShopLogoChange}
                        beforeUpload={handleBeforeUpload}
                        maxCount={1}
                        showUploadList={false}
                        className="ms-2"
                      >
                        <Button style={{ fontSize: "14px" }}>
                          Choose File
                        </Button>
                      </Upload>
                      {shopLogoFileList.length > 0 && (
                        <span>{shopLogoFileList[0].name}</span>
                      )}
                    </Space>
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Shop Banner*"
                    className="custom-label"
                    name="banner"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: "14px" }}>
                            Please upload a shop banner!
                          </span>
                        ),
                      },
                    ]}
                  >
                    <Space style={inputStyle}>
                      <Upload
                        fileList={shopBannerFileList}
                        onChange={handleShopBannerChange}
                        beforeUpload={handleBeforeUpload} // Prevent automatic upload
                        maxCount={1}
                        showUploadList={false} // Hide the default file list
                        className="ms-2"
                      >
                        <Button style={{ fontSize: "14px" }}>
                          Choose File
                        </Button>
                      </Upload>
                      {shopBannerFileList.length > 0 && (
                        <span>{shopBannerFileList[0].name}</span>
                      )}
                    </Space>
                  </Form.Item>
                </Col>

                <Col span={16}>
                  <Form.Item
                    label="Description*"
                    className="custom-label"
                    name="shopDescription"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: "14px" }}>
                            Please enter a description!
                          </span>
                        ),
                      },
                    ]}
                  >
                    <TextArea
                      rows={12}
                      style={{ ...inputStyle, minHeight: "151px" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <div className="flex justify-end">
                <Button
                  loading={isLoading}
                  type="text"
                  htmlType="submit"
                  style={{
                    width: "300px",
                    height: "40px",
                    background: "#B47000",
                    color: "white",
                  }}
                >
                  Save New Shop
                </Button>
              </div>
            </Form>
          </ConfigProvider>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default CreateSingleShop;
