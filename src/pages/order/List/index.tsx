import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Card } from 'antd';
import { ConnectProps, connect, Link, Dispatch } from 'umi';
import { OrderListModelType } from './models/list';

import './list.less';
interface SecurityLayoutProps extends ConnectProps {
  dispatch: Dispatch;
  orderList: object;
}
interface SecurityLayoutState {}

function index(props: SecurityLayoutProps) {
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
  const [req, setreq] = useState({
    payment_status: '',
    order_name: '',
    order_type: '',
    page: 1,
    pageSize: 10,
  });

  const changeStatus = (status: any, index: number) => {
    setact(index);
    var o = { ...req };
    o.payment_status = status.payment_status;
    setreq({ ...o });
    props.dispatch({
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
        <p>Card content</p>
        <p>Card content</p>
      </Card>
    </>
  );
}

export default connect(({ orderList }: { orderList: OrderListModelType }) => {
  return orderList;
})(index);
