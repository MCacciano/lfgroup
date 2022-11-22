import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { UserIcon, UsersIcon } from '@heroicons/react/20/solid';

import { db } from '~/utils/db.server';
import { getUser } from '~/utils/session.server';

import Feed from '~/components/Feed';

type FeedLoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  parties: {
    id: string;
    name: string;
  }[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  const parties = await db.party.findMany();

  return json({ user, parties });
};

export default function FeedPage() {
  const data: FeedLoaderData = useLoaderData();

  console.log('data', data);

  return (
    <div className="absolute inset-0 flex max-w-screen-xl mx-auto" style={{ paddingTop: '65px' }}>
      <div className="w-0 sm:w-1/6 md:w-1/4 bg-gray-200">
        <ul className="flex flex-col items-center">
          <li className="flex items-center gap-x-4 p-4 ">
            <UsersIcon width={35} />
            <p className="flex-1 text-2xl">Parties</p>
          </li>
          <li className="flex items-center gap-x-4 p-4 ">
            <UserIcon width={35} />
            <p className="flex-1 text-2xl">Users</p>
          </li>
        </ul>
      </div>
      <div className="w-full md:w-1/2 flex-1 overflow-y-scroll border-r border-l border-black">
        <Feed parties={data?.parties} />
      </div>
      <div className="w-0 md:w-1/4 bg-gray-200"></div>
    </div>
  );
}
