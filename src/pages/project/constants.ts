import { getKeys } from '@/utils/utils';
import { OptionData } from 'rc-select/lib/interface';

export const projectStatusText = {
  2: '进行中',
  3: '完成',
  4: '关闭',
};

export enum projectTypeEnum {
  delivery = 1,
  self,
}

export const projectStatusOptions: OptionData[] = getKeys(
  projectStatusText,
).map(key => ({
  value: Number(key),
  label: projectStatusText[key],
}));

export enum projectStatusEnum {
  ongoing = 2,
  complete,
  close,
}
