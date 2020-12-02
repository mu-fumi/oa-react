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
            {
                path: '/',
                component: '@/layouts/BasicLayout',
                routes: [
                    // 默认跳转之后取消在登录之后再去判断有权限的页面跳转
                    {
                        path: '/',
                        redirect: '/logined',
                    },
                    {
                        path: '/logined',
                        perm: 'loginedBase',
                        component: '@/pages/users/users',
                    },
                    {
                        component: './404',
                    },
                ],
            },
            {
                component: './404',
            },
        ],
    },
];
