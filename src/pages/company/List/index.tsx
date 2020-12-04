import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Button,
  Empty,
  Card,
  Modal,
  Form,
  Input,
  Upload,
  message,
} from 'antd';
import { PlusOutlined, FormOutlined, LoadingOutlined } from '@ant-design/icons';

import './list.less';
import request from '@/utils/request';

export default function index() {
  const [listData, setListData] = useState<any>([]);
  const [titleText, setTitleText] = useState<string>('新增公司');
  const [logo, setLogo] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [selectObject, setSelectObject] = useState<any>({});

  const [form] = Form.useForm();

  const newCom = () => {
    setVisible(true);
    setTitleText('新增公司');
  };
  const editCom = (row: any) => {
    setVisible(true);
    var o = { ...row, com_id: row.com_id };
    setSelectObject(o);
    setLogo(row.logo);
    setTitleText('修改公司');
    setval(o);
  };
  const handleOk = () => {
    form
      .validateFields()
      .then((values: any) => {
        values.logo = logo;
        if (selectObject.com_id) {
          values.com_id = selectObject.com_id;
        }
        setConfirmLoading(true);

        request('/company/save', {
          method: 'POST',
          data: values,
        }).then(res => {
          console.log('res -> :', res);
          setConfirmLoading(false);
          handleCancel();
          getList();
        });
      })
      .catch((errorInfo: any) => {
        console.log('errorInfo -> :', errorInfo);
      });
  };
  const handleCancel = () => {
    setVisible(false);
    setLogo('');
    setval({});
    setSelectObject({
      com_id: '',
    });
  };

  const setval = (o: any) => {
    form.setFieldsValue({
      com_name: o.com_name,
      principal: o.principal,
    });
  };

  const delCom = () => {
    Modal.confirm({
      title: '提示',
      content: '确定删除该公司？',
      onOk: () => {
        request('/company/del', {
          params: {
            com_id: selectObject.com_id,
          },
        }).then(res => {
          message.success(res.msg);
          handleCancel();
          getList();
        });
      },
      onCancel: () => {},
    });
  };

  const handleChange = (info: any) => {
    if (info.file.status !== 'uploading') {
      setLoading(true);
    }
    if (info.file.status === 'done') {
      setLoading(false);

      var response = info.file.response;
      setLogo(process.env.APP_API_BASE_URL + response.result.url);
    } else if (info.file.status === 'error') {
      message.error(response.msg);
      setLoading(false);
    }
  };

  const beforeUpload: any = (file: any, fileList: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('请传png或者jpg的图片格式！');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      //   message.error('图片大小不能超过2M');
    }

    // 图片文件大小限制，
    var imgWidth = 0;
    var imgHight = 0;
    const isSize = new Promise((resolve, reject) => {
      var width = 246;
      var height = 58;
      var _URL = window.URL || window.webkitURL;
      var img = new Image();
      img.onload = function() {
        imgWidth = img.width;
        imgHight = img.height;
        var valid = img.width === width && img.height === height;
        // eslint-disable-next-line prefer-promise-reject-errors
        valid ? resolve() : reject();
      };
      img.src = _URL.createObjectURL(file);
    }).then(
      () => {
        return file;
      },
      () => {
        message.error(
          '上传文件的图片大小不合符标准,宽需要为246px，高需要为58px。当前上传图片的宽高分别为：' +
            imgWidth +
            'px和' +
            imgHight +
            'px',
        );
        setLoading(false);
        return Promise.reject();
      },
    );
    return isJpgOrPng && isLt2M && isSize;
  };

  const getList = () => {
    request('/company/list', {
      method: 'GET',
    }).then(res => {
      setListData(res.result);
    });
  };
  useEffect(() => {
    getList();
    return () => {};
  }, []);

  return (
    <>
      <Row gutter={16} style={{ padding: '12px 0' }}>
        <Col span={12} className="top-left">
          <span className="bar"></span>
          <span className="text">公司信息</span>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={newCom}>
            <PlusOutlined />
            新增公司
          </Button>
        </Col>
      </Row>

      <Row
        gutter={16}
        style={{ background: '#fff', margin: 0, padding: '16px 8px' }}
      >
        {!listData.length ? (
          <Empty />
        ) : (
          listData.map((item: any, index: number) => (
            <Col
              xs={2}
              sm={4}
              md={6}
              lg={8}
              xl={6}
              key={index}
              className="card-col"
            >
              <Card
                hoverable
                className="card-wrap"
                bordered
                title={
                  <img className="title-imgs" src={item.logo} alt="logo" />
                }
                extra={
                  <FormOutlined
                    onClick={() => editCom(item)}
                    className="btns"
                  />
                }
              >
                <p className="line" title={item.com_name}>
                  {item.com_name}
                </p>
                <p className="but line" title={item.principal}>
                  <span>负责人 : {item.principal}</span>
                </p>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <Modal
        title={titleText}
        maskClosable={false}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
        footer={[
          <Button key="del" style={{ float: 'left' }} onClick={delCom}>
            删除公司
          </Button>,
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={confirmLoading}
            onClick={handleOk}
          >
            保存
          </Button>,
        ]}
      >
        <Form preserve={false} form={form}>
          <Form.Item
            label="公司名称:"
            name="com_name"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 17, offset: 1 }}
            rules={[{ required: true, message: '请输入公司名称' }]}
          >
            <Input placeholder="公司名称" />
          </Form.Item>
          <Form.Item
            label="负责人:"
            name="principal"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 17, offset: 1 }}
          >
            <Input placeholder="负责人" />
          </Form.Item>
          <Form.Item
            label="公司logo"
            extra="提示：请传入宽 246px 高 58px 的白底黑字的logo图片"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 17, offset: 1 }}
          >
            <Upload
              name="file"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
              action={
                process.env.APP_API_BASE_URL +
                'v1' +
                '/upload_file?type=picture'
              }
              onChange={handleChange}
            >
              {logo ? (
                <img style={{ width: '100%' }} src={logo} alt="avatar" />
              ) : (
                <div>
                  {loading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div className="ant-upload-text">上传</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
