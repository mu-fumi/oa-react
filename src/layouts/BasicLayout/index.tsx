import ProLayout, {
  getMenuData,
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from '@ant-design/pro-layout';
import RightContent from '@/components/GlobalHeader/RightContent';
import React, { useMemo, useCallback } from 'react';
import { Link, connect, Dispatch } from 'umi';
import { Result, Button } from 'antd';
import Authorized from '@/components/Authorized';
import { ConnectState } from '@/models/connect';
import { getMatchMenu } from '@umijs/route-utils';
import { IPremTree } from '@/models/user';
import { checkPrem } from '@/utils/checkPerm';
import style from './index.less';

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
export interface BasicLayoutProps {
  premTree: IPremTree;
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
  const { children, route, premTree, location, settings } = props;

  const current = getMenuData(route?.routes || []);
  const menuData = current.menuData.filter(
    item =>
      checkPrem(item.perm, premTree) && !item.hideInMenu && !item.redirect,
  );

  // get children authority
  const authorized = useMemo(() => {
    return (
      getMatchMenu(location.pathname || '/', menuData).pop() || {
        perm: undefined,
      }
    );
  }, [menuData, location.pathname]);

  const menuDataRender = useCallback(
    (menuList: MenuDataItem[]): MenuDataItem[] => {
      return menuList.map(item => {
        const localItem = {
          ...item,
          children: item.children ? menuDataRender(item.children) : undefined,
        };
        // 拦截最后一层路由
        return (item.children
          ? Authorized.checkPermRender(item.perm, premTree, localItem, null)
          : null) as MenuDataItem;
      });
    },
    [premTree],
  );

  return (
    <ProLayout
      className={style.mainLayout}
      logo={null}
      menuDataRender={menuDataRender}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || !menuItemProps.path) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      rightContentRender={() => <RightContent />}
      {...props}
      {...settings}
    >
      <Authorized perm={authorized.perm} premTree={premTree} noMatch={noMatch}>
        {children}
      </Authorized>
    </ProLayout>
  );
};

export default connect(({ user, settings }: ConnectState) => ({
  premTree: user.premTree,
  settings,
}))(BasicLayout);
