import { getMenuData } from '@ant-design/pro-layout';
import React, { useMemo, useCallback } from 'react';
import { Link, connect, history, IRoute } from 'umi';
import { Result, Button, Menu } from 'antd';
import Authorized from '@/components/Authorized';
import { getMatchMenu } from '@umijs/route-utils';
import { ConnectState } from '@/models/connect';
import { MenuInfo } from 'rc-menu/lib/interface';
import { IPremTree } from '@/models/user';
import { checkPrem } from '@/utils/checkPerm';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/users">Go Login</Link>
      </Button>
    }
  />
);
export interface HeadderProps {
  premTree: IPremTree;
  location: Location;
  route: IRoute;
}
/**
 * use Authorized check all menu item
 */

const Header: React.FC<HeadderProps> = props => {
  const {
    children,
    premTree,
    route,
    location = {
      pathname: '/',
    },
  } = props;

  const current = getMenuData(route?.routes || []);

  const menuData = current.menuData.filter(
    item =>
      checkPrem(item.perm, premTree) && !item.hideInMenu && !item.redirect,
  );

  const handleClick = (e: MenuInfo) => {
    history.push(e.key);
  };

  const matchedPath = getMatchMenu(location.pathname || '/', menuData)
    .map(item => item.path)
    .filter(item => item) as string[];

  return (
    <>
      <Menu
        theme="dark"
        onClick={handleClick}
        mode="horizontal"
        selectedKeys={matchedPath}
      >
        {menuData.map(item => (
          <Menu.Item key={item.path}>{item.name}</Menu.Item>
        ))}
      </Menu>
    </>
  );
};

export default Header;
