import { nanoid } from 'nanoid/async';

/**
 * Number of data to be generated.
 */
const numberOfData = 100000;

/**
 * Finds the duplicates in a map and prints the colliding array to standard output.
 *
 * @param map - Map.
 * @param name - Name of the function.
 */
function findDuplicates(map: Map<string, number>, name: string) {
  const iterator = map.entries();
  let next = iterator.next();
  let count = 0;

  do {
    if (next.value[1] > 1) {
      console.log(`Collision in ${name}: ${next.value}.`);
      count += 1;
    }

    next = iterator.next();
  } while (!next.done);

  console.log(`Number of counts in ${name}: ${count}.`);
}

/**
 * Insert items to a map for duplicate checking.
 *
 * @param items - Array of strings.
 * @returns A new map consisting of information about duplicates.
 */
function insertToMap(items: string[]) {
  const map = new Map<string, number>();

  items.map((item) => {
    const times = map.get(item);
    if (times) {
      map.set(item, times + 1);
      return;
    }

    map.set(item, 1);
  });

  return map;
}

function mathRandomTest() {
  // Generate 6 digits random number.
  const secrets = [...new Array(numberOfData)].map(() =>
    Math.floor(Math.random() * 899999 + 100000).toString()
  );

  // Insert to map.
  const map = insertToMap(secrets);

  // Iterate to find duplicates.
  findDuplicates(map, 'mathRandomTest()');
}

/**
 * Test collisions for secrets.
 */
async function secretCollisionTest() {
  // Generate with NanoID.
  const secrets = await Promise.all(
    [...new Array(numberOfData)].map(async () => nanoid())
  );

  // Insert to map.
  const map = insertToMap(secrets);

  // Iterate throughout the map to get double occurences.
  findDuplicates(map, 'secretCollisionTest()');
}

/**
 * Driver code.
 */
async function main() {
  await Promise.all([secretCollisionTest(), mathRandomTest()]);
}

main().then(() => console.log('Program finished running.'));
