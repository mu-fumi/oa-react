import { Effect, Reducer } from 'umi';
import request from '@/utils/request';

export interface OrderListModelType {
  namespace: string;
  state: object;
  effects: {
    fetchList: Effect;
  };
  reducers: {
    changeList: Reducer;
  };
  subscribe: object;
}

let getList = (req: any) => {
  return {
    data:
      req.payment_status === 0
        ? [
            {
              key: '1',
              name: 'John Brown',
              age: 32,
              address: 'New York No. 1 Lake Park',
              tags: ['nice', 'developer'],
            },
            {
              key: '2',
              name: 'Jim Green',
              age: 42,
              address: 'London No. 1 Lake Park',
              tags: ['loser'],
            },
            {
              key: '3',
              name: 'Joe Black',
              age: 32,
              address: 'Sidney No. 1 Lake Park',
              tags: ['cool', 'teacher'],
            },
          ]
        : [
            {
              key: '1',
              name: 'John Brown',
              age: 32,
              address: 'New York No. 1 Lake Park',
              tags: ['nice', 'developer'],
            },
          ],
    pageNo: 1,
    pageSize: 10,
    totalCount: 60,
    totalPage: 6,
  };
  //   request('/order/list', {
  //     method: 'GET',
  //     params: req,
  //   });
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
  reducers: {
    changeList(state, payload) {
      var _state = { ...state, ...payload.data };
      return _state;
    },
  },
  effects: {
    *fetchList(_, { call, put }) {
      const result = yield call(getList, _.payload);
      yield put({
        type: 'changeList',
        data: result,
      });
    },
  },

  subscribe: {},
};

export default OrderListModel;
