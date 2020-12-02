import React, { useState } from 'react';
import { Modal, Form, Input } from 'antd';

export default function UpdatePassWord(props: any) {
  const { visible, showModal, hideModal, currentUser } = props;

  const [form] = Form.useForm();

  const validatePass2 = (rule: any, value: any, callback: any) => {
    console.log('value -> :', value)
    console.log('rule -> :', rule);
    // if (value !== this.pwd.new_pwd) {
    //   callback(new Error('两次密码不一样'));
    // } else {
    //   callback();
    // }
  };

  const subForm = () => {
    form.validateFields();
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
      <Form form={form}>
        <Form.Item label="手机号/账号:">{currentUser.username}</Form.Item>
        <Form.Item
          label="原密码"
          name="old_pwd"
          rules={[{ required: true, message: '请输入原密码' }]}
        >
          <Input></Input>
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
          <Input></Input>
        </Form.Item>
        <Form.Item
          label="重复新密码"
          name="repeatNew_pwd"
          rules={[
            {
              required: true,
              message: '请重复新密码',
              validateTrigger: 'blur',
            },
            { validator: validatePass2, validateTrigger: 'change' },
          ]}
        >
          <Input></Input>
        </Form.Item>
      </Form>
    </Modal>
  );
}
