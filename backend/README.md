# Backend API - NestJS

API backend construida con NestJS que maneja autenticación, gestión de usuarios y tareas, con integración a RabbitMQ para procesamiento asíncrono.

## 📦 Dependencias Principales

- **Core**:
  - `@nestjs/common`, `@nestjs/core` - Framework base
  - `@nestjs/typeorm` - Integración con TypeORM
  - `typeorm`, `mysql2` - ORM y driver de base de datos

- **Autenticación**:
  - `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt` - Autenticación JWT
  - `bcrypt` - Hash de contraseñas
  - `cookie-parser` - Manejo de cookies

- **Comunicación Asíncrona**:
  - `@nestjs/microservices` - Microservicios
  - `amqplib`, `amqp-connection-manager` - Conexión con RabbitMQ

- **Utilidades**:
  - `class-validator`, `class-transformer` - Validación y transformación de datos
  - `uuid` - Generación de IDs únicos
  - `nodemailer` - Envío de emails

- **Caché**:
  - `cache-manager-redis-store`, `nestjs-redis`, `@nestjs/cache-manager` - Sistema de caché con Redis

## 🚀 Instalación de manera local

1. **Instalar Dependencias**:
- Ejecutamos `npm install` para crear la carpeta node_modules y aplicar todas las dependencias que se encuentrar en el archivo package.json

- Arrancamos el servidor con `npm run start:dev`

## 🐳 Instalación con docker

**Requisitos previos:**

- Docker instalado en tu sistema
- Docker Compose (normalmente viene con Docker Desktop)
- Puertos libres: 8000, 3307, 5672 y 15672 (vienen por defecto en la configuración pero puedes cambiarlos)

## Instalación con Docker

Sigue estos pasos para configurar y ejecutar el proyecto:

1. **Configuración inicial:**
   - Modifica los valores en los archivos de configuración dentro de `src/config/` según tus necesidades.
   - Asegúrate de que los puertos definidos (8000, 3307, 5672, 15672) estén disponibles en tu sistema.

2. **Construye y levanta los contenedores:**
   ```bash
   docker compose build --no-cache && docker compose up
   ```
   Este comando:
   - Reconstruye las imágenes desde cero (`--no-cache`).
   - Levanta todos los servicios definidos en `docker-compose.yml`.

## Estructura de servicios

El sistema consta de tres servicios principales:

### Aplicación Node.js:
- **Puerto:** 3000 (interno) → 8000 (externo)
- **Entorno:** development
- **Montaje en caliente** gracias al volumen

### Base de datos MySQL:
- **Versión:** 8.0
- **Puerto:** 3306 (interno) → 3307 (externo)
- **Usuario:** root
- **Contraseña:** 123
- **Base de datos:** todo_db
- **Persistencia** mediante volumen

### RabbitMQ:
- **Versión:** 3 con interfaz de gestión
- **Puertos:**
  - 5672 para AMQP
  - 15672 para la interfaz web de gestión
- **Credenciales:**
  - **Usuario:** ivan
  - **Contraseña:** 123

## Acceso a servicios

- **Backend:** [http://localhost:8000](http://localhost:8000)
- **Interfaz de RabbitMQ:** [http://localhost:15672](http://localhost:15672)
  - **Usuario:** guest
  - **Contraseña:** 123
- **MySQL:** Puedes conectarte externamente al puerto 3307 con las credenciales proporcionadas.

## Variables de entorno

La aplicación utiliza las siguientes variables (configuradas en `docker-compose.yml`):

```env
NODE_ENV=development
DB_HOST=db
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=123
DB_DATABASE=todo_db
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=123
```

## Comandos útiles

- **Detener los contenedores:**
  ```bash
  docker compose down
  ```
- **Reiniciar los servicios:**
  ```bash
  docker compose restart
  ```
- **Ver logs:**
  ```bash
  docker compose logs -f
  ```
- **Eliminar volúmenes persistentes:**
  ```bash
  docker compose down -v
  ```

## Notas importantes
- Asegúrate de que los archivos de configuración en `src/config` estén correctamente configurados.
- Si necesitas acceder a RabbitMQ, la interfaz web estará disponible en `http://localhost:15672`.
- La base de datos MySQL estará expuesta en el puerto `3307` en la máquina host.

---

¡Listo para usar! 🚀

    