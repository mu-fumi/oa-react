import { getMenuData } from '@ant-design/pro-layout';
import React, { useMemo, useCallback } from 'react';
import { Link, connect, Dispatch, IRoute } from 'umi';
import { Result, Button } from 'antd';
import Authorized from '@/components/Authorized';
import { ConnectState } from '@/models/connect';
import { getMatchMenu } from '@umijs/route-utils';
import { IPremTree } from '@/models/user';

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
  premTree: IPremTree;
  location: Location;
  route: IRoute;
  dispatch: Dispatch;
}
/**
 * use Authorized check all menu item
 */

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const {
    children,
    route,
    premTree,
    location = {
      pathname: '/',
    },
  } = props;

  // get menuData
  const menuData = useMemo(() => {
    const current = getMenuData(route?.routes || []);
    return current.menuData;
  }, [location.pathname]);

  // get children authority
  const authorized = useMemo(() => {
    return (
      getMatchMenu(location.pathname || '/', menuData).pop() || {
        perm: undefined,
      }
    );
  }, [menuData]);

  return (
    <Authorized perm={authorized.perm} premTree={premTree} noMatch={noMatch}>
      {children}
    </Authorized>
  );
};

export default connect(({ user }: ConnectState) => ({
  premTree: user.premTree,
}))(BasicLayout);
