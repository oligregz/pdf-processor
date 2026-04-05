# 📄 PDF Processor

A full-stack, distributed, and event-driven system built to handle background text extraction from PDF files. Designed with a strong focus on software architecture, resilience, and user experience.

🔗 **Live Application:** [https://pdf-processor-kappa-two.vercel.app](https://pdf-processor-kappa-two.vercel.app)

---

## 🚀 Overview

The PDF Processor is not just a simple script. It was architected to be a resilient enterprise-grade application. It solves the daily problem of extracting text from PDFs by utilizing an asynchronous "Fire and Forget" workflow. 

Users upload a file, the frontend instantly frees them to navigate elsewhere, and the heavy lifting is delegated to a background Java Worker via message queues. Once processed, users receive a real-time WebSocket update and a uniquely generated transactional email to securely download their text file.

## 🏗️ Architecture & Data Flow

1. **Edge Delivery:** Users interact with an **Angular 21** frontend hosted on **Vercel**.
2. **API Gateway:** The frontend connects via HTTP and WebSockets to a **NestJS** Gateway hosted on a private VPS. The Gateway handles JWT Authentication, DDoS prevention (Rate Limiting), and Concurrency constraints.
3. **Message Broker:** If the system has capacity, the Gateway pushes the job to a **RabbitMQ** queue (`pdf.process`).
4. **Background Processing:** A **Spring Boot (Java 17)** Worker consumes the queue, downloads the PDF, extracts the text using **Apache PDFBox**, and uploads the generated `.txt` to **Cloudflare R2**.
5. **Real-Time Notification:** The Java Worker updates the **PostgreSQL** database, fires a stylized HTML email with a secure download link, and posts a completion event back to RabbitMQ.
6. **Live UI Update:** The NestJS Gateway consumes the completion event and pushes a WebSocket notification to the Angular frontend, updating the UI in real-time.

## 🛠️ Technology Stack

**Frontend (Edge)**
* Angular 21 (Standalone Components, Signals)
* Tailwind CSS (Dark Crimson & Deep Graphite UI)
* Socket.io-client

**API Gateway (Node.js)**
* NestJS
* Socket.io (WebSockets)
* Class-Validator & Swagger

**Background Worker (Java)**
* Java 17 & Spring Boot
* Apache PDFBox
* Spring Data JPA / Hibernate
* Spring Mail

**Infrastructure & DevOps**
* PostgreSQL
* RabbitMQ
* Cloudflare R2 (S3-compatible storage)
* Docker & Docker Compose
* GitHub Actions (CI/CD)
* Certbot (SSL/TLS)
* VPS with Memory Swap optimization

## 🛡️ Non-Functional Requirements (NFRs) Implemented

* **Resilience:** Strict concurrency limit of 5 simultaneous processing jobs.
* **Security:** Memory-based Rate Limiting (max 3 PDFs per 24h per user) and expiring download links to prevent abuse.
* **UX Consistency:** Seamless Dark Mode UI extending from the web app all the way to the transactional email templates.
* **High Availability:** Message decoupling guarantees that if the Java Worker crashes, the API Gateway continues accepting uploads securely.

---

## ⚙️ How to Run & Deployment Guide

**Prerequisites:**
* Docker and Docker Compose installed.
* `.env` file configured in the project root containing all credentials.
* Terminal positioned at the project root.

### 💻 Development Environment (DEV)
Goal: Run databases and message broker in Docker, while applications (NestJS and Java) run natively in your terminal to allow Hot-Reload.

**First Deploy (Cold Start):**
1. Enter the infrastructure folder: `cd infra`.
2. Start the base infrastructure: `docker compose --env-file ../.env -f docker-compose.dev.yml up -d`.
3. In a new terminal, go to the API folder, install dependencies, and run migrations: `cd api-gateway`, `npm install`, `set -a && source ../.env && set +a && npm run migration:run`, and `npm run start:dev`.
4. In a third terminal, go to the Worker folder and start it: `cd pdf-worker` and `set -a && source ../.env && set +a && ./mvnw spring-boot:run`.

### 🌍 Production Environment (PROD / VPS)
Goal: Everything runs isolated and optimized inside Docker containers. Applies to Oracle VPS or any other cloud server.

**First Deploy (Cold Start):**
1. Enter the infrastructure folder: `cd infra`.
2. Start FIRST only the base infrastructure (ensuring databases create volumes before apps connect): `docker compose --env-file ../.env -f docker-compose.yml up -d postgres mongodb rabbitmq`.
3. Wait 10 seconds for databases to initialize, then build and start the API Gateway: `docker compose --env-file ../.env -f docker-compose.yml up -d --build api-gateway`.
4. Run database migrations inside the API container: `docker exec -it api-gateway npm run migration:run:prod`.
5. Build and start the Java Worker: `docker compose --env-file ../.env -f docker-compose.yml up -d --build pdf-worker`.

**Code Update (Continuous Deployment):**
Use this flow when altering source code and applying changes to production without deleting databases.
1. Download the latest code: `git pull`.
2. Enter the infrastructure folder: `cd infra`.
3. Rebuild and update only application containers: `docker compose --env-file ../.env -f docker-compose.yml up -d --build api-gateway pdf-worker`.
4. Apply new migrations if database schemas changed: `docker exec -it api-gateway npm run migration:run:prod`.
5. Clean orphan images to save VPS disk space: `docker image prune -f`.

### 🚨 Emergency Commands (Troubleshooting)
* View status of all containers: `docker ps -a`.
* View RabbitMQ logs: `docker logs -f rabbitmq`.
* Shut down EVERYTHING in production: `cd infra && docker compose -f docker-compose.yml down`.
* Destroy EVERYTHING (DELETES DATA!): `cd infra && docker compose -f docker-compose.yml down -v`.
* Extreme Infrastructure Wipe (Use ONLY if necessary): `cd infra/ && docker compose down --rmi all --volumes --remove-orphans && docker volume prune -f`.

---

*This project was developed with the assistance of an AI coding partner (`gemini cli`), focusing heavily on System Design and human-guided software architecture in the new era of AI development.*


