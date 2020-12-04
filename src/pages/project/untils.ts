import { DataNode } from 'rc-tree-select/lib/interface';

interface NestOption {
  parentId?: string | number | null;
  parentIdField?: string;
  labelFidel?: string;
  curIdField?: string;
}

export function nest(
  items: { [key: string]: any }[],
  option: NestOption = {},
): DataNode[] {
  const {
    parentId = null,
    labelFidel = 'name',
    curIdField = 'id',
    parentIdField = 'parent_id',
  } = option;
  return items
    .filter(item => item[parentIdField] === parentId)
    .map(item => ({
      ...item,
      title: item[labelFidel],
      value: item[curIdField],
      children: nest(items, {
        ...option,
        parentId: item[curIdField],
      }),
    }));
}
