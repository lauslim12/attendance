# Attendance

Secure API with OTP and Basic Authorization. Implemented as a full-stack application in a unique use-case: attendance system.

## About

This research will focus on creating a highly-secure API that conforms to OWASP Security Best Practices. This research is divided into two subprojects:

- `api` as a Node.js (Express) API. API is a JSON API which also acts as the authorization, authentication, and resource server.
- `web` as a Next.js front-end.

The flow of the API (Request - Response) is as follows:

```bash
Request -> Handler/Router -> Middleware (if applicable) -> Validations (if applicable) -> Controller -> Service -> Prisma (if applicable) -> Controller -> Response
```

- Four layer architecture: Validation and Controller, Service, and ORM (Prisma).
- Global error handler exist in the application. Every error(s) will be thrown to the global error handler to be 'handled'.
- We still have not yet used Dependency Injection for easier testability.

## Features

Below is the list of main features that this system have:

- Users can check the health of the API.
- Users can log in and register.
- Users can get their own authentication status.
- (**A**) Users can see their own profile, modify it (except password), and delete it.
- (**A**) Users can modify their own password.
- (**A**) Users can get all of their own sessions and can invalidate them if necessary.
- (**A**) Users can get their own attendance data.
- (**A**) Users can request OTP from the API via Email, SMS, or Authenticator apps.
- (**A**) Users can receive a special MFA authorization by verifying the OTP.
- (**A C**) Users can update their own MFA secrets in Authenticator apps.
- (**A C**) Users can check in and check out their attendance.
- (**A B**) Admins can see all sessions and can invalidate them manually.
- (**A B C**) Admins can perform CRUD operations on the `User` entity.
- When set up, this system can remind people to log out at a certain time.

Legend:

- **A** means this feature/use-case requires authentication (user have to have a session).
- **B** means this feature/use-case requires a certain role (usually `admin`).
- **C** means this feature/use-case requires a MFA session (user have to have a JWS/JWT).

## Security

As this research focuses on creating a secure API, below are the considerations that are taken during development:

- Users are divided into two roles: `admin` and `user`.
- A special kind of authorized session: `OTPSession`, using JSON Web Tokens (RFC 7519). Having this token means that the user is MFA authenticated. The JSON Web Tokens have a very small lifetime (only about 15 minutes).
- Sessions are signed cookies, implemented with a high-entropy session secret, and served with secure attributes (`secure`, `sameSite`, `httpOnly`). It is regenerated and refreshed in several instances for security.
- Passwords are hashed with `Argon2` algorithm.
- The secret to generate the OTP is implemented with `nanoid` (it has high entropy and it is a cryptographically secure generator), and it is different for every other users in the system. Look at `cli/collision-test.ts` for tests.
- Conforms to RFC 6238 and RFC 7617 (TOTP, Basic Authorization).
- OTP is time-based and it is generated with RFC 6238 algorithm with `SHA-1` hash function and a high-entropy secret (above). OTP is verified with the `userID` via RFC 7617 algorithm. OTPs are for one-time use only (in a certain timeframe).
- User identification generator is based on `uuidv4` algorithm for low-collision user IDs.
- Secure API protection middlewares (`helmet`, `hpp`, JSON-only API with a secure parser, slow downs, rate limiters, XST prevention, XSS prevention, and many more).
- Secure API authorization (session authorization, role-based access control, MFA with JWT/JWS).
- API logging is performed using `morgan`.
- API implementation conforms to JSON:API Standard and provides structured error messages and responses according to the best practices.
- User can be banned by setting their `isActive` attribute to `false`. Banned users cannot access the API.
- No cheap tricks and 'unusual' security through obscurity (double encryption, triple encoding, multiple hashing, and the like). Cryptography/security is used to serve a specific purpose and be an effective solution for that purpose. Incorrect use of said concepts will make the system to be less secure.
- Complete request and response logging with `express-winston` and `winston` for audit purposes and debug purposes.
- Emails are implemented with queue system (Bull) for performance and security.
- Rate limiters and slow downs exist in order to prevent spammers. It is implemented with Redis for persistence and performance.
- Body parser is implemented with a secure option, as it has a definitive limit and has a checker in the form of `Content-Type` and `Content-Length`.
- Prevent attacks like parameter pollution, payload too large, bad JSON, and many more.
- Secure headers are placed in both API and Web. Examples: `Content-Security-Policy`, `X-XSS-Protection`, `X-Content-Type-Options`, and more.

## Documentation

