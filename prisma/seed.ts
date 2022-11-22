import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function seed() {
  await db.user.createMany({ data: getUsers() });
  const dbUsers = await db.user.findMany();

  await Promise.all(
    dbUsers.map(async (user: { id: string; username: string }) => {
      await db.userProfile.create({ data: { userId: user.id } });
      await db.party.create({ data: { name: `${user.username}'s Party`, creatorId: user.id } });
    })
  );
}

function getUsers() {
  return [
    {
      email: 'magick.mozzey@gmail.com',
      username: `mozzey`,
      passwordHash: '$2a$10$2Du3/L5CFr3Mu6C0z/RClubgR8DLfbcmV3siDY/oQmiPuRRPMh0eW',
    },
    {
      email: 'luxary99@gmail.com',
      username: `matt`,
      passwordHash: '$2a$10$2Du3/L5CFr3Mu6C0z/RClubgR8DLfbcmV3siDY/oQmiPuRRPMh0eW',
    },
    {
      email: 'user1@test.com',
      username: 'user 1',
      passwordHash: '$2a$10$2Du3/L5CFr3Mu6C0z/RClubgR8DLfbcmV3siDY/oQmiPuRRPMh0eW',
    },
    {
      email: 'user2@test.com',
      username: 'user 2',
      passwordHash: '$2a$10$2Du3/L5CFr3Mu6C0z/RClubgR8DLfbcmV3siDY/oQmiPuRRPMh0eW',
    },
    {
      email: 'user3@test.com',
      username: 'user 3',
      passwordHash: '$2a$10$2Du3/L5CFr3Mu6C0z/RClubgR8DLfbcmV3siDY/oQmiPuRRPMh0eW',
    },
    {
      email: 'user4@test.com',
      username: 'user 4',
      passwordHash: '$2a$10$2Du3/L5CFr3Mu6C0z/RClubgR8DLfbcmV3siDY/oQmiPuRRPMh0eW',
    },
    {
      email: 'user5@test.com',
      username: 'user 5',
      passwordHash: '$2a$10$2Du3/L5CFr3Mu6C0z/RClubgR8DLfbcmV3siDY/oQmiPuRRPMh0eW',
    },
    {
      email: 'user6@test.com',
      username: 'user 6',
      passwordHash: '$2a$10$2Du3/L5CFr3Mu6C0z/RClubgR8DLfbcmV3siDY/oQmiPuRRPMh0eW',
    },
    {
      email: 'user7@test.com',
      username: 'user 7',
      passwordHash: '$2a$10$2Du3/L5CFr3Mu6C0z/RClubgR8DLfbcmV3siDY/oQmiPuRRPMh0eW',
    },
    {
      email: 'user8@test.com',
      username: 'user 8',
      passwordHash: '$2a$10$2Du3/L5CFr3Mu6C0z/RClubgR8DLfbcmV3siDY/oQmiPuRRPMh0eW',
    },
    {
      email: 'user9@test.com',
      username: 'user 9',
      passwordHash: '$2a$10$2Du3/L5CFr3Mu6C0z/RClubgR8DLfbcmV3siDY/oQmiPuRRPMh0eW',
    },
    {
      email: 'user10@test.com',
      username: 'user 10',
      passwordHash: '$2a$10$2Du3/L5CFr3Mu6C0z/RClubgR8DLfbcmV3siDY/oQmiPuRRPMh0eW',
    },
    {
      email: 'user11@test.com',
      username: 'user 11',
      passwordHash: '$2a$10$2Du3/L5CFr3Mu6C0z/RClubgR8DLfbcmV3siDY/oQmiPuRRPMh0eW',
    },
  ];
}

function getParties(id: string) {
  return [];
}

seed();
