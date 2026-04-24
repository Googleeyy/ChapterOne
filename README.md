# 📚 ChapterOne — Community Library Management System

A production-ready, 3-tier microservices application for community library management built with **Java Spring Boot**, **React**, **MongoDB**, **Docker**, and **Kubernetes**.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Tier 1)                        │
│              React 18 + Vite + Nginx (port 3000)               │
└──────────┬──────────────────┬──────────────────┬───────────────┘
           │                  │                  │
     ┌─────▼─────┐     ┌─────▼─────┐     ┌─────▼─────┐
     │   Book     │     │   User    │     │  Borrow   │
     │  Service   │     │  Service  │     │  Service  │
     │  :8081     │     │  :8082    │     │  :8083    │
     └─────┬─────┘     └─────┬─────┘     └──┬───┬───┘
           │                  │              │   │
     ┌─────▼──────────────────▼──────────────▼───┘
     │              MongoDB (Tier 3)                │
     │  chapterone_books │ chapterone_users │       │
     │  chapterone_borrows                          │
     └──────────────────────────────────────────────┘
```

## ⚡ Quick Start

### Prerequisites
- Docker & Docker Compose
- (Optional) Java 17, Maven, Node.js 20 for local development

### Run with Docker Compose

```bash
cd chapterone
docker-compose up --build
```

Access the application:
| Service        | URL                                |
|----------------|-------------------------------------|
| Frontend       | http://localhost:3000                |
| Book Service   | http://localhost:8081/swagger-ui.html|
| User Service   | http://localhost:8082/swagger-ui.html|
| Borrow Service | http://localhost:8083/swagger-ui.html|
| MongoDB        | mongodb://localhost:27017           |

### Local Development

**Backend (each service):**
```bash
cd book-service   # or user-service, borrow-service
mvn spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Project Structure

```
chapterone/
├── frontend/          React 18 + Vite + Nginx
├── book-service/      Spring Boot — Book CRUD (port 8081)
├── user-service/      Spring Boot — Auth + JWT (port 8082)
├── borrow-service/    Spring Boot — Borrow/Return (port 8083)
├── db/                MongoDB seed script (20 books)
├── k8s/               Kubernetes manifests
├── .github/workflows/ CI/CD pipeline
└── docker-compose.yml Full stack orchestration
```

## 🔌 API Reference

### Book Service (:8081)
| Method | Endpoint                       | Description               |
|--------|--------------------------------|---------------------------|
| GET    | `/api/books`                   | List all (filter: ?genre=&search=) |
| GET    | `/api/books/{id}`              | Get by ID                 |
| POST   | `/api/books`                   | Create book               |
| PUT    | `/api/books/{id}`              | Update book               |
| DELETE | `/api/books/{id}`              | Delete book               |
| PATCH  | `/api/books/{id}/availability` | Update copies (internal)  |

### User Service (:8082)
| Method | Endpoint              | Description            |
|--------|-----------------------|------------------------|
| POST   | `/api/users/register` | Register new user      |
| POST   | `/api/users/login`    | Login → JWT            |
| GET    | `/api/users/profile`  | Get profile (JWT req)  |
| PUT    | `/api/users/profile`  | Update profile (JWT)   |

### Borrow Service (:8083)
| Method | Endpoint                          | Description          |
|--------|-----------------------------------|----------------------|
| POST   | `/api/borrows`                    | Borrow a book        |
| POST   | `/api/borrows/return`             | Return a book        |
| GET    | `/api/borrows/user/{userId}`      | Borrow history       |
| GET    | `/api/borrows/user/{userId}/active` | Active borrows     |

## ☸️ Kubernetes Deployment

```bash
# Apply all manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/rbac.yaml
kubectl apply -f k8s/mongodb-configmap.yaml
kubectl apply -f k8s/mongodb-pvc.yaml
kubectl apply -f k8s/mongodb-statefulset.yaml
kubectl apply -f k8s/mongodb-service.yaml
kubectl apply -f k8s/book-service-deployment.yaml
kubectl apply -f k8s/book-service-service.yaml
kubectl apply -f k8s/user-service-deployment.yaml
kubectl apply -f k8s/user-service-service.yaml
kubectl apply -f k8s/borrow-service-deployment.yaml
kubectl apply -f k8s/borrow-service-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml

# Access frontend
# NodePort: http://<node-ip>:30080
```

## 🛠️ Tech Stack

| Layer     | Technology                                   |
|-----------|----------------------------------------------|
| Frontend  | React 18, Vite, React Router v6, Axios       |
| Backend   | Java 17, Spring Boot 3.2.x, Maven            |
| Auth      | JWT (jjwt 0.11.5), BCrypt                    |
| Database  | MongoDB 7.0                                  |
| Container | Docker, Docker Compose                        |
| Orchestration | Kubernetes                               |
| CI/CD     | GitHub Actions                               |
| API Docs  | Springdoc OpenAPI (Swagger UI)               |

## 📄 License

MIT © ChapterOne
