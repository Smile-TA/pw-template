#!/usr/bin/env zsh
node utils/addBaseUrl.js $1 && node utils/generatePagesFile.js && npm run test:e2e