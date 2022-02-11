# Server `systemd` Configuration

Two default service names: `attendance-api.service` and `attendance-web.service`. Be sure to replace the `ophelia` with your username. `ophelia` is a random name and it means nothing. Configurations are adapted from [Raspberry IoT Dashboard](https://github.com/lauslim12/raspberry-iot-dashboard).

## `attendance-api.service`

```bash
[Unit]
Description=Attendance API - Attendance as a Service!
Documentation=https://github.com/lauslim12/attendance
After=network.target

[Service]
Type=simple
Restart=on-failure
User=ophelia
Group=ophelia
WorkingDirectory=/home/ophelia/attendance/api
Environment=NODE_VERSION=16
EnvironmentFile=/home/ophelia/attendance/api/.env
ExecStart=/home/ophelia/.nvm/nvm-exec yarn start

[Install]
WantedBy=multi-user.target
```

## `attendance-web.service`

```bash
[Unit]
Description=Attendance Web: Front-end implementation of Attendance
Documentation=https://github.com/lauslim12/attendance
After=network.target

[Service]
Type=simple
Restart=on-failure
User=ophelia
Group=ophelia
WorkingDirectory=/home/ophelia/attendance/web
Environment=NODE_VERSION=16
ExecStart=/home/ophelia/.nvm/nvm-exec yarn start

[Install]
WantedBy=multi-user.target
```
