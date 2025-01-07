# shorten

This is an express js server API for shortening URL.

## API Endpoints

- Upload url, returns code

```
POST /api/shorten
```

```json
{
  "url": "https://github.com/pr4j3sh/shorten"
}
```

- Redirect to original url

```
GET /api/:code
```

- Delete an url

```
DELETE /api/:code
```

### Pre-requisites

- Node.js
- PostgreSQL
- Docker

## Installation

- Setup database

```bash
docker run -d -e POSTGRES_PASSWORD=<password> -p 5001:5432 postgres
```

```bash
psql -h localhost -p 5001 -U postgres
```

```bash
CREATE DATABASE shorten;
```

```bash
\c shorten
```

```sql
CREATE TABLE urls (
id SERIAL PRIMARY KEY,
url VARCHAR(100),
code VARCHAR(6)
);
```

```bash
docker run -d -p 5002:6379 redis
```

## Usage

### via Source

```bash
git clone https://github/pr4j3sh/shorten.git
cd shorten
```

- Setup environment variables

```bash
mv .env.example .env
```

- Edit `POSTGRES_URI` and `REDIS_URI`

```.env
PORT=5000
HOSTNAME=0.0.0.0
ORIGINS="http://${HOSTNAME}:${PORT}"
POSTGRES_URI=postgres://postgres:<password>@host.docker.internal:5001/shorten
REDIS_URI=redis://host.docker.internal:5002
```

- Run using `dev`

```bash
npm run dev
```

### via Docker

```bash
docker run --env-file=.env -p 5000:5000 pr4j3sh/shorten:v1.0.4
```

## via Kubernetes

```bash
minikube start
```

- Create `.env.postgres` with the contents

```.env
POSTGRES_PASSWORD=<password>
```

```bash
kubectl create configmap postgres --from-env-file=.env.postgres
```

- Create `.env.kubernetes` with the contents

```.env
PORT=5000
HOSTNAME=0.0.0.0
ORIGINS="http://${HOSTNAME}:${PORT}"
POSTGRES_URI=postgres://postgres:<password>@postgres:5001/shorten
REDIS_URI=redis://redis:5002
```

```bash
kubectl create configmap shorten --from-env-file=.env.kubernetes
```

```bash
git clone https://github/pr4j3sh/shorten.git
cd shorten
```

```bash
kubectl apply -f db.yaml
```

```bash
kubectl apply -f deployment.yaml
```
