# shorten

This is an express js server API for shortening URL.

## Features

- Scalable
- Load Balancing

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

- [Node.js](https://nodejs.org/en)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [Docker](https://www.docker.com/)
- [Kubernetes](https://kubernetes.io/)
- [Minikube](https://minikube.sigs.k8s.io/docs/)
- [Aiven PostgreSQL Database](https://aiven.io/)
- [Upstash Redis Database](https://upstash.com/)

## Installation

```bash
git clone https://github/pr4j3sh/shorten.git
cd shorten
```

- Setup environment variables

```bash
mv .env.example .env
```

- Edit the contents

```.env
ENV="pro"
PORT=5000
HOSTNAME=0.0.0.0
ORIGINS="http://${HOSTNAME}:${PORT}"
POSTGRES_URI=<postgres_uri>
REDIS_URI=<redis_uri>
POSTGRES_CERT_PATH=./certs/ca.pem
```

> Sign up and get URIs from [Aiven](https://aiven.io/)(PostgreSQL) along with SSL certificate and [Upstash](https://upstash.com/)(Redis)

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

- Run using `dev`

```bash
npm run dev
```

### via Kubernetes

```bash
minikube start
```

```bash
kubectl create secret generic postgres-cert --from-file=ca.pem
```

```bash
kubectl create configmap shorten --from-env-file=.env
```

```bash
kubectl apply -f deployment.yaml
```

```bash
kubectl apply -f loadbalancer.yaml
```

Get minikube ip address

```bash
minikube ip
```

Now use curl to check server status

```bash
curl <minikube_ip>:30000/api/check
```

Delete deployments

```bash
kubectl delete -f loadbalancer.yaml && kubectl delete -f deployment.yaml && kubectl delete configmap shorten kubectl delete secret postgres-cert
```
