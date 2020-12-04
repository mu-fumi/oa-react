import React from 'react';
import { Select, Divider } from 'antd';
import { SelectProps, SelectValue } from 'antd/lib/select';
import { OptionData } from 'rc-select/lib/interface';
import { uniqBy } from 'lodash';
import { ISearchedUser, loadUsers, searchUsers } from '@/services/search';

interface PeopleSelectStates {
  userList: ISearchedUser[];
}
export interface PeopleSelectProps<VT> extends SelectProps<VT> {
  unFilterUsers?: number[];
  allUser?: boolean;
}

export default class PeopleSelect<
  VT extends SelectValue = SelectValue
> extends React.Component<PeopleSelectProps<VT>> {
  state: PeopleSelectStates = {
    userList: [],
  };
  private get options(): OptionData[] {
    const { userList } = this.state;
    return userList.map(user => ({
      ...user,
      label: `${user.py_first}:${user.username}-${user.dept_name}-${user.position}`,
      value: user.userid,
    }));
  }
  private hasLoadedDeftault = false;
  private keywords = '';
  private page = {
    pageNo: 1,
    pageSize: 20,
  };

  componentDidMount() {
    console.log('nnn');
    this.defaultDataUpdate();
  }

  componentDidUpdate() {
    this.defaultDataUpdate();
  }

  private defaultDataUpdate() {
    const { value } = this.props;
    if (Array.isArray(value) && !this.hasLoadedDeftault && value.length) {
      this.hasLoadedDeftault = true;
      loadUsers(value as number[]).then(res => {
        this.changeOptions(res.result);
      });
    }
  }

  private changeOptions = (
    users: ISearchedUser[],
    preUsers: ISearchedUser[] = [],
  ) => {
    this.setState({
      userList: uniqBy([...preUsers, ...users], 'userid'),
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
    }).then(res => {
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
    const { userList } = this.state;
    this.page.pageNo += 1;
    this.fetchUser().then(res => {
      this.changeOptions(res, userList);
    });
  };
  render() {
    const { unFilterUsers, allUser, ...otherProps } = this.props;

    return (
      <Select
        {...otherProps}
        options={this.options}
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
