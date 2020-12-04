import React, { Component } from 'react';
import { Link } from 'umi';
import {
  Row,
  Col,
  Button,
  Form,
  Input,
  DatePicker,
  Select,
  Table,
  Pagination,
} from 'antd';

import './list.less';
import request from '@/utils/request';
import { Moment } from 'moment';
import DepartmentTree from '@/components/DepartmentTree';

interface pageObjectType {
  pageSize: number;
  pageNo: number;
  totalCount: number;
}
interface formInlineType {
  keywords: string;
  position: string;
  startTime?: any;
  endTime?: any;
  entry_date_s: string;
  entry_date_e: string;
  employment_form: undefined;
  base_city: undefined;
}

interface RootObject {
  isSearchAll: boolean;
  isSearch: boolean;
  dept_id: number;
  employmentFormArr: any[];
  cityArr: any[];
  leave_typeArr: any[];
  settleArr: any[];
  list: any[];
  formInline: formInlineType;
  pageObject: pageObjectType;
}

const columns = [
  {
    title: '序号',
    render: (text: any, record: any, index: any) => `${index + 1}`,
    width: 60,
    ellipsis: true,
  },
  {
    title: '工号',
    dataIndex: 'staff_sn',
    ellipsis: true,
  },
  {
    title: '姓名',
    dataIndex: 'username',
    ellipsis: true,
    render: (text: any, record: any, index: any) => (
      <Link to={'/admin/sysmanage/people-info/' + record.userid}>{text}</Link>
    ),
  },
  {
    title: '部门',
    dataIndex: 'fill_dept_name',
    ellipsis: true,
    width: '12%',
  },
  {
    title: '职位',
    dataIndex: 'position',
    ellipsis: true,
  },
  {
    title: '入职日期',
    dataIndex: 'entry_date',
    ellipsis: true,
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    ellipsis: true,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    ellipsis: true,
  },
  {
    title: '人员性质',
    dataIndex: 'employment_form',
    ellipsis: true,
  },
  {
    title: '人员状态',
    dataIndex: 'is_leave',
    ellipsis: true,
    render: (text: string, record: any, index: number) =>
      `${record.is_leave ? '离职' : '在职'}`,
  },
  {
    title: 'base地',
    dataIndex: 'base_city',
  },
];

class index extends Component {
  state: RootObject = {
    isSearch: false,
    isSearchAll: false,

    dept_id: 0,

    employmentFormArr: [],
    cityArr: [],
    leave_typeArr: [],
    settleArr: [],

    formInline: {
      keywords: '',
      position: '',
      startTime: null,
      endTime: null,
      entry_date_s: '',
      entry_date_e: '',
      employment_form: undefined,
      base_city: undefined,
    },
    pageObject: {
      pageSize: 10,
      pageNo: 1,
      totalCount: 0,
    },

    list: [],
  };

  componentDidMount() {
    this.getTypes();
    // this.getList();
  }

  toAdd = () => {};

  handleSubmit = () => {
    this.setState(
      {
        isSearchAll: true,
      },
      () => {
        this.getList();
      },
    );
  };
  menuSelect = (dept_id: number) => {
    this.setState(
      {
        dept_id: dept_id,
        isSearchAll: false,
      },
      () => {
        this.getList();
      },
    );
  };
  itemChange = (val: any, type: string) => {
    var ol: any = this.state.formInline;
    ol[type] = val;
    this.setState({
      formInline: ol,
    });
  };
  timeChange = (e: Moment | null, val: any, type: string, oldType: string) => {
    var ol: any = this.state.formInline;
    ol[type] = val;
    ol[oldType] = e;
    this.setState({
      formInline: ol,
    });
  };

  exportFile = () => {
    var url = process.env.APP_API_BASE_URL + '/v1' + '/user/export';
    window.open(url);
  };

  getTypes = () => {
    request('/dict/get', {
      params: { dict_str: 'employment_form,base_city,leave_type,settle' },
    }).then(res => {
      this.setState({
        employmentFormArr: res.result.employment_form,
        cityArr: res.result.base_city,
        leave_typeArr: res.result.leave_type,
        settleArr: res.result.settle,
      });
    });
  };
  getList = () => {
    var data: any = !this.state.isSearchAll
      ? {
          dept_id: this.state.dept_id,
          ...this.state.pageObject,
        }
      : {
          ...this.state.formInline,
          ...this.state.pageObject,
        };
    request('/user/list_paging', {
      method: 'GET',
      params: data,
    }).then(res => {
      console.log('res -> :', res);
      var page = {
        pageNo: res.result.pageNo,
        pageSize: res.result.pageSize,
        totalCount: res.result.totalCount,
        totalPage: res.result.totalPage,
      };
      this.setState({
        list: res.result.data,
        pageObject: page,
      });
    });
  };

