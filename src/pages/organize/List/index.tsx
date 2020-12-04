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
  Form,
} from 'antd';
import {
  CarryOutOutlined,
  FormOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Link } from 'umi';
import { ls, nest } from '@/utils/utils';

import './list.less';
import request from '@/utils/request';
import PeopleSelect from '@/components/PeopleSelect';

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
  clickObject: any;
}

// 修改组件，上级部门还没写
function UpdateDep({
  visible,
  hideModal,
  clickObject,
  changeDatahandler,
  getList,
}: any) {
  const [form] = Form.useForm();
  const [confirmLoading, setconfirmLoading] = useState(false);

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

  const subForm = () => {
    var data = clickObject;
    if (!data.dept_name) {
      message.error('部门名称不能为空');
      return false;
    }
    if (!data.dept_type) {
      message.error('部门类别不能为空');
      return false;
    }
    if (!data.parent_name) {
      message.error('上级部门不能为空');
      return false;
    }

    if (data.manager_ids.length) {
      data.manager_id = data.manager_ids.join(',');
    }
    setconfirmLoading(true);
    var reqData = {
      data: JSON.stringify([data]),
    };
    request('/dept/addUpdate', {
      method: 'POST',
      data: reqData,
    }).then(res => {
      setconfirmLoading(false);
      hideModal();
      getList();
    });
  };
  const itemChange = (type, val) => {
    changeDatahandler(type, val);
  };

  return (
    <Modal
      title="编辑部门"
      destroyOnClose
      maskClosable={false}
      visible={visible}
      onOk={subForm}
      onCancel={hideModal}
      confirmLoading={confirmLoading}
      okText="确认"
      cancelText="取消"
    >
      <Form preserve={false} form={form} {...formItemLayout}>
        <Form.Item label="部门名称:">
          <Input
            placeholder="请输入部门名称"
            value={clickObject.dept_name}
            onChange={e => itemChange('dept_name', e.target.value)}
          />
        </Form.Item>
        <Form.Item label="部门类别:" name="dept_type">
          <Select
            placeholder="请输入部门类别"
            value={clickObject.dept_type}
            defaultValue={clickObject.dept_type}
            onChange={e => itemChange('dept_type', e)}
          >
            <Select.Option value={1}>部门</Select.Option>
            {/* <Select.Option value={2}>事业部</Select.Option> */}
            <Select.Option value={3}>子公司</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="部门负责人:" name="manager_ids">
          <PeopleSelect
            placeholder="请选择部门负责人"
            unFilterUsers={clickObject.manager_ids}
            mode="multiple"
            allUser
            onChange={e => itemChange('manager_ids', e)}
          ></PeopleSelect>
        </Form.Item>

        <Form.Item label="上级部门:">
          <Input placeholder="请重复上级部门" />
        </Form.Item>

        <Form.Item label="说明:">
          <Input
            placeholder="请输入说明"
            value={clickObject.remark}
            onChange={e => itemChange('remark', e.target.value)}
          />
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
      it.manager_ids = it.manager_id?.split(',') || [];

      //   if (it.manager_name) {
      // it.managerList = it.manager_name
      //   ?.split(',')
      //   .map((name: any, ind: number) => ({
      //     username: name,
      //     userid: it.manager_id?.split(',')[ind],
      //   }));
      //   }
      //   it.managerListBack = it.managerList || [];
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
  clickdatahandler = (type, val) => {
    var oldata = this.state.clickObject;
    oldata[type] = val;
    this.setState({
      clickObject: oldata,
    });
  };
  edit = (e: any, row: any) => {
    console.log('row -> :', row);
    e.stopPropagation();
    this.setState({
      visible: true,
      selectObject: {},
      clickObject: row,
    });
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

    return (
      <>
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
          changeDatahandler={this.clickdatahandler}
          getList={this.getTree}
          clickObject={clickObject}
        ></UpdateDep>
      </>
    );
  }
}

export default List;
