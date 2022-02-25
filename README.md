# Attendance

Secure API with OTP and Basic Authorization. Implemented as a full-stack application in a unique use-case: attendance system.

You may also call this project as 'Attendance as a Service' (AAAS).

[![DigitalOcean Referral Badge](https://web-platforms.sfo2.digitaloceanspaces.com/WWW/Badge%203.svg)](https://www.digitalocean.com/?refcode=1383571bd620&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge)

## About

This research will focus on creating a highly-secure API that conforms to OWASP Security Best Practices. This research is divided into two subprojects:

- `api` as a Node.js (Express) API. API is a JSON API which also acts as the authorization, authentication, and resource server.
- `server` to provide sample configuration files for `systemd` and reverse proxy.
- `web` as a Next.js front-end.

The flow of the API (Request - Response) is as follows:

```bash
Request -> Handler/Router -> Middleware (if applicable) -> Validations (if applicable) -> Controller -> Service -> Prisma (if applicable) / Cache (if applicable) -> Controller -> Response
```

- Four layer architecture: Validation and Controller, Service, and ORM (Prisma).
- Global error handler exist in the application. Every error(s) will be thrown to the global error handler to be 'handled'.
- We still have not yet used Dependency Injection for easier testability.

## Features

Below is the list of main features that this system have:

- Users can check the health of the API.
- Users can log in and register.
- Users can get their own authentication status.
- Users can forget and reset their own passwords.
- (**A**) Users can see their own profile, modify it (except password), and delete it.
- (**A**) Users can modify their own password.
- (**A**) Users can get all of their own sessions and can invalidate them if necessary.
- (**A**) Users can get their own attendance data.
- (**A**) Users can request OTP from the API via Email or Authenticator apps.
- (**A**) Users can receive a special MFA authorization by verifying the OTP.
- (**A C**) Users can update their own MFA secrets in Authenticator apps.
- (**A C**) Users can check in and check out their attendance.
- (**A B**) Admins can see all sessions and can invalidate them manually.
- (**A B C**) Admins can perform CRUD operations on the `User` entity.
- When set up, this system can remind people to log out at a certain time.
- The whole application is responsive and naturally supports HTTPS.
- OpenGraph tags are already set up for SEO purposes.

Legend:

- **A** means this feature/use-case requires authentication (user have to have a session).
- **B** means this feature/use-case requires a certain role (usually `admin`).
- **C** means this feature/use-case requires a MFA session (user have to have a JWS/JWT).

## Security

As this research focuses on creating a secure API, below are the considerations that are taken during development:

- Users are divided into two roles: `admin` and `user`.
- A special kind of authorized session: `OTPSession`, using JSON Web Tokens (RFC 7519). Having this token means that the user is MFA authenticated. The JSON Web Tokens have a very small lifetime (only about 15 minutes). JSON Web Tokens are powered by `Ed25519` algorithm.
- Sessions are signed cookies, implemented with a high-entropy session secret, and served with secure attributes (`secure`, `sameSite`, `httpOnly`). It is regenerated and refreshed in several instances for security. Sessions can be manually managed by the corresponding user.
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
- Prevent attacks like parameter pollution, payload too large, bad JSON, and many more with proper status codes.
- Implements secure authentiation flows: login, logout, registration, email verification, password updates, password forgots, password resets, session management, user management, and 2FA.
- All algorithms conforms to Kerckhoff's Principle: open design with the only secret being its key, and the key itself must not be able to be cracked should it fall in the hands of an attacker.
- Secure headers are placed in both API and Web. Examples: `Content-Security-Policy`, `X-XSS-Protection`, `X-Content-Type-Options`, and more.
- Powered by strong HTTPS ciphers and protected Linux processes (guidelines included).

## Standards

This application conforms to the following security standards:

- [OWASP ASVS](https://github.com/OWASP/ASVS) (Session Security, OTP Security)
- [OWASP WSTG: Authentication Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/04-Authentication_Testing/README)
- [OWASP WSTG: Authorization Testing](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/05-Authorization_Testing/README)
- [OWASP API: Top 10 API Security](https://owasp.org/www-project-api-security/)
- [OWASP ZAP: Baseline](https://www.zaproxy.org/docs/docker/baseline-scan/)
- [Snyk: Dependencies and Code Security](https://snyk.io)
- [OWASP: Security Cheatsheets](https://cheatsheetseries.owasp.org/): Include but not limited to Authentication, Authorization, CSP, CSRF, Database, Forgot Password, MFA, Node.js, Password Storage, REST, and more.

To note, some error messages are made explicit ('code has been sent to your email if it exists in our database' vs 'code has been sent to your email') to the user because of usability concerns. A user would get annoyed if the system only provides an obscure error message that nobody can guess what is going on. It's always a trade off, and for this application, I'm leaning a bit towards the 'usability' part in terms of error messages.

## Documentation

API documentation is available at Postman, and it is under construction for now. The whole codebase in this repository is completely documented with TypeScript and JSDoc.

## Requirements

For development, you need the following technologies installed on your machine:

- [Docker](https://www.docker.com/)
- [Node.js 16+](https://nodejs.org/)
- [Yarn 1.22+](https://yarnpkg.com/)
- [Postman Desktop Agent](https://www.postman.com/downloads/) to test things locally
- [Mailtrap](https://mailtrap.io/) to test emails in development environment
- Unix-based systems or MacOS
- Authenticators, such as Google Authenticator, Microsoft Authenticator, etc.

For production, you need the following technologies:

- Debian OS is recommended (latest)
- Node.js and Yarn (NVM is recommended)
- MariaDB, Redis, Nginx
- Mailservers (you may use Gmail with App Passwords)

Docker is only used for development. Production will use an ordinary Linux server.

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

- Keep in mind that your API has to be in an active state, or else it will not work. Web is automatically set to proxy requests to `localhost:8080` if `NGINX` environment variable is not set (it is set if you are running `make build-production`, which will be explained in the next part of the documentation).

## Production

This whole app is supposed to live inside a Linux server, supervised by `systemd` and running behind Nginx reverse proxy. Make sure you are using a 64-bit OS, and please read the instructions properly (and the sample configuration files if you are using them) to prevent any miscommunications. By reading this, you are expected to have a basic knowledge of Linux system administration. This guide assumes that you are using Debian-based OS.

### Production: Initial Setup

- SSH into your instance. It is recommended that you disallow login with password to your instance.
- Remember not to install this application as the `root` user. Change it to someone else for security. You can create a new user just for this own app by using `sudo adduser <NEW_USER>` and `sudo usermod -aG sudo <NEW_USER>`. Copy your SSH keys if applicable and log in again as that less-privileged user.
- Install dependencies such as MariaDB (`sudo apt install mariadb-server`), Redis (`sudo apt install redis-server`), nginx (`sudo apt install nginx`), and requirements above: Node.js (you may use `nvm` for convenient version management), and Yarn.
- Password protect your resources (`sudo nano /etc/redis/redis.conf` or `mysql_secure_installation` and create password), create users with least privileges for those resources, and only allow access from `localhost`.
- Pull the code to your machine, either by `scp`, `wget`, or `git clone` (may have to install `git` and prepare tokens / SSH access).
- Prepare environment variables as described in [API Setup](#api-setup) and perform initial setup before building the whole app by using `make build-production`.
- **Do NOT use the sample environment variables, the development data, and the like. Development and production environments MUST be separate. Create your own secrets and the like, there is a reason why sample environment variables are provided, and it is to help with the development process, NOT for production.**

### Production: App Configuration

- You may create two `systemd` configurations in `/etc/systemd/system/<SERVICE_NAME>.service`. One is for `api`, and one is for the `web` project. Sample configurations are available in `server/systemd`. Do so by using `sudo nano /etc/systemd/system/<SERVICE_NAME>.service`. Default names for services: `attendance-web.service` and `attendance-api.service`.
- Refresh daemons by `sudo systemctl daemon-reload`.
- Enable and activate on restart: `sudo systemctl enable <SERVICE_NAME>` and `sudo systemctl start <SERVICE_NAME>` for both services.
- Copy the web server configurations in `/etc/nginx`. You may use my Nginx configuration (`server/nginx`, at the `nginx.conf` part of the document) and copy it in `/etc/nginx/nginx.conf`, and also use my server configuration (`server/nginx`, at the `sites-available` part of the document.) in `/etc/nginx/sites-available/<YOUR_SERVER_DOMAIN_NAME_OR_DEFAULT>`.
- Symlink it by using `sudo ln -s /etc/nginx/sites-available/<YOUR_SERVER_DOMAIN_NAME_OR_DEFAULT> /etc/nginx/sites-enabled`. Test the configuration by running `sudo nginx -t`.
- If everything goes well, do `sudo systemctl restart nginx` and access it on your machine. It may take a few seconds for it to run on your machine properly. Done!

### Production: Security Hardening

- (Optional) You may want to use Let's Encrypt in order to get free SSL if you are running the production version on the Internet. I recommend you to use `sudo apt install python3-certbot-nginx` as it automates most of the process and it allows you to perform automatic renewals.
- (Optional) To improve your SSL rating after enabling HTTPS, please feel free to refer to my [HTTPS nginx configurations](./server/nginx.md).
- (Optional) You may want to use cronjobs to automate message reminders and database backups. If you want to do so, please refer to my [cron configurations](./server/cron.md). Note that the complete dependencies have to be installed (`yarn --frozen-lockfile`)!
- (Optional) Enable Firewall by checking my [Firewall configurations](./server/ufw.md).

### Production: Updates

- If you want to update the production version, it is necessary to refresh the services and the webserver:

```bash
make build-production
sudo systemctl restart attendance-api
sudo systemctl restart attendance-web
sudo systemctl restart nginx
```

### Production: Emails

- You may have to set `rejectUnauthorized: false` in email in order to use several mailservers. Some mailservers use self-signed certificates, and it will not pass the Node.js TLS check. It is recommended that you fix those at the server-level though, not by using that line of code.
- If you want to use Gmail, [this guide about using App Password with Gmail](https://gist.github.com/lauslim12/df25e3d0e6f2ca563977dfa05563aae7) may help you.

## Makefile

Several helper scripts have already been set up in case you want to build and/or clean.

- To clean all of the projects, use `make clean`.
- To clean `api` of artifacts, use `make clean-api`. To clean `web` of artifacts, use `make clean-web`.
- To build all projects, use `make build`.
- To build all projects to prepare them to be placed behind a reverse proxy, use `make build-production`.

## Benchmarks

Several evaluations/calculations are done in order to keep track of security are performed as follows:

- You may run `yarn collision-test` in order to check out the collision probability for `nanoid` and `Math.random()`.
- You may use [OWASP ZAP Baseline](https://www.zaproxy.org/docs/docker/baseline-scan/) in order to perform automated penetration tests on the application.
- If you have Snyk CLI installed, you can run `snyk test --all-projects` to find vulnerable dependencies, and/or `snyk code test` to perform static code analysis.
- If you need to update dependencies, you can use `yarn upgrade-interactive --latest` to do so. Please make sure there are no breaking changes that might break the application.

## Credits

- [Icons8.com](https://icons8.com/) for the API Favicon.
- [Wesson Wang](https://unsplash.com/@wesson) for the SEO image.

## License

Application is licensed under MIT License. The research itself will follow the publisher's license after it has been published.
