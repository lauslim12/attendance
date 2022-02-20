# Server `cron` Configuration

Here is the settings of my crontabs (my `crontab -l`) to run automations that are available in this application. Adjust it with your own environment by using `which node` for the Node location and use your own MariaDB user.

```bash
00 11 * * * cd /home/<YOUR_USER>/attendance/api && <NODE_LOCATION> yarn reminder
00 12 * * * mysqldump -u '<MARIADB_USER>' -p'<MARIADB_PASS>' <MARIADB_DBNAME> <BACKUP_LOCATION>
```
