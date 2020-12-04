import React, { Component } from 'react';
import { Link } from 'umi';
import { Row, Col, Button, Form, Input, DatePicker, Select } from 'antd';

import './list.less';
import request from '@/utils/request';
import { Moment } from 'moment';

interface pageObjectType {
  pageSize: number;
  pageNo: number;
  total: number;
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
  employmentFormArr: any[];
  cityArr: any[];
  leave_typeArr: any[];
  settleArr: any[];
  list: any[];
  formInline: formInlineType;
  pageObject: pageObjectType;
}

class index extends Component {
  state: RootObject = {
    isSearch: false,
    isSearchAll: false,

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
      total: 0,
    },

    list: [],
  };

  componentDidMount() {
    this.getTypes();
    this.getList();
  }

  toAdd = () => {};

  handleSubmit = () => {
    this.setState({
      isSearchAll: true,
    });
    this.getList();
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
          dept_id: '',
          ...this.state.pageObject,
        }
      : {
          ...data,
          ...this.state.pageObject,
        };
    request('/user/list_paging', {
      method: 'GET',
      params: data,
    }).then(res => {
      this.setState({
        list: res.result,
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
      formInline: obj,
      pageObject: pageObj,
    });
    this.getList();
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
          <Col xs={24} sm={24} md={24} lg={24} xl={4}>
            <div
              className="gutter-row"
              style={{
                padding: '0px',
                height: 'calc(100vh + 44px)',
                overflow: 'auto',
                minHeight: 'unset',
              }}
            >
              13213
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={20}>
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
                <Form.Item label="工号/姓名/账号" name="keywords">
                  <Input
                    placeholder="工号/姓名/账号"
                    value={formInline.keywords}
                    onChange={e => this.itemChange(e.target.value, 'keywords')}
                  />
                </Form.Item>
                <Form.Item label="职位" name="position">
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

                <Form.Item label="人员性质" name="employment_form">
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
                <Form.Item label="工作城市" name="base_city">
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
         
          </Col>
        </Row>
      </>
    );
  }
}

export default index;
