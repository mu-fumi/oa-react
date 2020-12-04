import { RequestRes } from '@/interface';
import request from '@/utils/request';

export async function createProject(data: any) {
  return request('/project/create', {
    method: 'POST',
    data,
  });
}
export async function fetchProjectCost(
  data: any,
): Promise<RequestRes<{ cost: number }>> {
  return request('/project/compute_project_cost', {
    method: 'POST',
    data,
  });
}
