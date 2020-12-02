import { Settings as ProSettings } from '@ant-design/pro-layout';

type DefaultSettings = Partial<ProSettings> & {
  pwa: boolean;
};

const proSettings: DefaultSettings = {
  navTheme: 'dark',
  primaryColor: '#1890ff',
  layout: 'topmenu',
  contentWidth: 'Fixed',
  fixedHeader: false,
  fixSiderbar: true,
  title: '腾云忆想',
  pwa: false,
  iconfontUrl: '',
};

export { DefaultSettings };

export default proSettings;
