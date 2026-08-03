# Text Analyzer
This is basic text analyzer tool that finds word count, character count, sentences count, paragraph count and largest length word for each paragraph.
## Features:
- User registration
- User Login
- Text CRUD
- Text Analysis

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**
- **npm**
- **Database**: **MySQL**
- **Cache**: **Redis**

### Technologies Used
- node.js (version 21)
- express.js
- typescript
- typeorm
- ioredis
- passport.js
- es-lint
- prettier
- jest
- typedi (for Dependency Injection)

## Getting Started

Follow these steps to get the project up and running on your local machine.

### 1. Clone the repository

```bash
  git clone git@github.com:tajul-saajan/text-analyzer-tdd.git
  
  cd text-analyzer-tdd
```

### 2. Install dependencies
```bash
  npm install
```

### 3. Setup environment variables
### 4. Setup Database

### 5. Run the Application
```bash
  npm run dev
```
### 6. Seeding the Database
```bash
  npm run db:seed
```

### 7. Running test suites
```bash
  npm run test
```

## Running on Kubernetes (minikube)

Manifests for the backend, MySQL and Redis live in `k8s/`. They are written for local
minikube use — the backend image is consumed with `imagePullPolicy: Never`, so it must be
built inside minikube's own Docker daemon rather than pulled from a registry.

### Prerequisites
- **minikube**
- **kubectl**
- **Docker**

### 1. Start the cluster
```bash
  minikube start
```

### 2. Build the image into minikube's Docker daemon
```bash
  eval $(minikube docker-env)
  docker build -f Dockerfile.prod -t ta-prod:latest .
```
`eval $(minikube docker-env)` points your shell's Docker CLI at the cluster's daemon. Skip
it and the pods will fail with `ErrImageNeverPull`, since the image would only exist on the
host.

### 3. Create the namespace
```bash
  kubectl create namespace text-analyzer
```
Every manifest targets the `text-analyzer` namespace, but no manifest creates it.

### 4. Apply the manifests
```bash
  kubectl apply -f k8s/
```

### 5. Wait for MySQL, then restart the backend
```bash
  kubectl rollout status deployment/mysql -n text-analyzer
  kubectl rollout restart deployment/backend-deployment -n text-analyzer
  kubectl rollout status deployment/backend-deployment -n text-analyzer
```
The backend only calls `app.listen()` after TypeORM connects (`src/server.ts`), and it does
not retry. On a first deploy MySQL is still initialising, so the backend pods stay `Running`
but never become `Ready` until restarted.

### 6. Access the API
```bash
  kubectl port-forward -n text-analyzer svc/backend-service 5050:5050
  curl http://localhost:5050/health
```
Or let minikube open a tunnel for you:
```bash
  minikube service backend-service -n text-analyzer
```
The service is a NodePort on `30050`, but on macOS with the Docker driver the minikube node
IP is not routable from the host — use one of the two commands above instead of hitting
`$(minikube ip):30050` directly.

### Configuration
- `k8s/backend-configmap.yaml` — non-secret config (`PORT`, `REDIS_HOST`, log settings,
  account-lock thresholds).
- `k8s/backend-secret.yaml` — base64 values for `SECRET_KEY` and the `DB_*` credentials.
  The committed values are placeholders for local use only; replace them before deploying
  anywhere real. MySQL reads the same secret to bootstrap its user and database.

### Teardown
```bash
  kubectl delete namespace text-analyzer
```

### Known limitations of the current manifests
- **Storage is not persistent.** `mysql-pvc` and `redis-pvc` request `storageClassName: gp2`
  (AWS EBS), which does not exist on minikube, so both stay `Pending`. Neither deployment
  actually mounts them — both use `emptyDir` — so MySQL and Redis data is lost whenever a
  pod restarts.