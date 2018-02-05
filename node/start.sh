#!/bin/bash
npm install
# if ENV=production for install dev
npm install --only=dev
nodemon -L server.js
