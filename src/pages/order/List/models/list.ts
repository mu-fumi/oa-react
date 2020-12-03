import { Effect, Reducer } from 'umi';
import request from '@/utils/request';

let getList = (req: any) => {
  request('/order/list', {
    method: 'GET',
    params: req,
  }).then(res => {
    console.log('res -> :', res);
  });
};

const OrderListModel = {
  namespace: 'orderList',

  state: {
    data: [],
    pageNo: 1,
    pageSize: '',
    totalCount: 1,
    totalPage: 1,
  },

  effects: {},

  reducers: {},

  subscribe: {},
};

export default OrderListModel;
