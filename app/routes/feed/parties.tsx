import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { db } from '~/utils/db.server';

type FeedLoaderData = {
  parties: {
    id: string;
    name: string;
  }[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const parties = await db.party.findMany();

  return json({ parties });
};

export default function PartyFeed() {
  const data: FeedLoaderData = useLoaderData();

  console.log('data', data);

  return (
    <div>
      {data?.parties.map((party: { id: string; name: string }) => {
        return (
          <div key={party.id} className="border-b border-black h-44 p-2 hover:bg-gray-100">
            {party.name}
          </div>
        );
      })}
    </div>
  );
}
