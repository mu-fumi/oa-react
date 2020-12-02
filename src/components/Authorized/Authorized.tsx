import React from 'react';
import { Result } from 'antd';
import { checkPermRender } from '@/utils/checkPerm';
import { IPremTree } from '@/models/user';
import AuthorizedRoute from './AuthorizedRoute';

interface AuthorizedProps {
  perm: string;
  premTree: IPremTree;
  noMatch?: React.ReactNode;
}

type IAuthorizedType = React.FC<AuthorizedProps> & {
  checkPermRender: typeof checkPermRender;
  AuthorizedRoute: typeof AuthorizedRoute;
};

const Authorized: React.FC<AuthorizedProps> = ({
  children,
  perm,
  premTree,
  noMatch = (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
    />
  ),
}) => {
  const childrenRender: React.ReactNode =
    typeof children === 'undefined' ? null : children;
  const dom = checkPermRender(perm, premTree, childrenRender, noMatch);
  return <>{dom}</>;
};

export default Authorized as IAuthorizedType;
