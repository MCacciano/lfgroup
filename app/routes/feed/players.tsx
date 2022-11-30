import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { db } from '~/utils/db.server';

type FeedLoaderData = {
  players: {
    id: string;
    username: string;
  }[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const players = await db.user.findMany();

  return json({ players });
};

export default function PlayersFeed() {
  const data: FeedLoaderData = useLoaderData();

  return (
    <div>
      {data?.players.map(player => {
        return (
          <div key={player.id} className="border-b border-black h-44 p-2 hover:bg-gray-100">
            {player.username}
          </div>
        );
      })}
    </div>
  );
}
