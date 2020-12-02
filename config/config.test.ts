import { defineConfig } from 'umi';
import { routes } from './routes';


const plugins = ['transform-remove-console'];

export default defineConfig({
    define: {
        'process.env.NODE_ENV': 'production',
        'process.env.APP_API_BASE_URL': 'http://118.24.47.141'
    },
    antd: {},
    dva: {
        hmr: true,
    },
    locale: false,
    dynamicImport: {
        loading: '@/components/PageLoading',
    },
    extraBabelPlugins: plugins,
    nodeModulesTransform: {
        type: 'none',
    },
    routes,

    // 配置 external
    externals: {
        react: 'window.React',
        'react-dom': 'window.ReactDOM',
        moment: 'moment',
        echarts: 'echarts',
    },
    // 引入被 external 库的 scripts
    // 区分 development 和 production，使用不同的产物
    scripts: [
        '//cdn.jsdelivr.net/npm/react@17.0.1/umd/react.development.js',
        '//cdn.jsdelivr.net/npm/react-dom@17.0.1/umd/react-dom.development.js',
        '//cdn.jsdelivr.net/npm/moment@2.29.1/moment.min.js',
        '//cdn.jsdelivr.net/npm/moment@2.29.1/locale/zh-cn.js',
        // '//cdn.jsdelivr.net/npm/antd@4.9.0/lib/index.min.js',
        '//cdn.jsdelivr.net/npm/echarts@4.9.0/dist/echarts.min.js',
    ],

    chainWebpack(config, { env, webpack, createCSSRule }) {
        config.module
            .rule('images')
            .test(/\.(jpg|png|gif)$/)
            .use('url-loader')
            .loader('url-loader')
            .options({
                limit: 10,
                // 以下配置项用于配置file-loader
                // 根据环境使用cdn或相对路径
                publicPath: process.env.NODE_ENV === 'production' ? '' : '',
                // 将图片打包到dist/img文件夹下, 不配置则打包到dist文件夹下
                outputPath: 'images',
                // 配置打包后图片文件名
                name: '[name].[hash:8].[ext]',
            })
            .end();
    },
});

