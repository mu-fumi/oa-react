import { IRoute } from 'umi';

export const routes: IRoute[] = [
    {
        path: '/users',
        component: '@/layouts/UserLayout',
        routes: [
            {
                path: '/users',
                component: '@/pages/users/login',
            },
        ],
    },
    {
        path: '/',
        component: '@/layouts/SecurityLayout',
        routes: [
          // 默认跳转之后取消在登录之后再去判断有权限的页面跳转
          {
            path: '/',
            redirect: '/project/main',
          },
          { 
            path: '/project',
            perm: 'project',
            component: '@/layouts/BlankLayout',
            routes: [
              {
                path: 'main',
                perm: 'project.main',
                component: '@/pages/users/users',
              },
              {
                path: 'list',
                perm: 'project.list',
                component: '@/pages/users/users',
              },
              {
                path: 'info',
                perm: 'project.list',
                hideInMenu: true,
                component: '@/pages/users/users',
              },
              {
                path: 'edit',
                perm: 'project.edit',
                hideInMenu: true,
                component: '@/pages/users/users',
              },
            ],
          },
          {
            component: './404',
          },
        ],
    },
];
