import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Button,
  Card,
  Table,
  Space,
  Tag,
  Pagination,
  ConfigProvider,
} from 'antd';
import { ConnectProps, connect, Link, Dispatch } from 'umi';
import { OrderListModelType } from './models/list';
import zhCN from 'antd/lib/locale/zh_CN';

import './list.less';
interface SecurityLayoutProps extends ConnectProps {
  dispatch: Dispatch;
  orderList: any;
}
interface SecurityLayoutState {}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text: any) => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (tags: any) => (
      <>
        {tags.map((tag: any) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (text: any, record: any) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
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

  const [list, setList] = useState([]);

  useEffect(() => {
    dispatch({
      type: 'orderList/fetchList',
      payload: req,
    });
  }, []);

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
  const sizeChange = (pageNo: any, pageSize: any) => {
    var o = { ...req, pageNo, pageSize };
    setreq(o);
    dispatch({
      type: 'orderList/fetchList',
      payload: o,
    });
  };

  return (
    <ConfigProvider locale={zhCN}>
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
        <div>
          <Table
            columns={columns}
            dataSource={orderList.data}
            pagination={false}
          />
        </div>
        <div style={{ textAlign: 'right', marginTop: '10px' }}>
          <Pagination
            onChange={pageChange}
            onShowSizeChange={sizeChange}
            defaultCurrent={orderList.pageNo}
            total={orderList.totalCount}
          />
        </div>
      </Card>
    </ConfigProvider>
  );
}

export default connect(({ orderList }: { orderList: OrderListModelType }) => ({
  orderList,
}))(index);
