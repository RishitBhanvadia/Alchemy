#!/bin/bash
# The error shows:
# require() of ES Module .../@exodus/bytes/encoding-lite.js from .../html-encoding-sniffer/lib/html-encoding-sniffer.js not supported.
# And also in the npm ci logs:
# npm warn EBADENGINE   package: 'jsdom@28.0.0',
# npm warn EBADENGINE   required: { node: '^20.19.0 || ^22.12.0 || >=24.0.0' },
# npm warn EBADENGINE   current: { node: 'v18.20.8', npm: '10.8.2' }

cd client
npm install jsdom@^22.1.0 html-encoding-sniffer@^3.0.0 --save-dev
