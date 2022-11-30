import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { PlusCircleIcon, UserIcon, UsersIcon } from '@heroicons/react/20/solid';

import { db } from '~/utils/db.server';
import { getUser } from '~/utils/session.server';

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

  return (
    <div className="absolute inset-0 flex max-w-screen-xl mx-auto" style={{ paddingTop: '65px' }}>
      <div className="w-1/6 sm:w-1/5 md:w-1/4">
        <ul className="flex flex-col items-center font-rubik text-lg md:text-xl">
          <li>
            <Link to="/feed/parties" className="flex items-center gap-x-4 p-4 ">
              <UsersIcon className="w-8" />
              <p className="hidden sm:block flex-1">Parties</p>
            </Link>
          </li>
          <li>
            <Link to="/feed/players" className="flex items-center gap-x-4 p-4">
              <UserIcon className="w-8" />
              <p className="hidden sm:block flex-1">Players</p>
            </Link>
          </li>
          {!!data.user && (
            <li className="flex items-center gap-x-4 p-2 border border-gray-900 rounded-full sm:rounded shadow-md cursor-pointer transform hover:scale-105">
              <p className="hidden text-base sm:inline">Create</p>
              <PlusCircleIcon className="w-6" />
            </li>
          )}
        </ul>
      </div>
      <div className="w-full md:w-1/2 flex-1 overflow-y-scroll border-r border-l border-black">
        <Outlet />
      </div>
      <div className="w-0 md:w-1/4"></div>
    </div>
  );
}
