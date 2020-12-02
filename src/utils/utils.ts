import { parse } from 'querystring';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * localStorage 封装
 */
export const ls = {
  set: (key: string, data: any) => {
    if (typeof data === 'object') {
      data = JSON.stringify(data);
    }
    window.localStorage.setItem(key, data);
  },
  get: (key: string) => {
    try {
      return JSON.parse(window.localStorage.getItem(key) as string);
    } catch {
      return window.localStorage.getItem(key);
    }
  },
  cl: (key?: string) => {
    key ? window.localStorage.removeItem(key) : window.localStorage.clear();
  },
};

/**
 * sessionstorage 封装
 */
export const ss = {
  set: (key: string, data: any) => {
    if (typeof data === 'object') {
      data = JSON.stringify(data);
    }
    window.sessionStorage.setItem(key, data);
  },
  get: (key: string) => {
    try {
      return JSON.parse(window.sessionStorage.getItem(key) as string);
    } catch {
      return window.sessionStorage.getItem(key);
    }
  },
  cl: (key: string) => {
    key ? window.sessionStorage.removeItem(key) : window.sessionStorage.clear();
  },
};

/**
 *
 * @param {转化评级菜单树方法} items
 * @param {*} id    顶级id
 * @param {*} link  关联的字段名字  pid 。。。
 */
export function nest(items: any[], id = null, link = 'parent_id'): any {
  return items
    .filter(item => item[link] === id)
    .map(item => ({ ...item, children: nest(items, item.dept_id, link) }));
}
