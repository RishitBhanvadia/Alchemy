#!/bin/bash
echo "Verifying local test failure..."
npm -C client run lint || echo "Lint failed as expected"
