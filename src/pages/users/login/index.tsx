import React, { useState, useRef } from 'react';
import { history } from 'umi';
import { Row, Col, Form, Tabs, Alert, Input, Button, Message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import './login.less';
import iu from './img/iu.png';
import pd from './img/pd.png';
import lbg from './img/lbg.png';
import request from '@/utils/request';
import { ls } from '@/utils/utils';

export interface LoginType {
  mobile: string;
  type: string;
  login_type: string;
  password?: string;
  sms_code?: string;
}

const { TabPane } = Tabs;

export default function login() {
  const [err, setErr] = useState(false);
  const myForm: any = useRef<any>();
  const [tabKey, setTabKey] = useState('password');

  const [state, setState] = useState({
    time: 60,
    loginBtn: false,
    smsSendBtn: false,
  });

  const onFinish = () => {
    var vaKeys =
      tabKey === 'password' ? ['mobile', 'password'] : ['mobile', 'sms_code'];
    myForm.current
      .validateFields(vaKeys)
      .then((values: LoginType) => {
        values.login_type = tabKey;
        request('/user/admin_login', {
          method: 'POST',
          data: values,
          ignoreAllErr: true,
        })
          .then(res => loginSuccess(res))
          .catch(err => requestFailed(err));
      })
      .catch((errorInfo: any) => {
        console.log('errorInfo -> :', errorInfo);
      });
  };
  const changeTabs = (key: string) => {
    setTabKey(key);
  };

  const loginSuccess = (res: any) => {
    ls.set('token', res.result.token);
    ls.set('user', res.result.user);
    history.push('/');
    setErr(false);
  };
  const requestFailed = (err: any) => {
    console.log('err -> :', err);
    if (tabKey === 'password') {
      setErr(true);
    };
  };

  const onFinishFailed = (errorInfo: any) => {};

  const getCaptcha = () => {
    var newData = { ...state };

    myForm.current
      .validateFields(['mobile'])
      .then((values: any) => {
        newData.smsSendBtn = true;
        setState(newData);

        const interval = window.setInterval(() => {
          if (newData.time-- <= 0) {
            newData.time = 60;
            newData.smsSendBtn = false;
            window.clearInterval(interval);
          }
          setState({ ...newData });
        }, 1000);

        const hide = Message.loading('验证码发送中..', 0);

        request('/send_login_sms', {
          method: 'GET',
          params: values,
        })
          .then(res => {
            setTimeout(hide, 2500);
          })
          .catch(err => {
            console.log('err -> :', err);
            setTimeout(hide, 1);
            clearInterval(interval);
            state.time = 60;
            state.smsSendBtn = false;
            setState({ ...newData });
          });
      })
      .catch((errorInfo: any) => {
        console.log('errorInfo -> :', errorInfo);
      });
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
            ref={myForm}
          >
            <Tabs onChange={changeTabs}>
              <TabPane key="password" tab="账号密码登录">
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

              <TabPane key="sms" tab="手机号登录">
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
                      name="sms_code"
                      rules={[
                        {
                          required: true,
                          message: '请输入验证码',
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        prefix={<MailOutlined width="16px" />}
                        placeholder="请输入验证码"
                      />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={8}>
                    <Button
                      type="primary"
                      size="large"
                      disabled={state.smsSendBtn}
                      onClick={getCaptcha}
                    >
                      {state.smsSendBtn ? state.time + ' s' : '获取验证码'}
                    </Button>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>

            <Form.Item style={{ marginTop: '24px' }}>
              <Button
                size="large"
                type="primary"
                htmlType="button"
                className="login-button"
                onClick={onFinish}
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
