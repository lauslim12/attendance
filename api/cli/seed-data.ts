import { Prisma, PrismaClient } from '@prisma/client';

import config from '../config';
import { generateTOTP } from '../core/rfc6238';
import { hashPassword } from '../util/passwords';

const prisma = new PrismaClient();

/**
 * All sample users for development purposes.
 */
async function loadData(): Promise<Prisma.UserCreateInput[]> {
  return [
    {
      username: 'admin',
      email: 'admin@attendance.com',
      phoneNumber: '0823-1122-3344',
      password: await hashPassword('test1234'),
      totpSecret: '1234',
      fullName: 'Admin Attendance',
      role: 'admin',
    },
    {
      username: 'sayu',
      email: 'sayu@mail.co.jp',
      phoneNumber: '0811-2222-3333',
      password: await hashPassword('test1234'),
      totpSecret: '5678',
      fullName: 'Sayu Ogiwara',
    },
    {
      username: 'Chizuru',
      email: 'chizuru@mail.co.jp',
      phoneNumber: '0890-4455-6677',
      password: await hashPassword('test1234'),
      totpSecret: 'abcd',
      fullName: 'Chizuru Ichinose',
    },
  ];
}

/**
 * Driver code.
 * 1. Seed all data to DB.
 * 2. Generate OTPAuth strings to be converted to QR.
 */
async function main() {
  const users = await loadData();

  await prisma.user.deleteMany();
  await prisma.user.createMany({ data: users });

  const totpStrings = users.map((user) =>
    generateTOTP({
      issuer: config.TOTP_ISSUER,
      label: user.username,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: user.totpSecret,
    })
  );

  console.log('Database seeded successfully.');
  console.log('OTP strings are as follows (generate these into QR codes):');
  console.log(totpStrings);
}

/**
 * Call driver code.
 */
main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
