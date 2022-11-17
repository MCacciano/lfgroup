import type { MetaFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getUser } from '~/utils/session.server';
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';

import styles from './styles/app.css';

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'LFGroup',
  viewport: 'width=device-width,initial-scale=1',
});

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  return json(user);
};

// temporary nav jsx to test user data with login/logout
export default function App() {
  const data = useLoaderData();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <nav className="border-b border-gray-900 font-rubik">
          <div className="flex justify-evenly p-5">
            <div className="flex-1 flex justify-start">
              <Link to="/">LFGroup</Link>
            </div>
            <div className="flex-1 flex justify-end gap-4">
              {data?.username ? (
                <>
                  <p>{data?.username}</p>
                  <form action="/logout" method="post">
                    <button type="submit">Logout</button>
                  </form>
                </>
              ) : (
                <Link to="/login">Login</Link>
              )}
            </div>
          </div>
        </nav>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
