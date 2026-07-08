# Punto de Venta

Aplicación web full stack para gestionar productos, ventas y reportes de ventas. El proyecto está dividido en un backend con Express y MySQL, y un frontend con React y Vite.

## Requisitos previos

Asegúrate de tener instalado lo siguiente:

- Node.js 18 o superior
- npm 9 o superior
- MySQL en ejecución
- Git

## 1. Clonar el proyecto

```bash
git clone <url-del-repositorio>
cd punto-de-venta
```

## 2. Instalar dependencias

El proyecto usa npm para administrar las dependencias. Puedes instalar todo con los comandos de cada carpeta.

### Backend

Entrar al directorio del backend e instalar las dependencias:

```bash
cd backend
npm install express cors dotenv mysql2
```

Paquetes utilizados:

- express: framework para crear el servidor API
- cors: habilita solicitudes entre distintos orígenes
- dotenv: carga variables de entorno desde un archivo .env
- mysql2: conexión con MySQL

### Frontend

Entrar al directorio del frontend e instalar las dependencias:

```bash
cd ../frontend
npm install react react-dom
npm install -D vite @vitejs/plugin-react eslint @eslint/js @types/react @types/react-dom eslint-plugin-react-hooks eslint-plugin-react-refresh globals
```

Paquetes utilizados:

- react y react-dom: creación de la interfaz de usuario
- vite: herramienta de desarrollo y compilación rápida
- @vitejs/plugin-react: integración de React con Vite
- eslint y complementos: análisis estático del código

> Si prefieres, también puedes ejecutar simplemente `npm install` dentro de cada carpeta, ya que el archivo package.json ya contiene estas dependencias.

## 3. Configurar variables de entorno

### Backend

Crear un archivo llamado `.env` dentro de la carpeta `backend` con la siguiente estructura:

```env
PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=punto_de_venta
```

Asegúrate de tener creada la base de datos en MySQL y que las credenciales sean correctas.

### Frontend

Opcionalmente, puedes crear un archivo `.env` dentro de `frontend` si deseas cambiar la URL del backend:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

## 4. Levantar la aplicación

### Opción A: Ejecutar ambos proyectos desde la raíz

Desde la carpeta principal del proyecto:

```bash
cd ..
npm run dev
```

Este comando inicia:

- el backend en el puerto 4000
- el frontend en el puerto 5173

### Opción B: Ejecutar en terminales separadas

#### Terminal 1 - Backend

```bash
cd backend
node server.js
```

#### Terminal 2 - Frontend

```bash
cd frontend
npm run dev -- --host 127.0.0.1
```

## 5. Acceder a la aplicación

Una vez levantados los servicios, puedes abrir:

- Frontend: http://127.0.0.1:5173
- Backend: http://localhost:4000/api/health

## 6. Comandos útiles

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Notas

- Si cambias el puerto del backend en el archivo `.env`, también debes actualizar la URL del frontend.
- Si tienes problemas de conexión, revisa que MySQL esté corriendo y que las credenciales del `.env` sean correctas.
