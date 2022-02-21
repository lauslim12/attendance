# Server `cron` Configuration

Here is the settings of my crontabs (my `crontab -l`) to run automations that are available in this application. Adjust it with your own environment by using NVM executable location (usually it's `/home/<YOUR_USERNAME>/.nvm/nvm-exec`) and use your own MariaDB user.

```bash
00 11 * * * cd /home/<YOUR_USERNAME>/attendance/api && NODE_VERSION=16 URL=<YOUR_URL> NODE_ENV=production /home/<YOUR_USERNAME>/.nvm/nvm-exec yarn reminder
00 12 * * * mysqldump -u '<MARIADB_USER>' -p'<MARIADB_PASS>' <MARIADB_DBNAME> <BACKUP_LOCATION>
```
