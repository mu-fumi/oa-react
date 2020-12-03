import PeopleSelect from '@/components/PeopleSelect';
import React, { useState } from 'react';

export default () => {
  const [value, setValue] = useState([] as number[]);
  const [value2, setValue2] = useState([1] as number[]);
  const [value3, setValue3] = useState([] as number[]);

  setTimeout(() => {
    setValue([1, 3]);
  }, 1000);

  return (
    <div>
      <PeopleSelect
        value={value}
        style={{
          minWidth: '200px',
        }}
        mode="multiple"
        unFilterUsers={[]}
      />
      <PeopleSelect
        value={value2}
        style={{
          minWidth: '200px',
        }}
        mode="multiple"
        unFilterUsers={[]}
        onChange={val => {
          setValue2(val);
        }}
      />
      <PeopleSelect
        value={value3}
        style={{
          minWidth: '200px',
        }}
        mode="multiple"
        onChange={val => {
          setValue3(val);
        }}
      />
    </div>
  );
};
