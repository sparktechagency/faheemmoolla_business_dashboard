import { Form, Input, Row, Col, message, TimePicker, Spin } from "antd";
import { ConfigProvider, Button, Upload, Space, Select } from "antd";
import { IoIosArrowBack } from "react-icons/io";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImgCrop from "antd-img-crop";
import {
  useCreateMealMutation,
  useGetCategoriesQuery,
} from "../../features/meal/mealApi";
import { useAllShopQuery } from "../../features/shop/shopApi";
import { MdTune } from "react-icons/md";
dayjs.extend(customParseFormat);
const { TextArea } = Input;
const { Option } = Select;

const inputStyle = {
  width: "100%",
  height: "44px",
  background: "transparent",
  border: "1px solid #C68C4E",
  fontSize: "14px",
  borderRadius: "12px",
};

const selectStyle = {
  width: "100%",
  height: "44px",
  border: "1px solid #C68C4E",
  borderRadius: "10px",
  fontSize: "14px",
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

const dropdown = {
  components: {
    Select: {
      activeOutlineColor: "none",
      activeBorderColor: "none",
      hoverBorderColor: "none",
    },
  },
};

const CreateSingleMeal = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [mealLogoFileList, setMealLogoFileList] = useState([]);
  const [createMeal, { isLoading }] = useCreateMealMutation();
  const {
    data: categories,
    isLoading: loading,
    error,
  } = useGetCategoriesQuery();

  const [shopId, setShopId] = useState(localStorage.getItem("shopId") || null);

  const {
    data: allShop,
    isLoading: shopLoading,
    error: shopError,
    refetch,
  } = useAllShopQuery();

  useEffect(() => {
    if (allShop?.data?.shops?.length === 0) {
      localStorage.removeItem("shopId");
      setShopId(null);
    }
  }, [allShop?.data?.shops?.length]);

  useEffect(() => {
    if (!shopId && allShop?.data?.shops?.length > 0) {
      const firstShopId = allShop.data.shops[0]._id;
      setShopId(firstShopId);
      localStorage.setItem("shopId", firstShopId);
    }
  }, [allShop?.data?.shops, shopId]);

  const handleShopChange = (value) => {
    setShopId(value);
    localStorage.setItem("shopId", value);
    refetch();
  };

  const handleMealLogoChange = ({ fileList }) => {
    setMealLogoFileList(fileList.slice(-1)); // Limit to one file
  };

  const [fileList, setFileList] = useState([]);

  // Update form fields when fileList changes
  useEffect(() => {
    if (fileList.length > 0) {
      form.setFieldsValue({ image: fileList });
    }
  }, [fileList, form]);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const onFinish = async (values) => {
    // console.log(values?.collectionTime);
    const openTime = values.collectionTime[0];
    const closeTime = values.collectionTime[1];
  
    const open = `${openTime.$H < 10 ? "0" : ""}${openTime.$H}:${
      openTime.$m < 10 ? "0" : ""
    }${openTime.$m}`;
    const close = `${closeTime.$H < 10 ? "0" : ""}${closeTime.$H}:${
      closeTime.$m < 10 ? "0" : ""
    }${closeTime.$m}`;
    const time = `${open} to ${close}`;

    
  
    const mealData = {
      shopId: localStorage.getItem("shopId"),
      name: values.name,
      price: parseFloat(values.price),
      offerPrice: values.offerPrice
        ? parseFloat(values.offerPrice)
        : parseFloat(values.price),
      category: values.category,
      collectionTime: time,
      dietaryPreference: values?.dietaryPreference,
      description: values.description,
    };
  
    const formData = new FormData();
    formData.append("data", JSON.stringify(mealData));
  
    // Ensure only one image is appended
    if (fileList.length > 0) {
      formData.append("image", fileList[0]?.originFileObj);
    }
    try {
      const response = await createMeal(formData).unwrap();
      message.success("Meal created successfully!");
      navigate("/meal-management");
    } catch (error) {
      message.error(error.data.message || "Failed to create meal");
      console.error("Full error response:", error.data);
    }
  };

  return (
    <div className="w-full mt-16">
      <div className="">
        <div>
          <div
            onClick={() => navigate("/meal-management")}
            className="flex items-center w-48 gap-2 pb-8 text-xl font-semibold cursor-pointer"
          >
            <IoIosArrowBack className="font-semibold" />
            <span>Add New Meal</span>
          </div>
          <ConfigProvider theme={theme}>
            <Form layout="vertical" form={form} onFinish={onFinish}>
              <Row gutter={[40, 2]}>
                <Col span={8}>
                  <Form.Item
                    label="Meal Name*"
                    className="custom-label"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: "14px" }}>
                            Please enter your meal name!
                          </span>
                        ),
                      },
                    ]}
                    name="name"
                  >
                    <Input
                      placeholder="Enter your meal name"
                      style={inputStyle}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Meal Price*"
                    className="custom-label"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: "14px" }}>
                            Please enter your shop price!
                          </span>
                        ),
                      },
                    ]}
                    name="price"
                  >
                    <Input
                      type="number"
                      placeholder="Enter Meal Price"
                      style={inputStyle}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Offer Price"
                    className="custom-label"
                    name="offerPrice"
                  >
                    <Input
                      type="number"
                      placeholder="Meal Offer Meal Price"
                      style={inputStyle}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Add Category*"
                    className="custom-label"
                    name="category"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: "14px" }}>
                            Please enter your Category!
                          </span>
                        ),
                      },
                    ]}
                  >
                    <Select
                      disabled={loading}
                      placeholder="Select a category"
                      style={selectStyle}
                    >
                      {categories?.data?.map((category, index) => (
                        <Option key={index} value={category?.name}>
                          {category?.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Collection time"
                    className="custom-label"
                    name="collectionTime"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: "14px", color: "#ff4d4f" }}>
                            Collection Time is required
                          </span>
                        ),
                      },
                    ]}
                  >
                    <TimePicker.RangePicker
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
                    label="Dietary Preference"
                    className="custom-label"
                    name="dietaryPreference"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: "14px" }}>
                            Please enter your Dietary Preference!
                          </span>
                        ),
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select Dietary Preference"
                      style={selectStyle}
                    >
                      <Option value="vegan">Vegan</Option>
                      <Option value="vegetarian">Vegetarian</Option>
                      <Option value="halal">Halal</Option>
                      <Option value="kosher">Kosher</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    label="Image*"
                    className="custom-label"
                    name="image"
                    rules={[
                      {
                        validator: (_, value) => {
                          if (fileList.length > 0) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            <span style={{ fontSize: "14px" }}>
                              Please Select your Images
                            </span>
                          );
                        },
                      },
                    ]}
                  >
                    <ImgCrop rotationSlider>
                      <Upload
                        style={selectStyle}
                        className="custom-upload"
                        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                        listType="picture-card"
                        multiple={false}
                        maxCount={1}
                        fileList={fileList}
                        onChange={onChange}
                        onPreview={onPreview}
                      >
                        {fileList.length < 5 && "+ Upload"}
                      </Upload>
                    </ImgCrop>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Description*"
                    className="custom-label"
                    name="description"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: "14px" }}>
                            Please enter Description
                          </span>
                        ),
                      },
                    ]}
                  >
                    <TextArea
                      placeholder="Write Meal Description"
                      rows={12}
                      style={{ ...inputStyle, minHeight: "120px" }}
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
                    background: "#C68C4E",
                    color: "white",
                  }}
                >
                  Save New Meal
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

export default CreateSingleMeal;
