import React, { useState, useEffect, Component } from 'react';
import {
  Row,
  Col,
  Button,
  Tree,
  Empty,
  Input,
  Select,
  message,
  Modal,
  ConfigProvider,
  Form,
} from 'antd';
import {
  CarryOutOutlined,
  FormOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Link } from 'umi';
import { ls, nest } from '@/utils/utils';
import zhCN from 'antd/es/locale/zh_CN';

import './list.less';
import request from '@/utils/request';

interface SelectObject {
  dept_id: number;
  com_id: number;
  path: string;
  dept_name: string;
}
interface RootObject {
  treeData: any[];
  reqData: any[];
  firstArr: any[];
  selectObject: SelectObject;
  depChildren: any[];
  visible: boolean;
  clickObject: {};
}

function UpdateDep({ visible, hideModal, clickObject }: any) {
  const [form] = Form.useForm();

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

  const subForm = () => {};

  return (
    <Modal
      title="编辑部门"
      destroyOnClose
      maskClosable={false}
      visible={visible}
      onOk={subForm}
      onCancel={hideModal}
      okText="确认"
      cancelText="取消"
    >
      <Form preserve={false} form={form} {...formItemLayout}>
        <Form.Item label="手机号/账号:">{clickObject.mobile}</Form.Item>
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

class List extends Component {
  state: RootObject = {
    treeData: [],
    reqData: [],
    firstArr: [],
    selectObject: {
      dept_id: 0,
      com_id: 0,
      path: '',
      dept_name: '',
    },
    depChildren: [],

    visible: false,

    clickObject: {},
  };

  componentDidMount() {
    this.getTree();
  }

  getTree = () => {
    request('/dept/list', {
      method: 'GET',
    }).then((res: any) => {
      this.dataHandler(res.result);
    });
  };

  dataHandler = (res: any) => {
    var reqData = res.map((it: any) => {
      it.key = it.dept_id;
      it.title = it.dept_name;
      if (it.manager_name) {
        it.managerList = it.manager_name
          ?.split(',')
          .map((name: any, ind: number) => ({
            username: name,
            userid: it.manager_id?.split(',')[ind],
          }));
      }
      it.managerListBack = it.managerList || [];
      it.parent_idBack = it.parent_id;
      it.parent_nameBack = it.parent_name;
      return it;
    });
    var firstArrStr = reqData[0].dept_id;
    this.setState({
      reqData,
      firstArr: [firstArrStr],
    });
    var newReqData = nest(reqData, 0, 'parent_id');
    this.setState({
      treeData: newReqData,
    });
  };

  exportFile = () => {
    var url =
      process.env.APP_API_BASE_URL +
      '/v1' +
      '/dept/export?token=' +
      ls.get('token');
    window.open(url);
  };

  hideModal = () => {
    this.setState({
      visible: false,
    });
  };

  edit = (e: any, row: any) => {
    e.stopPropagation();
    this.setState({
      visible: true,
      selectObject: {},
    });
    console.log('row -> :', row);
  };
  del = (e: any, row: any) => {
    e.stopPropagation();
    this.setState({
      selectObject: {},
    });
    Modal.confirm({
      title: '提示',
      content: '确定删除该部门？',
      onOk: () => {
        request('/dept/delete', {
          method: 'DELETE',
          params: { dept_id: row.dept_id },
        }).then(res => {
          this.getTree();
        });
      },
      onCancel: () => {},
    });
  };

  onSelect = (row: any) => {
    if (row[0]) {
      var obj: any = this.state.reqData.find(
        (it: any) => it.dept_id === row[0],
      );
      this.setState(
        {
          selectObject: obj,
        },
        () => {
          this.getChildList();
        },
      );
    }
  };
  getChildList = () => {
    var obj = {
      dept_id: this.state.selectObject.dept_id,
    };
    request('/dept/sonList', {
      params: obj,
    }).then(res => {
      this.setState({
        depChildren: res.result,
      });
      this.isAddDomain();
    });
  };
  addDomain = () => {
    var oldChildren = this.state.depChildren;
    oldChildren.push({
      dept_type: 1,
      com_id: this.state.selectObject.com_id,
      parent_id: this.state.selectObject.dept_id,
    });
    this.setState({
      depChildren: oldChildren,
    });
  };
  isAddDomain = () => {
    if (this.state.depChildren.length) {
      var lastName = this.state.depChildren[this.state.depChildren.length - 1]
        .dept_name;
      if (lastName) {
        this.addDomain();
      }
    } else {
      this.addDomain();
    }
  };

  itemChange = (type: string, val: string | number, dept_id: number) => {
    var oldData = this.state.depChildren;
    oldData = oldData.map(it => {
      if (it.dept_id === dept_id) {
        it[type] = val;
      }
      return it;
    });
    this.setState({
      depChildren: oldData,
    });
  };

  submitForm = () => {
    var data = this.state.depChildren.filter(it => it.dept_name);
    if (!data.length) {
      message.error('请填写部门名称');
      return false;
    }
    //    this.saveAndEditLoading = true;
    var reqData = {
      data: JSON.stringify(data),
    };
    request('/dept/addUpdate', {
      method: 'POST',
      data: reqData,
      ignoreErr: true,
    })
      .then(res => {
        // this.saveAndEditLoading = false;
        //   var oldselectdd = JSON.stringify(this.selectData)
        //   this.selectData = {}
        Modal.success({
          title: '提示',
          content: res.msg,
          okText: '确定',
          onOk: () => {
            this.getTree();
            this.getChildList();
          },
        });
      })
      .catch(err => {
        // this.saveAndEditLoading = false;
        message.error(err.msg);
      });
  };

  render() {
    const {
      selectObject,
      reqData,
      firstArr,
      treeData,
      depChildren,
      visible,
      clickObject,
    } = this.state;
    console.log('firstArr -> :', firstArr);

    return (
      <ConfigProvider locale={zhCN}>
        <Row className="top-row">
          <Col span={12} className="top-left">
            <span className="bar"></span>
            <span className="text">组织维护</span>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Link target="_blank" to="/import/dept">
              <Button type="primary"> 导入 </Button>
            </Link>
            &nbsp; &nbsp;
            <Button type="primary" onClick={this.exportFile}>
              导出
            </Button>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}>
            <div
              className="gutter-row"
              style={{ height: 'calc(100vh)', overflow: 'auto' }}
            >
              <Tree
                showLine
                blockNode
                expandedKeys={firstArr}
                treeData={treeData}
                onSelect={this.onSelect}
                className="my-tree tree-wrap"
                titleRender={(row: any) => {
                  return (
                    <>
                      <div className="tit">{row.title}</div>
                      <div className="btns">
                        {row.parent_id != 0 ? (
                          <FormOutlined onClick={e => this.edit(e, row)} />
                        ) : null}
                        {!row.children.length && row.parent_id != 0 ? (
                          <DeleteOutlined onClick={e => this.del(e, row)} />
                        ) : null}
                      </div>
                    </>
                  );
                }}
              ></Tree>
            </div>
          </Col>
          <Col span={18}>
            <div className="gutter-row">
              {selectObject.dept_id ? (
                <div className="flex-div">
                  <Row>
                    <Col span={5}>
                      <span className="left-name">
                        {selectObject.path || selectObject.dept_name}
                      </span>
                    </Col>
                    <Col span={19}>
                      <div className="form-div-wrap">
                        {depChildren.map((it: any, index: any) => (
                          <div key={index} className="div-item">
                            <Input
                              value={it.dept_name}
                              style={{ width: '70%', marginRight: '4px' }}
                              onChange={e =>
                                this.itemChange(
                                  'dept_name',
                                  e.target.value,
                                  it.dept_id,
                                )
                              }
                            />
                            <Select
                              style={{ width: '20%' }}
                              value={it.dept_type}
                              onChange={e =>
                                this.itemChange('dept_type', e, it.dept_id)
                              }
                            >
                              <Select.Option value={1}>部门</Select.Option>
                              {/* <Select.Option value={2}>事业部</Select.Option> */}
                              <Select.Option value={3}>子公司</Select.Option>
                            </Select>
                          </div>
                        ))}

                        <Button type="primary" onClick={this.submitForm}>
                          保存所有数据
                        </Button>
                        <Button
                          style={{ marginLeft: '10px' }}
                          onClick={this.addDomain}
                        >
                          新增部门
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </div>
              ) : (
                <Empty />
              )}
            </div>
          </Col>
        </Row>
        <UpdateDep
          visible={visible}
          hideModal={this.hideModal}
          clickObject={clickObject}
        ></UpdateDep>
      </ConfigProvider>
    );
  }
}

export default List;
