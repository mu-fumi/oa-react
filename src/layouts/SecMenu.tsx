import { getMenuData } from '@ant-design/pro-layout';
import React from 'react';
import { connect, history, IRoute } from 'umi';
import { Menu } from 'antd';
import { getMatchMenu } from '@umijs/route-utils';
import { ConnectState } from '@/models/connect';
import { MenuInfo } from 'rc-menu/lib/interface';
import { IPremTree } from '@/models/user';
import { checkPrem } from '@/utils/checkPerm';

const style = {
  background: '#fff',
  height: '64px',
  lineHeight: '64px',
};
export interface BasicLayoutProps {
  premTree: IPremTree;
  location: Location;
  route: IRoute;
}
/**
 * use Authorized check all menu item
 */

const BasicLayout: React.FC<BasicLayoutProps> = props => {
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
      <div style={style}>
        <Menu
          className="my-menu"
          onClick={handleClick}
          mode="horizontal"
          selectedKeys={matchedPath}
        >
          {menuData.map(item => (
            <Menu.Item key={item.path}>{item.name}</Menu.Item>
          ))}
        </Menu>
      </div>
      <div className="main-content">{children}</div>
    </>
  );
};

export default connect(({ user }: ConnectState) => ({
  premTree: user.premTree,
}))(BasicLayout);
