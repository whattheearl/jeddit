#!/usr/bin/env sh
sqlite3 /home/jon/wte/jeddit/data/db.sqlite < ./scripts/migrate.sql
