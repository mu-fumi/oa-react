import { Redirect, Route } from 'umi';
import React from 'react';
import { IPremTree } from '@/models/user';
import Authorized from './Authorized';

interface AuthorizedRouteProps {
  premTree: IPremTree;
  component: React.ComponentClass<any, any>;
  render: (props: any) => React.ReactNode;
  redirectPath: string;
  perm: string;
}

const AuthorizedRoute: React.FC<AuthorizedRouteProps> = ({
  component: Component,
  render,
  premTree,
  perm,
  redirectPath,
  ...rest
}) => (
  <Authorized
    perm={perm}
    premTree={premTree}
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
