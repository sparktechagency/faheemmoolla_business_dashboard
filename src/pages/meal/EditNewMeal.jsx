import { Form, Input, Row, Col, message, TimePicker, Spin } from "antd";
import { ConfigProvider, Button, Upload, Space, Select } from "antd";
import { IoIosArrowBack } from "react-icons/io";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetCategoriesQuery,
  useGetMealsByShopQuery,
  useUpdateMealMutation,
} from "../../features/meal/mealApi";
import { useSelector } from "react-redux";
import CustomLoading from "../../components/CustomLoading";
import ImgCrop from "antd-img-crop";
import { baseURL } from "../../utils/BaseURL";

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
  background: "transparent",
  borderRadius: "10px",
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

const CreateSingleMeal = () => {
  const navigate = useNavigate();
  const { mealId } = useParams();
  const [mealLogoFileList, setMealLogoFileList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  const [updateMeal, { isLoading }] = useUpdateMealMutation();
  const { data: meals, isLoading: getLoading } = useGetMealsByShopQuery(
    localStorage.getItem("shopId")
  );
  const {
    data: categories,
    isLoading: loading,
    error,
  } = useGetCategoriesQuery();

  const filter = meals?.data?.find((items) => items?._id === mealId);
  console.log(filter.collectionTime); // 22:02 to 23:02

  useEffect(() => {
    if (filter) {
      const [startTime, endTime] = filter.collectionTime.split(" to ");
      form.setFieldsValue({
        name: filter?.name,
        price: filter?.price,
        offerPrice: filter?.offerPrice,
        category: filter?.category,
        collectionTime: [
          dayjs(startTime, "HH:mm"),
          dayjs(endTime, "HH:mm"),
        ],
        image: filter?.image,
        dietaryPreference: filter?.dietaryPreference,
        description: filter?.description,
      });

      if (filter?.description) {
        setFileList([
          {
            uid: "-1", // Unique ID for Ant Design
            name: "image.png", // Default name (could be dynamic)
            status: "done", // Marks the file as uploaded
            url: `${baseURL}${filter?.image}`, // Existing image URL
          },
        ]);
      }
    }
  }, [filter, form]);

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
    const startTime = values.collectionTime[0].format("HH:mm");
    const endTime = values.collectionTime[1].format("HH:mm");
    const collectionTime = `${startTime} to ${endTime}`;

    const mealData = {
      shopId: localStorage.getItem("shopId"),
      name: values.name,
      price: parseFloat(values.price),
      offerPrice: parseFloat(values.offerPrice),
      category: values.category,
      collectionTime: collectionTime,
      dietaryPreference: values.dietaryPreference,
      description: values.description,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(mealData));

    if (fileList.length > 0) {
      formData.append("image", fileList[0]?.originFileObj);
    }

    try {
      const response = await updateMeal({
        id: mealId,
        data: formData,
      }).unwrap();
      message.success("Meal updated successfully!");
      navigate("/meal-management");
    } catch (error) {
      console.error("Updating meal failed:", error);
      message.error("Meal update failed. Please try again.");
    }
  };

  if (getLoading) {
    return <CustomLoading />;
  }

  return (
    <div className="w-full">
      <div className="mt-16">
        <div>
          <div
            onClick={() => navigate("/meal-management")}
            className="flex items-center w-48 gap-2 pb-8 text-xl font-semibold cursor-pointer"
          >
            <IoIosArrowBack className="font-semibold" />
            <span>Edit Meal</span>
          </div>
          <ConfigProvider theme={theme}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
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
                      {categories?.data.length === 0 ? (
                        <Option value={"pasta"}>{"Pasta"}</Option>
                      ) : (
                        categories?.data?.map((category, index) => (
                          <Option key={index} value={category?.name}>
                            {category?.name || "Pasta"}
                          </Option>
                        ))
                      )}
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
                    label="Select Multiple Image*"
                    className="custom-label"
                    name="image"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: "14px" }}>
                            Please Select your Images
                          </span>
                        ),
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
      </div>
    </div>
  );
};

export default CreateSingleMeal;