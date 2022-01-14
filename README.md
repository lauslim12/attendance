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

Below are the list of main features that this system have:

- Users can log in and register.
- (**A**) Users can see their own profile, modify it, and see their sessions.
- (**A**) Users can request OTP from the API via Email, SMS, or Authenticator apps.
- (**A**) Users can receive a special MFA authorization by verifying the OTP.
- (**A C**) Users can check in and check out their attendance.
- (**A B C**) Admins can perform CRUD operations on the `User` entity.

Legend:

- A means this feature/use-case requires authentication (user have to have a session).
- B means this feature/use-case requires a certain role (usually `admin`).
- C means this feature/use-case requires a MFA session (user have to have a JWS/JWT).

## Security

As this research focuses on creating a secure API, below are the considerations that are taken during development:

- Users are divided into two roles: `admin` and `user`.
- A special kind of authorized session: `OTPSession`, using JSON Web Tokens. Having this token means that the user is MFA authenticated. The JSON Web Tokens have a very small lifetime (only about 15 minutes).
- Sessions are signed cookies, implemented with a high-entropy session key, and served with secure attributes (`secure`, `sameSite`, `httpOnly`).
- Passwords are hashed with `Argon2` algorithm.
- The secret to generate the OTP is implemented with `nanoid` (it has high entropy and it is a cryptographically secure generator), and it is different for every other users in the system.
- OTP is time-based and it is generated with RFC 6238 algorithm with `SHA-1` hash function and a high-entropy secret (above). OTP is verified with the `userID` via RFC 7617 algorithm.
- Secure API protection middlewares (`helmet`, `hpp`, JSON-only API with a secure parser, slow downs, rate limiters, XST prevention, XSS prevention, and many more).
- Secure API authorization (session authorization, role-based access control, MFA with JWT/JWS).
- API logging is performed using `morgan`.
- API is implemented with JSON:API Standard and provides structured error messages and responses according to the best practices.
- No cheap tricks and 'unusual' security through obscurity (double encryption, triple encoding, multiple hashing, and the like). Cryptography/security is used to serve a specific purpose and be an effective solution for that purpose - incorrect use of cryptography will make the system less secure.

## Documentation

API documentation is available at Postman, and it is under construction for now.

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

- If you have already set up everything above and are coming back to develop after a while, then the steps to run this quickly are: `cd attendance`, `docker-compose up -d`, `cd api`, `yarn migrate`, and finally `yarn dev`.

## License

Application is licensed under MIT License. The research itself will follow the publisher's license after it has been published.

## Upcoming

Upcoming features to be implemented:

- PNPM Integration.
- Ability for admins to block accounts.
- Implement front-end with Next.js.
- SMS implementation.
- Hosting, webservers, and mailservers.
- OWASP scanning and assessment, plus using Snyk for dependency scanning.

I have been thinking of adding these features as well:

- Session features, one can check their own sessions and in what machine (similar to GitHub, Google, and many other providers).
- Session invalidation for administrators (`GET /api/v1/users/sessions`?).
- `GET /api/v1/users/me/sessions` to display all sessions for a single user. The middleware protecting this one will only be `has-session.ts`.
- More ESLint (`security`, `requiring-type-checking`, `unicorn`, `sonarjs`) for better practices and cleaner style.
