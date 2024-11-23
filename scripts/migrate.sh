#!/usr/bin/env sh
sqlite3 /root/app/jeddit/data/db.sqlite < ./scripts/migrate.sql
