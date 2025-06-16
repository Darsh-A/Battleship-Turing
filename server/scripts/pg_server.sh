#!bin/bash

sudo mkdir -p /run/postgresql
sudo chown "$(whoami)" /run/postgresql
chmod 775 /run/postgresql
pg_ctl -D server/pgdata -l logfile start

