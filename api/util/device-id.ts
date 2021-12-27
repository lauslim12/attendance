import DeviceDetector from 'device-detector-js';
import type { Request } from 'express';
import { getClientIp } from 'request-ip';

/**
 * Uses the 'Request' object of Express to parse the user's device information and their IP.
 *
 * @param req - Express.js's request object.
 * @returns A user's device information and their IP address.
 */
const getDeviceID = (req: Request) => {
  const agent = req.headers['user-agent'] ? req.headers['user-agent'] : '';
  const detected = new DeviceDetector().parse(agent);
  const userDevice = `${detected.client?.name} ${detected.client?.version} on ${detected.os?.name}`;

  return {
    device: userDevice,
    ip: getClientIp(req) || 'Unknown IP!',
  };
};

export default getDeviceID;
