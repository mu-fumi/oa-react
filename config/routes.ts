import { IRoute } from 'umi';

export const routes: IRoute[] = [
    {
        path: '/user',
        component: '@/layouts/UserLayout',
        routes: [
            {
                path: '/user',
                redirect: '/user/login',
            },
            {
                path: 'login',
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
                    {
                        path: '/project',
                        perm: 'project',
                        name: '项目管理',
                        component: '@/layouts/SecMenu',
                        routes: [
                            {
                                path: 'main',
                                perm: 'project.main',
                                name: '项目主页',
                                component: '@/pages/project/Main',
                            },
                            {
                                path: 'list',
                                perm: 'project.list',
                                name: '项目列表',
                                component: '@/pages/project/List',
                            },
                            {
                                path: 'info',
                                perm: 'project.list',
                                hideInMenu: true,
                                name: '项目详情',
                                component: '@/pages/project/Info',
                            },
                            {
                                path: 'add',
                                perm: 'project.add',
                                hideInMenu: true,
                                name: '项目新增',
                                component: '@/pages/project/Edit',
                            },
                            {
                                path: 'edit/:id',
                                perm: 'project.edit',
                                hideInMenu: true,
                                name: '项目新增',
                                component: '@/pages/project/Edit',
                            },
                            {
                                component: './404',
                            },
                        ],
                    },
                    {
                        path: '/admin',
                        perm: 'admin',
                        name: '后台',
                        component: '@/layouts/BlankLayout',
                        routes: [
                            {
                                path: 'sysmanage',
                                perm: 'admin',
                                name: '组织管理',
                                component: '@/layouts/SecMenu',
                                routes: [
                                    {
                                        path: 'main',
                                        perm: 'admin.main',
                                        name: '后台主页',
                                        component: '@/pages/users/users',
                                    },
                                    {
                                        path: 'list',
                                        perm: 'admin.list',
                                        name: '后台列表',
                                        component: '@/pages/users/users',
                                    },
                                    {
                                        path: 'info',
                                        perm: 'admin.list',
                                        hideInMenu: true,
                                        name: '后台详情',
                                        component: '@/pages/users/users',
                                    },
                                    {
                                        path: 'edit',
                                        perm: 'admin.edit',
                                        hideInMenu: true,
                                        name: '后台编辑',
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

                    {
                        path: '/import',
                        component: '@/layouts/BlankLayout',
                        redirect: '/import/people',
                        children: [
                            {
                                path: '/import/people',
                                name: 'ImportPeople',
                                hideInMenu: true,
                                noAvater:true,
                                component: '@/pages/people/ImportPeople'
                            },
                            // {
                            //     path: '/import/price',
                            //     name: 'ImportPrice',
                            //     hideInMenu: true,
                            //     component: '@/pages/users/users'
                            // },
                            // {
                            //     path: '/import/dept',
                            //     hideInMenu: true,
                            //     name: 'ImportDept',
                            //     component: '@/pages/users/users'
                            // }
                        ]
                    },


                    {
                        component: './404',
                    },
                ],
            },
        ],
    },
];
