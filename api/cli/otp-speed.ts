/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'node:fs';
import path from 'node:path';

/**
 * Get data by doing (your logs have to be populated):
 * - `cd attendance/api/dist/logs`.
 * - `grep "HTTP PUT /api/v1/auth/otp" traffic.log`
 * - `touch file.json`
 * - Copy the output to the `file.json` file to this directory.
 * - `cd` to this directory.
 * - `sed '1s/^/[/;$!s/$/,/;$s/$/]/' file.json`
 * - Copy the output and overwrite it in `file.json`.
 * - `yarn otp-speed`
 */
function main() {
  const file = fs.readFileSync(path.join(__dirname, 'file.json'), 'utf-8');
  const data = JSON.parse(file);
  const times = data.map((d: any) => d.meta.responseTime);
  const sum = times.reduce((a: number, b: number) => a + b, 0);
  const average = sum / times.length || 0;

  console.log(`Times: ${[...times]} (total ${times.length}).`);
  console.log(
    `Average of response time with RFC 6238/7617 (minus latency): ${average}ms.`
  );
}

main();
