import ProLayout, {
  getMenuData,
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from '@ant-design/pro-layout';
import RightContent from '@/components/GlobalHeader/RightContent';
import React, { useMemo, useCallback } from 'react';
import { Link, connect, Dispatch, history } from 'umi';
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
        <Link to="/users">去登录</Link>
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
  const menuData = current.menuData;

  // get children authority
  const authorized = useMemo(() => {
    return (
      getMatchMenu(location.pathname || '/', menuData).pop() || {
        perm: undefined,
      }
    );
  }, [menuData, location.pathname]);

  /**
   * 默认跳转路由处理
   * 取已匹配路由
   *  无子路由则正常，有子路由则跳转到子路由
   *  无匹配路由则取顶级菜单跳转
   */
  const activeRouters = authorized.path ? authorized.children : menuData;
  if (activeRouters?.length) {
    const atctiveMatched = activeRouters?.filter(
      item =>
        checkPrem(item.perm, premTree) && !item.hideInMenu && !item.redirect,
    )[0];
    atctiveMatched?.path && history.push(atctiveMatched.path);
  }

  const menuDataRender = useCallback(
    (menuList: MenuDataItem[]): MenuDataItem[] => {
      if (authorized.onlyLogo) {
        return [];
      }
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
    [premTree, authorized],
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
      rightContentRender={() => {
        return !authorized.onlyLogo ? <RightContent /> : null;
      }}
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
