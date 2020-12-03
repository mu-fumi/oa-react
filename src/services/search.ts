import { PageRequestRes, RequestRes } from '@/interface';
import request from '@/utils/request';

interface ISearchUsersParams {
  pageSize?: number;
  pageNo?: number;
  keywords?: string;
  un_filter_user?: number[];
  all_user?: 1 | 0;
}

export interface ISearchedUser {
  avatar: string;
  base_city: string;
  deleted_at: string;
  dept_name: string;
  email: string;
  employment_form: string;
  entry_date: string;
  fill_dept_name: string;
  is_leave: number;
  mobile: string;
  pinyin: string;
  pinyin_first: string;
  position: string;
  py_first: string;
  staff_sn: string;
  userid: number;
  username: string;
}

export async function searchUsers(
  params: ISearchUsersParams,
): Promise<PageRequestRes<ISearchedUser>> {
  return request('/user/list_paging', {
    params,
  });
}

export async function loadUsers(
  list: number[],
): Promise<RequestRes<ISearchedUser[]>> {
  return request('/user/listSearch', {
    params: {
      list,
    },
  });
}
