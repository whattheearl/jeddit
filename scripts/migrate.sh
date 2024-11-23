#!/usr/bin/env sh
mkdir -p /root/app/jeddit/data
sqlite3 /root/app/jeddit/data/db.sqlite < ./scripts/migrate.sql
