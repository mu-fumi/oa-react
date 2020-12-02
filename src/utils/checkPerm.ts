import { IPremTree } from '@/models/user';
import React from 'react';
import { isBoolean } from 'lodash';

const checkPrem = (perm: string, premTree: IPremTree): boolean => {
  let flag = true;
  if (!perm) {
    flag = true;
  } else if (typeof perm === 'string') {
    const permArray = perm.split('.');
    let matchPerm: IPremTree | boolean = premTree;
    for (let i = 0; i < permArray.length; i++) {
      matchPerm = isBoolean(matchPerm) ? matchPerm : matchPerm?.[permArray[i]];
    }
    flag = !!matchPerm;
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
 * @param { 你的权限 | Your permission description } premTree
 * @param { 通过的组件 | Passing components } target
 * @param { 未通过的组件 | no pass components } Exception
 */

const checkPermRender = <T, K>(
  perm: string,
  premTree: IPremTree,
  target: T,
  Exception: K,
): T | K | React.ReactNode => {
  if (checkPrem(perm, premTree)) {
    return target;
  }
  return Exception;
};

export { checkPermRender, checkPrem };
