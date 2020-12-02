import { MenuDataItem, Settings as ProSettings } from '@ant-design/pro-layout';
import { UserModelState } from './user';
import { StateType } from './login';

export { UserModelState };

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    login?: boolean;
  };
}

export interface ConnectState {
  loading: Loading;
  user: UserModelState;
  settings: ProSettings;
  login: StateType;
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}
