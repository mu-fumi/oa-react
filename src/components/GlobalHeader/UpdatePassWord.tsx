import React, { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import request from '@/utils/request';
import { ls } from '@/utils/utils';
import { history } from 'umi';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

export interface UpdatePwdType {
  old_pwd: string;
  new_pwd: string;
  repeatNew_pwd: string;
}

export default function UpdatePassWord(props: any) {
  const { visible, hideModal, currentUser } = props;

  const [form] = Form.useForm();

  const subForm = () => {
    form
      .validateFields()
      .then((values: any) => {
        request('/user/update_pwd', {
          method: 'POST',
          data: values,
        }).then((res: any) => {
          hideModal();
          message.success(res.msg + '，请重新登陆');
          setTimeout(() => {
            ls.cl();
            history.push('/user');
          }, 1400);
        });
      })
      .catch((errorInfo: any) => {
        console.log('errorInfo -> :', errorInfo);
      });
  };

  return (
    <Modal
      title="修改密码"
      destroyOnClose
      maskClosable={false}
      visible={visible}
      onOk={subForm}
      onCancel={hideModal}
      okText="确认"
      cancelText="取消"
    >
      <Form preserve={false} form={form} {...formItemLayout}>
        <Form.Item label="手机号/账号:">{currentUser.mobile}</Form.Item>
        <Form.Item
          label="原密码"
          name="old_pwd"
          rules={[{ required: true, message: '请输入原密码' }]}
        >
          <Input placeholder="请输入原密码" />
        </Form.Item>
        <Form.Item
          label="新密码"
          name="new_pwd"
          rules={[
            {
              required: true,
              message: '请输入新密码',
              validateTrigger: 'blur',
            },
            {
              min: 6,
              max: 20,
              message: '请输入 6 到 20 位的密码',
              validateTrigger: 'blur',
            },
          ]}
        >
          <Input placeholder="请输入新密码" />
        </Form.Item>
        <Form.Item
          label="重复新密码"
          name="repeatNew_pwd"
          rules={[
            {
              required: true,
              message: '请重复新密码',
            },

            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('new_pwd') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('两次密码不一样');
              },
            }),
          ]}
        >
          <Input placeholder="请重复新密码" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
