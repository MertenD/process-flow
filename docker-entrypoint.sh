#!/bin/sh
set -e

node_modules/.bin/prisma migrate deploy
node_modules/.bin/tsx prisma/seed.ts

exec node server.js
