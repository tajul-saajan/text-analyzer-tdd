#!/bin/bash

echo "Waiting for services to be ready..."
timeout 60 bash -c 'until docker compose exec app node -e "require(\"http\").get(\"http://localhost:5050\", () => process.exit(0)).on(\"error\", () => process.exit(1))" 2>/dev/null; do echo "Waiting..."; sleep 2; done'
echo "Services are ready!"