import { Effect, Reducer } from 'umi';
import request from '@/utils/request';

export interface OrderListModelType {
  namespace: string;
  state: object;
  effects: {
    fetchList: Effect;
  };
  subscribe: object;
}

let getList = (req: any) => {
  return request('/order/list', {
    method: 'GET',
    params: req,
  })
};

const OrderListModel: OrderListModelType = {
  namespace: 'orderList',

  state: {
    data: [],
    pageNo: 1,
    pageSize: '',
    totalCount: 1,
    totalPage: 1,
  },
  effects: {
    *fetchList(_, { call, put }) {
      const { result } = yield call(getList, _.payload);
      console.log('result -> :', result);
      //   yield put({
      //     type: 'saveCurrentUser',
      //     payload: result,
      //   });
    },
  },
  subscribe: {},
};

export default OrderListModel;
