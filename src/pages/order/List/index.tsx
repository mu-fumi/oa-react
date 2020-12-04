import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Card, Table, Input, Select, Pagination } from 'antd';
import { ConnectProps, connect, Link, Dispatch } from 'umi';
import { orderListType } from './models/list';

import './list.less';
import request from '@/utils/request';

const { Option } = Select;
interface SecurityLayoutProps extends ConnectProps {
  dispatch: Dispatch;
  orderList: orderListType;
}
interface SecurityLayoutState {}

const columns = [
  {
    title: '序号',
    render: (text: any, record: any, index: any) => `${index + 1}`,
  },
  {
    title: '标题',
    dataIndex: 'order_name',
  },
  {
    title: '订单金额',

    dataIndex: 'order_money',
  },
  {
    title: '待回款',
    dataIndex: 'not_payment',
  },
  {
    title: '入离场时间',
    render: (text: any, record: any, index: any) =>
      `${record.in_time} - ${record.out_time}`,
  },
];

function index({ dispatch, orderList }: SecurityLayoutProps) {
  const [statusArr, setstatusArr] = useState([
    {
      payment_status: '',
      text: '所有',
    },
    {
      payment_status: 0,
      text: '待回款订单',
    },
  ]);
  const [act, setact] = useState(0);
  const [req, setreq] = useState<any>({
    payment_status: '',
    order_name: '',
    order_type: '',
    pageNo: 1,
    pageSize: 10,
    totalCount: 0,
    totalPage: 0,
  });

  const [orderType, setOrderType] = useState([]);

  useEffect(() => {
    getorderType();
    dispatch({
      type: 'orderList/fetchList',
      payload: req,
    });
  }, []);

  const getorderType = () => {
    request('/order/type').then(res => {
      setOrderType(res.result);
    });
  };

  const changeStatus = (status: any, index: number) => {
    setact(index);
    var o = { ...req, payment_status: status.payment_status };
    setreq(o);
    dispatch({
      type: 'orderList/fetchList',
      payload: o,
    });
  };

  const pageChange = (pageNo: any, pageSize: any) => {
    var o = { ...req, pageNo, pageSize };
    setreq(o);
    dispatch({
      type: 'orderList/fetchList',
      payload: o,
    });
  };

  const typechange = (val: any, option: any) => {
    var o = { ...req, order_type: val };
    setreq(o);
  };
  const nameChange = (e: any) => {
    var o = { ...req, order_name: e.target.value };
    setreq(o);
  };

  const btnSearch = () => {
    console.log('req -> :', req);
    dispatch({
      type: 'orderList/fetchList',
      payload: req,
    });
  };

  return (
    <>
      <Row className="top-row">
        <Col span={12} className="top-left">
          <span className="bar"></span>
          <span className="text">订单列表</span>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <Button type="primary">新增订单</Button>
          &nbsp; &nbsp;
          <Button type="primary">录入收入</Button>
        </Col>
      </Row>

      <Card bordered={false}>
        <p className="types">
          {statusArr.map((it, index) => (
            <span
              key={index}
              className={index === act ? 'active' : ''}
              onClick={() => changeStatus(it, index)}
            >
              {it.text}
            </span>
          ))}
        </p>

        <Row className="search-from">
          <Col span={8}>
            按名称/单号查找 : &nbsp;
            <Input
              style={{ width: '60%' }}
              onChange={nameChange}
              placeholder="按名称/单号查找"
            />
          </Col>
          <Col span={8}>
            订单类型 : &nbsp;
            <Select
              defaultValue=""
              style={{ width: '80%' }}
              placeholder="订单类型"
              onChange={typechange}
            >
              <Option value="">全部</Option>
              {orderType.map((it: any, index) => (
                <Option key={index} value={it.id}>
                  {it.order_type_name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <Button type="primary" onClick={btnSearch}>
              搜索
            </Button>
          </Col>
        </Row>

        <div>
          <Table
            columns={columns}
            dataSource={orderList.data}
            pagination={false}
            rowKey={record => record.id}
          />
        </div>
        <div style={{ textAlign: 'right', marginTop: '10px' }}>
          <Pagination
            onChange={pageChange}
            current={orderList.pageNo}
            pageSize={orderList.pageSize}
            total={orderList.totalCount}
          />
        </div>
      </Card>
    </>
  );
}

export default connect(({ orderList }: { orderList: orderListType }) => ({
  orderList,
}))(index);
