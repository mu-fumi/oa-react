import { Effect, Reducer } from 'umi';

import { queryCurrent } from '@/services/user';

export interface IPremTree {
  [key: string]: IPremTree | boolean;
}
export interface CurrentUser {
  avatar?: string;
  username?: string;
  title?: string;
  userid?: string;
  mobile?: string;
  managers_name?: string;
  admin_type_text?: string;
}

export interface UserModelState {
  currentUser?: CurrentUser;
  premTree: IPremTree;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
    premTree: {},
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const { result } = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: result,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      const { premTree, ...user } = action.payload;
      return {
        ...state,
        premTree: premTree || {},
        currentUser: user || {},
      };
    },
  },
};

export default UserModel;
