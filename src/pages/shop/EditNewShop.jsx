import { Button, Col, ConfigProvider, Form, Input, Row, Space, TimePicker, Upload, message } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import CustomLoading from "../../components/CustomLoading";
import ShopLocationAutocomplete from "../../components/ShopLocationAutocomplete";
import {
  useGetShopByIdQuery,
  useUpdateMutation,
} from "../../features/shop/shopApi";
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

const EditNewShop = () => {
  const navigate = useNavigate();
  const { shopId } = useParams();
  const [form] = Form.useForm();

  const { data: shop, error, isLoading: loading } = useGetShopByIdQuery(shopId);

  const [shopLogoFileList, setShopLogoFileList] = useState([]);
  const [shopBannerFileList, setShopBannerFileList] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [locationName, setLocationName] = useState('');

  const {
    coordinates: geoCoordinates,
    error: locationError,
    getLocation,
    loading: locationLoading,
  } = useGeoLocation();

  const handleShopLogoChange = (info) => {
    setShopLogoFileList(info.fileList);
  };

  const handleShopBannerChange = (info) => {
    setShopBannerFileList(info.fileList);
  };

  const handleLocationSelect = (locationData) => {
    setCoordinates(locationData.coordinates);
    setLocationName(locationData.address);
  };

  const handleLocationChange = (e) => {
    console.log(e);
    setLocationName(e.target.value);
  };

  const [update, { isLoading }] = useUpdateMutation();

  const onFinish = async (values) => {
    console.log("values", values);

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

    const shopData = {
      shopName: values.shopName,
      shopOwnerName: values?.shopOwnerName,
      shopLicence: values?.shopLicence,
      shopLocationName: locationName,
      shopLocation: {
        type: "Point",
        coordinates: coordinates.length > 0 ? coordinates : (shop?.data?.shopLocation?.coordinates || [0, 0]),
      },
      shopOpenTime: openTime,
      shopAddress: locationName,
      shopCloseTime: closeTime,
      minOrderPrice: parseFloat(values.minOrderPrice),
      minOrderOfferPrice: parseFloat(values.minOrderOfferPrice),
      shopDescription: values.shopDescription,
    };

    console.log("shopdata", shopData);

    const logoFile = shopLogoFileList[0];
    const bannerFile = shopBannerFileList[0];

    const formData = new FormData();
    formData.append("data", JSON.stringify(shopData));

    // Handle logo file - only append if new file is selected
    if (logoFile) {
      formData.append("logo", logoFile.originFileObj);
    }

    // Handle banner file - only append if new file is selected
    if (bannerFile) {
      formData.append("banner", bannerFile.originFileObj);
    }

    try {
      const response = await update({ shopId, data: formData }).unwrap();
      console.log(response);

      if (response.success === true) {
        navigate("/shop-management");
        window.location.reload();
      }
    } catch (error) {
      console.error("Updating shop failed:", error);
      console.error("Full error response:", error.data);
      error?.data?.errorMessages?.map((text) => message.error(text.message));
      message.error("Updating shop failed. Please try again.");
    }
  };

  useEffect(() => {
    if (shop) {
      const shopData = shop.data;

      // Set coordinates and location name from existing shop data
      if (shopData.shopLocation && shopData.shopLocation.coordinates) {
        setCoordinates(shopData.shopLocation.coordinates);
      }

      if (shopData.shopAddress) {
        setLocationName(shopData.shopAddress);
      }

      const defaultExpireDate = dayjs().add(1, "year");
      form.setFieldsValue({
        shopName: shopData?.shopName,
        shopOwnerName: shopData?.shopOwnerName,
        shopLicence: shopData?.shopLicence,
        shopLocationName: shopData?.shopAddress,
        shopOpenTime: shopData?.shopOpenTime
          ? dayjs(shopData.shopOpenTime, "HH:mm")
          : null,
        shopCloseTime: shopData?.shopCloseTime
          ? dayjs(shopData.shopCloseTime, "HH:mm")
          : null,
        minOrderPrice: shopData?.minOrderPrice,
        cardNumber: shopData?.bankCard?.cardNumber,
        cardHolderName: shopData?.bankCard?.cardHolderName,
        minOrderOfferPrice: shopData?.minOrderOfferPrice,
        cvv: shopData?.bankCard?.cvv,
        logo: shopData?.logo,
        banner: shopData?.banner,
        expireDate: defaultExpireDate,
        shopDescription: shopData?.shopDescription,
      });
    }
  }, [shop, form]);

  const handleBeforeUpload = (file) => {
    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedFormats.includes(file.type)) {
      message.error("Invalid image format. Allowed: jpg, jpeg, png, webp");
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  if (loading) return <CustomLoading />;
  if (error) return <p>Error fetching shop details.</p>;

  return (
    <div className="w-full">
      <div className="mt-16">
        <div>
          <div
            onClick={() => navigate("/shop-management")}
            className="flex items-end w-48 gap-3 pb-8 text-xl font-semibold cursor-pointer"
          >
            <IoIosArrowBack className="font-semibold" />
            <span>Edit Shop</span>
          </div>
          <ConfigProvider theme={theme}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
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
                    <ShopLocationAutocomplete
                      onSelect={handleLocationSelect}
                      value={locationName}
                      onChange={handleLocationChange}
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
                            Please enter your shop close time!
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
                      onCalendarChange={() => document.activeElement?.blur()}
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
                            Please enter min order price
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
                            Please enter min order offer price
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
                      {shopLogoFileList.length > 0 ? (
                        <span>{shopLogoFileList[0].name}</span>
                      ) : (
                        <span style={{ fontSize: "12px", color: "#666" }}>
                          {shop?.data?.logo ? "Current logo will be kept" : "No logo selected"}
                        </span>
                      )}
                    </Space>
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Shop Banner*"
                    className="custom-label"
                    name="banner"
                  >
                    <Space style={inputStyle}>
                      <Upload
                        fileList={shopBannerFileList}
                        onChange={handleShopBannerChange}
                        beforeUpload={handleBeforeUpload}
                        maxCount={1}
                        showUploadList={false}
                        className="ms-2"
                      >
                        <Button style={{ fontSize: "14px" }}>
                          Choose File
                        </Button>
                      </Upload>
                      {shopBannerFileList.length > 0 ? (
                        <span>{shopBannerFileList[0].name}</span>
                      ) : (
                        <span style={{ fontSize: "12px", color: "#666" }}>
                          {shop?.data?.banner ? "Current banner will be kept" : "No banner selected"}
                        </span>
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
                  Update Shop
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

export default EditNewShop;