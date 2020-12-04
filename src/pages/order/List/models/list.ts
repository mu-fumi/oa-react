import { Effect, Reducer } from 'umi';
import request from '@/utils/request';
export interface orderListType {
  data: dataum[];
  pageNo: number;
  pageSize: number;
  totalCount: number;
  totalPage: number;
}
export interface dataum {
  id: number;
  order_name: string;
  order_money: string;
  in_time: string;
  out_time: string;
  order_num: string;
  project_name: string;
  order_type_name: string;
  payment: string;
  not_payment: number;
}
export interface OrderListModelType {
  namespace: string;
  state: orderListType;
  effects: {
    fetchList: Effect;
  };
  reducers: {
    changeList: Reducer;
  };
  subscribe: {};
}

let getList = (req: any) => {
  return request('/order/list', {
    method: 'GET',
    params: req,
  });
};

const OrderListModel: OrderListModelType = {
  namespace: 'orderList',

  state: {
    data: [],
    pageNo: 1,
    pageSize: 10,
    totalCount: 1,
    totalPage: 1,
  },
  reducers: {
    changeList(state, payload) {
      var _state = { ...state, ...payload.data };
      return _state;
    },
  },
  effects: {
    *fetchList(_, { call, put }) {
      const { result } = yield call(getList, _.payload);
      yield put({
        type: 'changeList',
        data: result,
      });
    },
  },

  subscribe: {},
};

export default OrderListModel;
