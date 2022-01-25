import { PrismaClient } from '@prisma/client';

import AttendanceService from '../modules/attendance/service';
import Email from '../modules/email';
import UserService from '../modules/user/service';

/**
 * An independent Prisma client, different from the one which the
 * API uses.
 */
const prisma = new PrismaClient();

/**
 * Fetches all users, then check if they are already signed out for today.
 */
async function main() {
  console.log('Reminder Cloud Function starting...');

  // Declare needed variables.
  const today = new Date();
  const users = await UserService.getUsers();

  // Ensure that the `reminders` array is fileld with parallel processing.
  const reminders = await Promise.all(
    users.map(async (user) => {
      const hasCheckedIn = await AttendanceService.checked(
        today,
        user.userID,
        'in'
      );
      if (!hasCheckedIn) {
        return undefined;
      }

      const hasCheckedOut = await AttendanceService.checked(
        today,
        user.userID,
        'out'
      );
      if (hasCheckedOut) {
        return undefined;
      }

      return { email: user.email, name: user.fullName };
    })
  );

  // Send email with parallel processing.
  await Promise.all(
    reminders.map(async (reminder) => {
      if (!reminder) return;

      await new Email(reminder.email, reminder.name).sendReminder();
    })
  );
}

main()
  .then(() => {
    console.log('Reminder Cloud Function has finished running.');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
