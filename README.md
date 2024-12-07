# shorten

This is an express js API for URL shortening.

## Usage

- Run using `dev`

```bash
npm run dev
```

## API Endpoints

- Upload url, returns shortened url

```
POST /api/url
```

```json
{
  "url": "https://github.com/pr4j3sh/shorten"
}
```

- Redirect to original url

```
GET /api/:id
```
