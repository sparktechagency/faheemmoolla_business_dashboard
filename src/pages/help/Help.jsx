import { ConfigProvider, Col, Row, Input, Button, Collapse, Form, message } from 'antd';
import { useCreateContactMutation } from '../../features/help/helpApi';
const { TextArea } = Input;

const inputStyle = { height: "50px" };

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const items = [
  {
    key: '1',
    label: 'General Support',
    children: <p>{text}</p>,
  },
  {
    key: '2',
    label: 'Payments and Transactions',
    children: <p>{text}</p>,
  },
  {
    key: '3',
    label: 'Orders',
    children: <p>{text}</p>,
  },
  {
    key: '4',
    label: 'Policies and Compliance',
    children: <p>{text}</p>,
  },
];

const Help = () => {
  const [form] = Form.useForm();
  const [createContact,{isLoading}] = useCreateContactMutation();

  const onFinish =async (values) => {
    const data = {
      name:"pronab kumar",
      firstName: values.firstName,
      lastName:values.lastName,
      email:values.email,
      phone:values.phone,
      message:values.message
    }

    try {
          const response = await createContact(data).unwrap();
          message.success(response?.message)
    } catch (error) {
          message.error("message not send some problem")
    }
    // message.success('Message sent successfully!');
    form.resetFields();
  };

  const onFinishFailed = (errorInfo) => {
    message.error('Failed:', errorInfo);
  };

  const onChange = (key) => {
    message.success(key);
  };

  return (
    <div className='w-full'>
      <div className="flex mt-20">
        <div className='basis-[70%]'>
          <div className='w-full max-w-[700px]'>
            <h2 className='text-4xl font-bold'>Get In Touch</h2>
            <p className='py-5 text-sm text-gray-600'>Likewise a range of activities enriches life, blending vigor with balance. The result is a lifestyle that`s not only dynamic but also deeply rewarding.</p>
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
                    colorBgContainer: '#FFFFFF',
                    hoverBorderColor: '#EF9F27',
                    activeBorderColor: '#FCA210',
                    activeShadow: '0 0 0 2px rgba(239, 159, 39, 0.2)',
                  }
                },
              }}
            >
              <Form
                form={form}
                name="help_form"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Row gutter={[16, 24]} className='py-1'>
                  <Col span={12} className="gutter-row">
                    <Form.Item
                      name="firstName"
                      rules={[{ required: true, message: 'Please input your first name!' }]}
                    >
                      <Input size="large" style={inputStyle} placeholder="First Name" />
                    </Form.Item>
                  </Col>
                  <Col span={12} className="gutter-row">
                    <Form.Item
                      name="lastName"
                      rules={[{ required: true, message: 'Please input your last name!' }]}
                    >
                      <Input size="large" style={inputStyle} placeholder="Last Name" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[16, 24]} className='py-1'>
                  <Col span={12} className="gutter-row">
                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email address!' }
                      ]}
                    >
                      <Input size="large" style={inputStyle} placeholder="Email" />
                    </Form.Item>
                  </Col>
                  <Col span={12} className="gutter-row">
                    <Form.Item
                      name="phone"
                      rules={[{ required: true, message: 'Please input your phone number!' }]}
                    >
                      <Input size="large" style={inputStyle} placeholder="Phone Number" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row className='py-1'>
                  <Col span={24}>
                    <Form.Item
                      name="message"
                      rules={[{ required: true, message: 'Please input your message!' }]}
                    >
                      <TextArea
                        showCount
                        maxLength={100}
                        placeholder="Your message"
                        style={{
                          height: 200,
                          resize: 'none',
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <div style={{ display: 'flex', justifyContent: 'center', padding: "0px 0px" }}>
                  <Button
                    loading={isLoading}
                    type="primary"
                    htmlType="submit"
                    style={{ backgroundColor: "#C68C4E", color: "white", width: "350px", height: "50px" }}
                    size='large'
                  >
                    Send message
                  </Button>
                </div>
              </Form>
            </ConfigProvider>
          </div>
        </div>

        <div className='basis-[30%]'>
          <div>
            <h2 className='py-3 text-2xl font-bold'>Common Questions</h2>
            <div>
              <Collapse items={items} defaultActiveKey={['1']} onChange={onChange} ghost style={{ fontWeight: "600" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;