# Uncomplicated Firewall: `ufw`

It's always good to set up a Firewall for your server. I recommend to use `ufw`. It defaults to `deny all incoming, allow all outgoing`, so you have to explicitly configure routes and ports that you will allow people to access.

My personal configurations:

```bash
sudo apt install ufw

# make defaults explicit
sudo ufw default deny incoming
sudo ufw default allow outgoing

# check app list
sudo ufw app list

# enable SSH first
sudo ufw allow OpenSSH

# enable nginx
sudo ufw allow "Nginx Full"

# confirm rules
sudo ufw show added

# enable ufw, confirm by pressing 'Y'
sudo ufw enable

# check ufw status
sudo ufw status
sudo ufw status verbose
sudo ufw status numbered
```
