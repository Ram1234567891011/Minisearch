# MiniSearch (Localhost Setup)

## Prerequisites
- Docker + Docker Compose
- Node.js (v18+ recommended)

## Run locally
```bash
# 1. Start with Docker Compose
npm run docker:up

# 2. Open apps:
# Frontend: http://localhost:5173
# Backend:  http://localhost:4000/api/health
# Elastic:  http://localhost:9200
```

## Reset index + add documents
```bash
curl -X DELETE http://localhost:4000/api/admin/index
curl -X POST http://localhost:4000/api/admin/index -H 'Content-Type: application/json' -d '{
  "title": "Hello World",
  "snippet": "Test document",
  "url": "http://example.com",
  "type": "web",
  "safe": true
}'
```

## Stop everything
```bash
npm run docker:down
```
