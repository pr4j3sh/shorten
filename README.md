# shorten

This is an express js server API for shortening URL.

## Installation

```bash
git clone https://github/pr4j3sh/shorten.git
cd shorten
```

```bash
mv .env.example .env
```

- Edit `POSTGRES_URI` and `REDIS_URI`

- Setup databse

```bash
psql
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
code VARCHAR(6),
);
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
docker run --env-file=.env -p 5000:5000 pr4j3sh/shorten:tag
```

> `env` file should contain all `.env.example` variables. You can create a separate `.env.docker` and use it here.
