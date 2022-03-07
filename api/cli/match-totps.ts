import {
  generateDefaultTOTP,
  generateOwnOTP,
  validateDefaultTOTP,
  verifyOwnTOTP,
} from '../core/rfc6238';

/**
 * Runs a function to know whether my understanding of OTPs is the same as
 * the experts who created the libraries.
 */
function main() {
  // Initialize default values.
  const period = 30;
  const digits = 6;
  const sec = 'match-totps-test';
  const label = 'match-totps-test';
  const issuer = 'test';
  const algorithm = 'SHA1';
  const counter = Date.now() / 1000 / period;
  const window = 2;

  // Run generation test.
  const withLibrary = generateDefaultTOTP(issuer, sec).token;
  const withoutLibrary = generateOwnOTP(counter, {
    issuer,
    label,
    algorithm,
    digits,
    period,
    secret: sec,
  }).token;

  if (withLibrary === withoutLibrary) {
    console.log(`Generated equal: ${withLibrary} and ${withoutLibrary}`);
  } else {
    console.log(`Generated not equal: ${withLibrary} and ${withoutLibrary}`);
  }

  // Test for verification as well.
  const withLibraryVerification = validateDefaultTOTP(withLibrary, sec);
  const withoutLibraryVerification = verifyOwnTOTP(withoutLibrary, window, {
    issuer,
    label,
    algorithm,
    digits,
    period,
    secret: sec,
  });

  if (withLibraryVerification === withoutLibraryVerification) {
    console.log(
      `Verified equal: ${withLibraryVerification} and ${withoutLibraryVerification}.`
    );
  } else {
    console.log(
      `Verified not equal: ${withLibraryVerification} and ${withoutLibraryVerification}.`
    );
  }
}

main();
