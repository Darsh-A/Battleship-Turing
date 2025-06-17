#!/bin/sh
set -eu

sudo mkdir -p /run/postgresql
sudo chown "$(whoami)" /run/postgresql
chmod 775 /run/postgresql

if [ ! -d server/pgdata ]; then
  initdb -D server/pgdata
fi

pg_ctl -D server/pgdata -l server/pgdata/logfile start

if ! psql -lqt | cut -d \| -f 1 | grep -qw battleship; then
  createdb battleship
fi

cleanup() {
  echo "\nShutting down Postgres..."
  pg_ctl -D server/pgdata stop
  rm -rf server/pgdata/
  exit 0
}
trap cleanup INT TERM

echo "Postgres is running. Press Ctrl+C to stop."

while true; do
  sleep 1
done

