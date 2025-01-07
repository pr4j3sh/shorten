# shorten

This is an express js server API for shortening URL.

## Installation

```bash
git clone https://github/pr4j3sh/shorten.git
cd shorten
```

- Setup databse

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

## Usage

- Run using `dev`

```bash
npm run dev
```

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

## With Docker

```bash
docker run --env-file=.env -p 5000:5000 pr4j3sh/shorten:v1.0.4
```

> `env` file should contain all `.env.example` variables. You can create a separate `.env.docker` and use it here.
