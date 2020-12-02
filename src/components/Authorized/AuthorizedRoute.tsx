import { Redirect, Route } from 'umi';
import React from 'react';
import { IPremList } from '@/models/user';
import Authorized from './Authorized';

interface AuthorizedRouteProps {
  permList: IPremList;
  component: React.ComponentClass<any, any>;
  render: (props: any) => React.ReactNode;
  redirectPath: string;
  perm: string;
}

const AuthorizedRoute: React.FC<AuthorizedRouteProps> = ({
  component: Component,
  render,
  permList,
  perm,
  redirectPath,
  ...rest
}) => (
  <Authorized
    perm={perm}
    permList={permList}
    noMatch={
      <Route
        {...rest}
        render={() => <Redirect to={{ pathname: redirectPath }} />}
      />
    }
  >
    <Route
      {...rest}
      render={(props: any) =>
        Component ? <Component {...props} /> : render(props)
      }
    />
  </Authorized>
);

export default AuthorizedRoute;
