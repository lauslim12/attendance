# Attendance

Secure API with OTP and Basic Authorization. Implemented as a full-stack application in a unique use-case: attendance system.

## About

This research will focus on creating a highly-secure API that conforms to OWASP Security Best Practices. This research is divided into two subprojects:

- `api` as a Node.js (Express) API. API is a JSON API which also acts as the authorization, authentication, and resource server.
- `web` as a Next.js front-end.

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

- You may use the default environment variables that I have already hardcoded for development purposes, and you have no need to configure it further. If you want, you may change environment variables to your liking using the `export` keyword. Do not use these environment variables in production.

- Run the application in development mode.

```bash
yarn dev
```

## License

Application is licensed under MIT License. The research itself will follow the publisher's license after it has been published.
