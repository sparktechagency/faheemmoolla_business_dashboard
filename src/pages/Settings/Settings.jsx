import { useState } from 'react';
import { Input, Button, Form, ConfigProvider, message } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useChangePasswordMutation } from '../../features/settings/settingApi';

const theme = {
  components: {
    token: {
      borderColor: '#C68C4E',
    },
    Input: {
      hoverBorderColor: '#EF9F27',
      activeBorderColor: '#EF9F27',
      inputFontSizeLG: 16,
    },
  },
};

const Setting = () => {
  const [form] = Form.useForm(); 
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [reenterPasswordVisible, setReenterPasswordVisible] = useState(false);
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const toggleCurrentPasswordVisibility = () => {
    setCurrentPasswordVisible(!currentPasswordVisible);
  };

  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible(!newPasswordVisible);
  };

  const toggleReenterPasswordVisibility = () => {
    setReenterPasswordVisible(!reenterPasswordVisible);
  };

  const handleSave = async (value) => {
    try {
      const response = await changePassword(value).unwrap();
      message.success(response?.message); 
    } catch (error) {
      message.error(error?.message);
    }
    form.resetFields();
  };

  return (
    <ConfigProvider theme={theme}>
      <div className='w-full max-w-[800px] mt-40 border border-primary p-6 rounded-xl'>
        <Form 
          form={form} // ✅ Connect the form instance
          onFinish={handleSave} 
          layout="vertical"
        >
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[{ required: true, message: 'Please enter your current password!' }]}
          >
            <Input
              type={currentPasswordVisible ? 'text' : 'password'}
              size='large'
              placeholder="Enter your current password"
              style={{ background: 'transparent', borderColor: '#C68C4E' }}
              suffix={
                <span onClick={toggleCurrentPasswordVisibility} style={{ cursor: 'pointer' }}>
                  {currentPasswordVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </span>
              }
            />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[{ required: true, message: 'Please enter your new password!' }]}
          >
            <Input
              type={newPasswordVisible ? 'text' : 'password'}
              size='large'
              placeholder="Enter your new password"
              style={{ background: 'transparent', borderColor: '#C68C4E' }}
              suffix={
                <span onClick={toggleNewPasswordVisibility} style={{ cursor: 'pointer' }}>
                  {newPasswordVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </span>
              }
            />
          </Form.Item>

          <Form.Item
            label="Re-enter New Password"
            name="confirmPassword"
            rules={[{ required: true, message: 'Please re-enter your new password!' }]}
          >
            <Input
              type={reenterPasswordVisible ? 'text' : 'password'}
              size='large'
              placeholder="Re-enter your new password"
              style={{ background: 'transparent', borderColor: '#C68C4E' }}
              suffix={
                <span onClick={toggleReenterPasswordVisibility} style={{ cursor: 'pointer' }}>
                  {reenterPasswordVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </span>
              }
            />
          </Form.Item>

          <Form.Item>
            <Button
              loading={isLoading}
              type="primary"
              size='large'
              htmlType="submit"
              block
              style={{ backgroundColor: '#C68C4E', borderColor: '#C68C4E' }}
            >
              Save Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    </ConfigProvider>
  );
};

export default Setting;
