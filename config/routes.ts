import { IRoute } from 'umi'


export const routes: IRoute[] = [
    {
        exact: false, path: '/', component: '@/layouts/index/index',
        routes: [
            { exact: true, path: '/', component: '@/pages/users/users' },
            { exact: true, path: '/users', component: '@/pages/index/index' },
        ],
    }
]