# Server `systemd` Configuration

Two default service names: `attendance-api.service` and `attendance-web.service`. Be sure to replace the `<YOUR_LINUX_USERNAME>` with your username and do not copy-paste this. Configurations are adapted from [Raspberry IoT Dashboard](https://github.com/lauslim12/raspberry-iot-dashboard).

## `attendance-api.service`

```bash
[Unit]
Description=Attendance API - Attendance as a Service!
Documentation=https://github.com/lauslim12/attendance
After=network.target

[Service]
Type=simple
Restart=on-failure
User=<YOUR_LINUX_USERNAME>
Group=<YOUR_LINUX_USER_GROUP>
WorkingDirectory=/home/<YOUR_LINUX_USERNAME>/attendance/api
Environment=NODE_VERSION=16
EnvironmentFile=/home/<YOUR_LINUX_USERNAME>/attendance/api/.env
ExecStart=/home/<YOUR_LINUX_USERNAME>/.nvm/nvm-exec yarn start

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
User=<YOUR_LINUX_USERNAME>
Group=<YOUR_LINUX_USER_GROUP>
WorkingDirectory=/home/<YOUR_LINUX_USERNAME>/attendance/web
Environment=NODE_VERSION=16
ExecStart=/home/<YOUR_LINUX_USERNAME>/.nvm/nvm-exec yarn start

[Install]
WantedBy=multi-user.target
```
