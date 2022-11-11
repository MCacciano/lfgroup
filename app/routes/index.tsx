import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getUser } from '~/utils/session.server';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  return json(user);
};

export default function Index() {
  const data = useLoaderData();

  console.log('data', data);

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
