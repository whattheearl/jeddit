#!/usr/bin/env sh
sqlite3 ./data/db.sqlite < ./scripts/migrate.sql
