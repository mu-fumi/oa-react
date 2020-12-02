import React, { useState } from 'react';
import { history } from 'umi';
import { Row, Col, Form, Tabs, Alert, Input, Button } from 'antd';
import './login.less';
import iu from './iu.png';
import pd from './pd.png';
import lbg from './lbg.png';
import request from '@/utils/request';
import { ls } from '@/utils/utils';

export interface LoginType {
  mobile: string;
  type: string;
  password?: string;
  code?: string;
}

const { TabPane } = Tabs;

export default function login() {
  const [err, setErr] = useState(false);

  const onFinish = (values: LoginType) => {
    console.log('values -> :', values);
    request('/user/admin_login', {
      method: 'POST',
      data: values,
    })
      .then(res => loginSuccess(res))
      .catch(err => requestFailed(err));
  };

  const loginSuccess = (res: any) => {
    console.log('res -> :', res)
    ls.set('token', res.result.token);
    ls.set('user', res.result.user);
    history.push('/');
    setErr(false);
  };
  const requestFailed = (err: any) => {
    console.log('err -> :', err);
    setErr(true);
  };

  const onFinishFailed = (errorInfo: any) => {};

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
            <Tabs>
              <TabPane key="tab1" tab="账号密码登录">
                {err && (
                  <Alert
                    style={{ marginBottom: '24px' }}
                    type="error"
                    showIcon
                    message="账户或密码错误"
                  />
                )}

                <Form.Item
                  name="mobile"
                  rules={[
                    {
                      required: true,
                      pattern: /^1[3456789]\d{9}$/,
                      validateTrigger: 'change',
                      message: '请输入正确的手机号',
                    },
                  ]}
                >
                  <Input
                    size="large"
                    prefix={<img src={iu} width="16px" />}
                    placeholder="请输入手机号"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: '请输入密码',
                      validateTrigger: 'blur',
                    },
                  ]}
                >
                  <Input.Password
                    size="large"
                    prefix={<img src={pd} width="16px" />}
                    placeholder="请输入密码"
                  />
                </Form.Item>
              </TabPane>

              <TabPane key="tab2" tab="手机号登录">
                <Form.Item
                  name="mobile"
                  rules={[
                    {
                      required: true,
                      pattern: /^1[3456789]\d{9}$/,
                      validateTrigger: 'change',
                      message: '请输入正确的手机号',
                    },
                  ]}
                >
                  <Input
                    size="large"
                    prefix={<img src={iu} width="16px" />}
                    placeholder="请输入手机号"
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col className="gutter-row" span={16}>
                    <Form.Item
                      name="mobile"
                      rules={[
                        {
                          required: true,
                          message: '请输入验证码',
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        prefix={<img src={iu} width="16px" />}
                        placeholder="请输入验证码"
                      />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={8}>
                    <Button type="primary">获取验证码</Button>
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
