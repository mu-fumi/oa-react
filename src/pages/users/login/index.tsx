import React from 'react';
import { Row, Col, Form, Tabs, Alert, Input, Button } from 'antd';
import './login.less';
import iu from './iu.png';
import pd from './pd.png';
import lbg from './lbg.png';

const { TabPane } = Tabs;

export default function login() {
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="main">
      <Row style={{ padding: 0 }}>
        <Col span={12}>
          <img height="440px" width="440px" src={lbg} alt="" />
        </Col>
        <Col span={12} className="login-card">
          <p className="logo"></p>
          <div>
            <h1></h1>
            <p></p>
          </div>

          <Form
            id="formLogin"
            className="user-layout-login"
            name="formLogin"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Tabs tabBarStyle={{ textAlign: 'center', borderBottom: 'unset' }}>
              <TabPane key="tab1" tab="账号密码登录">
                <Alert
                  style={{ marginBottom: '24px' }}
                  type="error"
                  showIcon
                  message="账户或密码错误"
                />

                <Form.Item>
                  <Input />
                </Form.Item>

                <Form.Item>
                  <Input.Password />
                </Form.Item>
              </TabPane>

              <TabPane key="tab2" tab="手机号登录">
                <Form.Item>
                  <Input />
                </Form.Item>

                <Row gutter={16}>
                  <Col className="gutter-row" span={16}>
                    <Form.Item>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={8}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="getCaptcha"
                    >
                      Submit
                    </Button>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>

            <Form.Item style={{ marginTop: '24px' }}>
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                className="login-button"
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
