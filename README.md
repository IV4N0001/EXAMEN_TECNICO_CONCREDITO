# 📝 Lista de Tareas

Aplicación full stack de lista de tareas desarrollada con React (frontend) y NestJS (backend)

## 🚀 Tecnologías Utilizadas

### 📌 Frontend (React + Vite)
- `React 19` con `TypeScript`
- `react-router-dom` para manejo de rutas
- `react-toastify` para notificaciones
- `xlsx` y `xlsx-js-style` para exportación de datos a Excel

### 🛠 Backend (NestJS)
- `MySQL` como base de datos relacional
- `Redis` para manejo de caché y mejorar el rendimiento
- `RabbitMQ` para encolar mensajes de recuperación de contraseña fallidos
- `JWT` para autenticación de usuarios
- `bcrypt` para encriptación segura de contraseñas

### 📦 Infraestructura y Deploy
- `Docker` para empaquetar y desplegar la aplicación
- `Docker Compose` para orquestación de servicios

## 🔧 Instalación y Configuración

1. **Configurar variables de entorno**
   - Modificar los archivos de configuración en `src/config/` por los valores que tu necesites

2. **Construir y levantar los contenedores con Docker**
   ```bash
   docker compose build --no-cache && docker compose up
   ```

## 📡 Acceso a los Servicios

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend:** [http://localhost:3000](http://localhost:3000)
- **Interfaz de RabbitMQ:** [http://localhost:15672](http://localhost:15672)
- **Redis:** Conectado en `localhost:6379`
- **MySQL:** Disponible en el puerto `3306`

## 🎥 Demo de la Aplicación
Puedes ver una demostración del funcionamiento de la aplicación en el siguiente enlace:
[🔗 Ver Video](https://drive.google.com/file/d/1Ti4Po6yWwOPS24Lvl2C5YwDefDBo50eo/view)

---

