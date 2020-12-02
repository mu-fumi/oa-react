/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
  getMenuData,
} from '@ant-design/pro-layout';
import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import { Link, connect, Dispatch } from 'umi';
import { Result, Button } from 'antd';
import Authorized from '@/components/Authorized';
import { ConnectState } from '@/models/connect';
import { getMatchMenu } from '@umijs/route-utils';
import { IPremList } from '@/models/user';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);
export interface BasicLayoutProps {
  permList: IPremList;
  location: Location;
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
}
/**
 * use Authorized check all menu item
 */

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const {
    children,
    route,
    permList,
    location = {
      pathname: '/',
    },
  } = props;

  // get children authority
  const authorized = useMemo(() => {
    const current = getMenuData(route?.routes || []);
    console.log('current', current.menuData);
    return (
      getMatchMenu(location.pathname || '/', current.menuData).pop() || {
        perm: undefined,
      }
    );
  }, [location.pathname]);
  console.log('authorized', authorized);

  const menuDataRender = useCallback(
    (menuList: MenuDataItem[]): MenuDataItem[] =>
      menuList.map(item => {
        const localItem = {
          ...item,
          children: item.children ? menuDataRender(item.children) : undefined,
        };
        return Authorized.checkPermRender(
          item.perm,
          permList,
          localItem,
          null,
        ) as MenuDataItem;
      }),
    [permList],
  );

  return (
    <Authorized perm={authorized.perm} permList={permList} noMatch={noMatch}>
      {children}
    </Authorized>
  );
};

export default connect(({ user }: ConnectState) => ({
  permList: user.permList,
}))(BasicLayout);
