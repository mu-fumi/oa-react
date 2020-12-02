import { IPremList } from '@/models/user';
import React from 'react';

const checkPrem = (perm: string, permList: IPremList): boolean => {
  let flag = true;
  if (!perm) {
    flag = true;
  } else if (typeof perm === 'string') {
    if (!permList.some(item => perm === item)) {
      flag = false;
    }
  } else {
    flag = false;
    throw new Error('unsupported parameters');
  }
  return flag;
};

/**
 * 通用权限检查方法
 * Common check permissions method
 * @param { 权限判定 | Permission judgment } perm
 * @param { 你的权限 | Your permission description } permList
 * @param { 通过的组件 | Passing components } target
 * @param { 未通过的组件 | no pass components } Exception
 */

const checkPermRender = <T, K>(
  perm: string,
  permList: IPremList,
  target: T,
  Exception: K,
): T | K | React.ReactNode => {
  if (checkPrem(perm, permList)) {
    return target;
  }
  return Exception;
};

export { checkPermRender, checkPrem };
