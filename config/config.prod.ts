
import { defineConfig } from 'umi';

export default defineConfig({
    define: {
        'process.env.NODE_ENV': 'production',
        'process.env.APP_API_BASE_URL': 'http://oa.ichtx.com'
    },
});