  searchCancel = () => {
    var obj = {
      keywords: '',
      position: '',
      startTime: null,
      endTime: null,
      entry_date_s: '',
      entry_date_e: '',
      employment_form: undefined,
      base_city: undefined,
    };
    var pageObj = {
      pageSize: 10,
      pageNo: 1,
      total: 0,
    };
    this.setState({
      formInline: { ...obj },
      pageObject: pageObj,
    });
    this.getList();
  };

  pageChange = (page: any, size: any) => {
    var pageol = this.state.pageObject;
    pageol.pageNo = page;
    pageol.pageSize = size;
    this.setState(
      {
        pageObject: pageol,
      },
      () => {
        this.getList();
      },
    );
  };

  render() {
    const {
      isSearch,
      employmentFormArr,
      cityArr,
      formInline,
      pageObject,
      list,
    } = this.state;
    return (
      <>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={24} xl={5}>
            <div
              className="gutter-row"
              style={{
                padding: '4px',
                height: 'calc(100vh + 44px)',
                overflow: 'auto',
                minHeight: 'unset',
              }}
            >
              <DepartmentTree menuSelect={this.menuSelect}></DepartmentTree>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={19}>
            <div className="btns">
              <div>
                <Button onClick={() => this.setState({ isSearch: !isSearch })}>
                  搜索
                </Button>
              </div>
              <div>
                <Button type="primary" onClick={this.toAdd}>
                  新增员工
                </Button>
                <Button type="primary" onClick={this.exportFile}>
                  导出
                </Button>
                <Link target="_blank" to="/import/people">
                  <Button type="primary"> 人员导入 </Button>
                </Link>
                <Link target="_blank" to="/import/price">
                  <Button type="primary"> 成本导入 </Button>
                </Link>
              </div>
            </div>

            <div
              className="searchs"
              style={{ display: isSearch ? 'block' : 'none' }}
            >
              <Form layout="inline">
                <Form.Item label="工号/姓名/账号">
                  <Input
                    placeholder="工号/姓名/账号"
                    value={formInline.keywords}
                    onChange={e => this.itemChange(e.target.value, 'keywords')}
                  />
                </Form.Item>
                <Form.Item label="职位">
                  <Input
                    placeholder="职位"
                    value={formInline.position}
                    onChange={e => this.itemChange(e.target.value, 'position')}
                  />
                </Form.Item>

                <Form.Item label="入职日期" style={{ width: '430px' }}>
                  <Form.Item
                    style={{
                      width: 'calc(45% - 12px)',
                      display: 'inline-block',
                      marginRight: 0,
                    }}
                  >
                    <DatePicker
                      placeholder="请选择开始日期"
                      value={formInline.startTime}
                      onChange={(e, str) =>
                        this.timeChange(e, str, 'entry_date_s', 'startTime')
                      }
                      format="YYYY-MM-DD"
                    />
                  </Form.Item>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '24px',
                      lineHeight: '32px',
                      textAlign: 'center',
                    }}
                  >
                    -
                  </span>
                  <Form.Item
                    style={{
                      width: 'calc(50% - 12px)',
                      display: 'inline-block',
                    }}
                  >
                    <DatePicker
                      placeholder="请选择结束日期"
                      value={formInline.endTime}
                      onChange={(e, str) =>
                        this.timeChange(e, str, 'entry_date_e', 'endTime')
                      }
                      format="YYYY-MM-DD"
                    />
                  </Form.Item>
                </Form.Item>

                <Form.Item label="人员性质">
                  <Select
                    style={{ width: '200px' }}
                    placeholder="请选择人员性质"
                    value={formInline.employment_form}
                    onChange={e => this.itemChange(e, 'employment_form')}
                  >
                    <Select.Option value="all" label="全部">
                      全部
                    </Select.Option>
                    <Select.Option value="leave" label="离职">
                      离职
                    </Select.Option>
                    {employmentFormArr.map((it, index) => (
                      <Select.Option value={it.value} key={index}>
                        {it.text}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="工作城市">
                  <Select
                    style={{ width: '200px' }}
                    placeholder="请选择工作城市"
                    value={formInline.base_city}
                    onChange={e => this.itemChange(e, 'base_city')}
                  >
                    {cityArr.map((it, index) => (
                      <Select.Option value={it.value} key={index}>
                        {it.text}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={this.handleSubmit}>
                    搜索
                  </Button>
                  <Button type="primary" onClick={this.searchCancel}>
                    重置
                  </Button>
                </Form.Item>
              </Form>
            </div>

            <div>
              <Table
                columns={columns}
                dataSource={list}
                pagination={false}
                rowKey={record => record.userid}
              />
            </div>
            <div style={{ textAlign: 'right', marginTop: '10px' }}>
              <Pagination
                onChange={this.pageChange}
                current={pageObject.pageNo}
                pageSize={pageObject.pageSize}
                total={pageObject.totalCount}
              />
            </div>
          </Col>
        </Row>
      </>
    );
  }
}

export default index;
