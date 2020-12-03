import React, { useEffect, useState } from 'react';
import { Select, Divider } from 'antd';
import { SelectProps, SelectValue } from 'antd/lib/select';
import { OptionData } from 'rc-select/lib/interface';
import { uniqBy } from 'lodash';
import {
  ISearchedUser,
  ISearchUsersRes,
  loadUsers,
  searchUsers,
} from '@/services/search';

interface PeopleSelectProps<VT> extends SelectProps<VT> {
  unFilterUsers?: number[];
  allUser?: boolean;
}

export default class PeopleSelect<
  VT extends SelectValue = SelectValue
> extends React.Component<PeopleSelectProps<VT>> {
  state = {
    options: [],
  };
  private hasLoadedDeftault = false;
  private keywords = '';
  private page = {
    pageNo: 1,
    pageSize: 20,
  };

  componentDidMount() {
    this.loadDefaultOptions();
  }

  componentDidUpdate() {
    this.loadDefaultOptions();
  }

  private loadDefaultOptions() {
    const { value } = this.props;
    if (Array.isArray(value) && !this.hasLoadedDeftault && value.length) {
      this.hasLoadedDeftault = true;
      loadUsers(value as number[]).then((res: { result: ISearchedUser[] }) => {
        this.changeOptions(res.result);
      });
    }
  }

  private changeOptions = (
    users: ISearchedUser[],
    options: OptionData[] = [],
  ) => {
    const nextPageOptions = users.map(user => ({
      label: `${user.py_first}:${user.username}-${user.dept_name}-${user.position}`,
      value: user.userid,
    }));
    this.setState({
      options: uniqBy([...options, ...nextPageOptions], 'value'),
    });
  };

  private fetchUser = () => {
    const { unFilterUsers, allUser } = this.props;
    this.hasLoadedDeftault = true;
    return searchUsers({
      ...this.page,
      keywords: this.keywords,
      un_filter_user: unFilterUsers,
      all_user: allUser ? 1 : 0,
    }).then((res: ISearchUsersRes) => {
      return res.result.data;
    });
  };

  private loadFirstPage = (filter: string) => {
    this.keywords = filter.trim();
    this.page.pageNo = 1;
    this.fetchUser().then(res => {
      this.changeOptions(res);
    });
  };

  private loadNextPage = () => {
    const { options } = this.state;
    this.page.pageNo += 1;
    this.fetchUser().then(res => {
      this.changeOptions(res, options);
    });
  };
  render() {
    const { value, unFilterUsers, allUser, ...otherProps } = this.props;
    const { options } = this.state;

    return (
      <Select
        {...otherProps}
        value={value}
        options={options}
        onFocus={() => this.loadFirstPage('')}
        dropdownRender={menu => (
          <div>
            {menu}
            <Divider style={{ margin: '4px 0' }} />
            <div
              style={{
                display: 'flex',
                cursor: 'pointer',
                flexWrap: 'nowrap',
                padding: 8,
              }}
            >
              <div onClick={this.loadNextPage}>加载更多</div>
            </div>
          </div>
        )}
        onSearch={this.loadFirstPage}
        filterOption={false}
      />
    );
  }
}
const PeopleSelect2: React.FC<PeopleSelectProps<SelectValue>> = props => {
  let hasLoadedDeftault = false;
  const { value, unFilterUsers, allUser, ...otherProps } = props;

  const [options, setOptions] = useState([] as OptionData[]);
  const [params, setParams] = useState({
    pageNo: 1,
    pageSize: 20,
    keywords: '',
  });

  const changeOptions = (
    users: ISearchedUser[],
    options: OptionData[] = [],
  ) => {
    const nextPageOptions = users.map(user => ({
      label: `${user.py_first}:${user.username}-${user.dept_name}-${user.position}`,
      value: user.userid,
    }));
    setOptions(uniqBy([...options, ...nextPageOptions], 'value'));
  };

  useEffect(() => {
    if (Array.isArray(value) && !hasLoadedDeftault && value.length) {
      hasLoadedDeftault = true;
      loadUsers(value as number[]).then((res: { result: ISearchedUser[] }) => {
        changeOptions(res.result);
      });
    }
  }, [value]);

  const fetchUser = () => {
    return searchUsers({
      ...params,
      un_filter_user: unFilterUsers,
      all_user: allUser ? 1 : 0,
    }).then((res: ISearchUsersRes) => {
      return res.result.data;
    });
  };

  const loadFirstPage = (filter: string) => {
    setParams({
      ...params,
      pageNo: 1,
      keywords: filter.trim(),
    });
  };

  const loadNextPage = () => {
    setParams({
      ...params,
      pageNo: params.pageNo + 1,
    });
    fetchUser().then(res => {
      changeOptions(res, options);
    });
  };

  return (
    <Select
      {...otherProps}
      value={value}
      options={options}
      onFocus={() => loadFirstPage('')}
      dropdownRender={menu => (
        <div>
          {menu}
          <Divider style={{ margin: '4px 0' }} />
          <div
            style={{
              display: 'flex',
              cursor: 'pointer',
              flexWrap: 'nowrap',
              padding: 8,
            }}
          >
            <div onClick={loadNextPage}>加载更多</div>
          </div>
        </div>
      )}
      onSearch={loadFirstPage}
      filterOption={false}
    />
  );
};

// export default PeopleSelect;
