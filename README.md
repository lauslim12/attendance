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

## Requirements

For development, you need the following technologies installed on your machine:

- [Docker](https://www.docker.com/)
- [Node.js 16+](https://nodejs.org/)
- [Yarn 1.22+](https://yarnpkg.com/)
- [Postman Desktop Agent](https://www.postman.com/downloads/)
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

- Run Prisma migrations, so you can get the database schema. You have to do this every time you turn on the Docker instance, as all data are reset.

```bash
yarn migrate
```

- You may seed the database with data samples located at `api/cli/seed-data.ts`. As above, you also have to do this every time you turn on the Docker instance.

```bash
yarn seed
```

- Transform all of the TOTP strings as QR codes, then scan it in your authenticator application for easy access towards double-protected routes (optional). You may use [QR Code Generator](https://www.qr-code-generator.com/) as an external webservice.

- Run the application in development mode.

```bash
yarn dev
```

- There are two modes available: `development`, and `production`. The difference is that `development` shows the full error stack trace when the app throws an error, and `production` shows the proper, appropriate error messages.

## License

Application is licensed under MIT License. The research itself will follow the publisher's license after it has been published.
