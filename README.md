# SAlertS - Sistema de Alertas Académicas 🎓

Sistema integral para la gestión y monitoreo de rendimiento académico, diseñado bajo una arquitectura de microservicios contenerizados.

## 🛠️ Tecnologías
- **Backend:** Java 17, Spring Boot 3, Spring Security, JWT.
- **Frontend:** React + Vite, Tailwind CSS.
- **Base de Datos:** PostgreSQL 17.
- **Infraestructura:** Docker & Docker Compose.

## 🚀 Despliegue Rápido
1. Clonar el repositorio.
2. Configurar el archivo `.env` en la raíz.
3. Ejecutar:
   ```bash
   docker compose --env-file .env up --build -d