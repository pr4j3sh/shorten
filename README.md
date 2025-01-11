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
- Redis
- Docker
- Kubernetes
- Minikube

## Installation

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
POSTGRES_CERT_PATH="<path/to/ssl_certificate>"
```

- Setup databases

```bash
psql <POSTGRES_URI>
```

```sql
CREATE TABLE urls (
id SERIAL PRIMARY KEY,
url VARCHAR(100),
code VARCHAR(6)
);
```

```bash
redis-cli --tls -u <REDIS_URI>
```

## Usage

### via Source

- Run using `pro`

```bash
npm run pro
```

### via Kubernetes

```bash
minikube start
```

```bash
kubectl create secret generic postgres-cert --from-file=ca.pem
```

- Create `.env.production` with the contents

```.env
PORT=5000
HOSTNAME=0.0.0.0
ORIGINS="http://${HOSTNAME}:${PORT}"
POSTGRES_URI=<postgres_uri>
REDIS_URI=<redis_uri>
POSTGRES_CERT_PATH=<path/to/ssl_certificate>
```

```bash
kubectl create configmap shorten --from-env-file=.env.kubernetes
```

```bash
kubectl apply -f deployment.yaml
```
