import React from 'react';
import { Card } from 'antd';
import PeopleSelect, { PeopleSelectProps } from '@/components/PeopleSelect';
import { OptionData } from 'rc-select/lib/interface';
import { ISearchedUser } from '@/services/search';

interface RawValue {
  member_id: number;
  role_id?: number;
  start_at?: string;
  end_at?: string;
  working_days?: string;
}

interface ProjectMembersSelectProps
  extends Omit<PeopleSelectProps<number[]>, 'value' | 'onChange'> {
  value?: RawValue[];
  onChange?: (newVal: RawValue[], oldValue?: RawValue[]) => void;
}

const ProjectMembersSelect: React.FC<ProjectMembersSelectProps> = props => {
  const { value, onChange, ...otherProps } = props;
  const selectVal = value?.map(item => item.member_id) || [1];

  const handSelectMambers = (newSelectVal: number[], options: any) => {
    console.log(options);
    onChange &&
      onChange(
        newSelectVal.map(item => ({
          member_id: item,
        })),
        value,
      );
  };

  return (
    <Card
      title="成员信息"
      extra={
        <PeopleSelect
          {...otherProps}
          style={{ width: '400px' }}
          maxTagCount={2}
          mode="multiple"
          value={selectVal}
          onChange={handSelectMambers}
        />
      }
    ></Card>
  );
};

export default ProjectMembersSelect;