API documentation is available at Postman, and it is under construction for now. All of the codebase in the API is completely documented with TypeScript and JSDoc.

## Requirements

For development, you need the following technologies installed on your machine:

- [Docker](https://www.docker.com/)
- [Node.js 16+](https://nodejs.org/)
- [Yarn 1.22+](https://yarnpkg.com/)
- [Postman Desktop Agent](https://www.postman.com/downloads/) to test things locally
- [Mailtrap](https://mailtrap.io/) to test emails in development environment
- Unix-based systems or MacOS
- Authenticators, such as Google Authenticator, Microsoft Authenticator, etc.

## Development

Please follow the instructions below to set up this application for your local development.

- Clone this GitHub repository.

```bash
git clone git@github.com:lauslim12/attendance.git
```

- Switch to this repository.

```bash
cd attendance
```

- You need Docker in order to provision two of the most important infrastructures: MariaDB and Redis. Docker Compose is dedicated for **development only and it is not for production usage**.

```bash
docker-compose up -d
```

- After this, the next steps will be split in two: API Setup and Web Setup.

### API Setup

- Change directory to the `api` directory.

```bash
cd api
```

- Install all dependencies.

```bash
yarn --frozen-lockfile
```

- Rename `.env.example` to `.env`. You may use the default environment variables that I have already hardcoded for development purposes, and you have no need to configure it further. If you want, you may change environment variables to your liking using the `export` keyword or you may change it at the renamed `.env` file. Do not use these environment variables in production.

```bash
cp .env.example .env
```

- For the JWS, you have to generate a public-private key pair by yourself for the first time. Do so by using the provided script:

```bash
yarn genkeys
```

- You will get the Base64-encoded public-private key pairs for the JWT, and you have to copy it in your `.env` file. Instructions are also provided after that script has finished running in case you forgot.

- Run Prisma migrations and seeders so you can get the database schema that is already populated with the sample data (sample data is at `api/cli/seed-data.ts`). You have to do this every time you turn on the Docker instance, as all data are reset.

```bash
yarn migrate
```

- Transform all of the TOTP strings as QR codes, then scan it in your authenticator application for easy access towards MFA-protected routes (optional). You may use [QR Code Generator](https://www.qr-code-generator.com/) as an external webservice.

- For the first time, you also have to configure [Mailtrap](https://mailtrap.io/) to send emails in development environment. You can register an account there, then create a new inbox, and then import the credentials required (`MAILTRAP_USERNAME`, `MAILTRAP_PASSWORD`, and `MAILTRAP_HOST`) in the `.env` file.

- Run the application in development mode. Please open `localhost:8080` in your browser or start checking the API documentation.

```bash
yarn dev
```

- There are two modes available: `development`, and `production`. The difference is that `development` shows the full error stack trace when the app throws an error, and `production` shows the proper, appropriate error messages.

- You may set up cronjobs in order to activate a Cloud Function to send reminders to people have checked in who have not yet checked out at a certain time. You have to install all dependencies (`yarn --frozen-lockfile`) in order to use this script (`ts-node-dev` is essential). The one that I usually use is:

```bash
crontab -l
crontab -e
00 18 * * * cd "~/attendance" && yarn reminder
```

- If you have already set up everything above and are coming back to develop after a while, then the steps to run this quickly are: `cd attendance`, `docker-compose up -d`, `cd api`, `yarn migrate`, and finally `yarn dev`.

### Web Setup

- Change directory to the `web` directory.

```bash
cd web
```

- Install all dependencies.

```bash
yarn --frozen-lockfile
```

- Run the web application in development mode.

```bash
yarn dev
```

- Keep in mind that your API has to be in an active state, or else it will not work.

## Benchmarks

Some calculations are done in order to keep track of security.

- You may run `yarn collision-test` in order to check out the collision probability for `nanoid`, `rfc6238`, and `Math.random()`.

## Updates

You may run `yarn upgrade-interactive --latest` to upgrade dependencies. Make sure there are no breaking changes that might break the application.

## License

Application is licensed under MIT License. The research itself will follow the publisher's license after it has been published.

## Upcoming

Upcoming features to be implemented:

- Implement front-end with Next.js.
- SMS implementation.
- Hosting, webservers, and mailservers.
- OWASP scanning and assessment, plus using Snyk for dependency scanning.

I have been thinking of adding these features as well:

- PNPM Integration.
- More ESLint (`security`, `requiring-type-checking`, `unicorn`, `sonarjs`) for better practices and cleaner style.
