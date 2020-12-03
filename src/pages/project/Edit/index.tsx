import React, { useState } from 'react';
import { Form, Input, Tooltip, Row, Col, Button, Card } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 10,
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    span: 12,
    offset: 4,
  },
};

const RegistrationForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  const [] = useState([]);

  const debounceUpdateBasicCost = () => {
    form.validateFields();
  };

  return (
    <Card
      title="Default size card"
      extra={<a href="#">More</a>}
      style={{ width: '100%' }}
    >
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item
          name="name"
          label="项目名称"
          rules={[
            {
              required: true,
              message: '项目名称必填!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="project_number" label="项目编号">
          <Input />
        </Form.Item>
        <Form.Item name="description" label="项目描述">
          <Input.TextArea autoSize />
        </Form.Item>
        <Form.Item name="description" label="项目性质">
          <Input.TextArea autoSize />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  'The two passwords that you entered do not match!',
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="nickname"
          label={
            <span>
              Nickname&nbsp;
              <Tooltip title="What do you want others to call you?">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            {
              required: true,
              message: 'Please input your nickname!',
              whitespace: true,
            },
          ]}
        >
          <Input onChange={debounceUpdateBasicCost} />
        </Form.Item>

        <Form.Item
          label="Captcha"
          extra="We must make sure that your are a human."
        >
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                name="captcha"
                noStyle
                rules={[
                  {
                    required: true,
                    message: 'Please input the captcha you got!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Button>Get captcha</Button>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default RegistrationForm;
