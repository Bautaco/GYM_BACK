# 🏋️ Backend - Sistema de Gestión de Entrenamiento Físico y Seguimiento

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0803?style=for-the-badge&logo=typeorm&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

Servicio Backend modular, desacoplado y de nivel empresarial diseñado para la **prescripción, gestión y auditoría del entrenamiento físico y la progresión biomecánica** entre entrenadores profesionales, atletas y administradores del sistema. Construido bajo principios de **Domain-Driven Design (DDD)** y Arquitectura en Capas Limpias con **NestJS**, **TypeORM** y **TypeScript**.

---

## 🎯 1. Propósito y Alcance del Sistema

Este microservicio backend actúa como el núcleo de lógica de negocio, validaciones de dominio y persistencia para la plataforma de entrenamiento físico.

### Capacidades Centrales
- **Control de Acceso Basado en Roles (RBAC Estricto)**: Tres roles bien definidos: **`ADMIN`**, **`ENTRENADOR`** y **`ATLETA`**, gobernados mediante autenticación criptográfica vía JWT y guardias declarativas (`@Roles()`, `RolesGuard`).
- **Gestión Centralizada de Usuarios (Sin Registro Público Abierto)**: La creación de nuevas cuentas de entrenadores y atletas está restringida exclusivamente al administrador (`ADMIN`), garantizando control sobre el acceso institucional.
- **Catálogo Multimedia de Ejercicios**: Administración técnica completa (CRUD) con clasificación por grupo muscular, zonas biomecánicas trabajadas y enlace a material audiovisual in-app (con soporte para YouTube estándar, YouTube Shorts y videos directos).
- **Prescripción y Versionado de Planes**: Modelado de microciclos y rutinas estructuradas (series objetivo, repeticiones sugeridas, descansos). Al activar un nuevo plan para un atleta, las versiones anteriores se archivan automáticamente para mantener una única versión activa.
- **Gestión de Plantillas de Rutina (Templates)**: Biblioteca de rutinas reutilizables para que los entrenadores puedan agilizar la prescripción de programas.
- **Registro Real de Ejecución (Workout Sessions)**: Registro granular de marcas reales (peso levantado en kg y repeticiones logradas por serie), cálculo de RPE (escala Borg/RPE) y feedback de fatiga.
- **Detección de Récords Personales (PRs)**: Identificación de cargas máximas históricas por ejercicio superadas durante las sesiones.
- **Métricas Antropométricas y Analíticas**: Registro cronológico de peso corporal, cálculo de progresión de cargas máximas y cálculo de tasa de adherencia al plan de entrenamiento.
- **Autogestión de Perfil y Credenciales**: Modificación de datos personales, teléfono, notas del atleta, selección de avatares y cambio seguro de contraseñas con verificación mediante `bcrypt`.

> 🚫 **Delimitación de Alcance (Exclusiones Deliberadas)**: En estricta concordancia con la definición del producto, este sistema **no contempla** ni implementa procesamiento de pagos, suscripciones monetarias, pasarelas de cobro, facturación ni sistemas de reservas de turnos de asistencia física.

---

## 🏗️ 2. Arquitectura de Software (Domain-Driven Design - DDD)

El sistema adopta los patrones tácticos de **Domain-Driven Design (DDD)** combinados con arquitectura en capas concéntricas, asegurando que la lógica del negocio permanezca independiente de frameworks y detalles de persistencia.

```
GYM_BACK/
├── src/
│   ├── shared/                           # 🌐 Capa Compartida Transversal
│   │   ├── decorators/                   # @Roles(), @CurrentUser()
│   │   ├── filters/                      # AllExceptionsFilter (Manejo centralizado de errores)
│   │   └── guards/                       # JwtAuthGuard, RolesGuard
│   │
│   ├── users/                            # 👤 Bounded Context: Usuarios y Autenticación
│   │   ├── domain/                       # Entidades y Contratos de Dominio
│   │   │   ├── user.entity.ts            # Entidad raíz User
│   │   │   ├── user-role.enum.ts         # ADMIN | ENTRENADOR | ATLETA
│   │   │   └── user.repository.interface.ts # Puerto secundario (Repository Interface)
│   │   ├── application/                  # Casos de Uso y Servicios
│   │   │   ├── auth.service.ts           # Login, validación de credenciales y emisión JWT
│   │   │   └── users.service.ts          # Gestión administrativa de usuarios, perfil y cambio de clave
│   │   ├── infrastructure/               # Adaptadores de Entrada/Salida
│   │   │   ├── user.orm-entity.ts        # Modelo TypeORM mapeado a la BD
│   │   │   ├── typeorm-user.repository.ts# Adaptador de persistencia
│   │   │   └── jwt.strategy.ts           # Estrategia Passport JWT
│   │   └── presentation/                 # Adaptador Primario (API REST)
│   │       ├── auth.controller.ts        # Endpoints /api/v1/auth
│   │       ├── users.controller.ts       # Endpoints /api/v1/users (Gestión Admin y Perfil)
│   │       └── dtos/                     # LoginDto, CreateUserAdminDto, UpdateProfileDto
│   │
│   ├── training/                         # 🏋️ Bounded Context: Entrenamiento y Métricas
│   │   ├── domain/                       # Entidades Puras de Negocio
│   │   │   ├── exercise.entity.ts        # Agregado Ejercicio
│   │   │   ├── training-plan.entity.ts   # Aggregate Root: TrainingPlan
│   │   │   ├── routine.entity.ts         # Entidad Routine (parte del agregado Plan)
│   │   │   ├── exercise-item.entity.ts   # Item de ejercicio con series/reps sugeridas
│   │   │   ├── workout-session.entity.ts # Aggregate Root: Sesión de Entrenamiento ejecutada
│   │   │   ├── logged-set.entity.ts      # Series ejecutadas con peso y reps reales
│   │   │   ├── body-weight.entity.ts     # Registro antropométrico
│   │   │   ├── routine-template.entity.ts# Agregado Plantilla de Rutina
│   │   │   ├── exercise.repository.interface.ts
│   │   │   ├── training-plan.repository.interface.ts
│   │   │   └── workout-session.repository.interface.ts
│   │   ├── application/                  # Casos de Uso (Orquestación del Dominio)
│   │   │   ├── exercise.service.ts       # CRUD y catálogo de ejercicios
│   │   │   ├── training-plan.service.ts  # Creación, versionado y consulta de planes
│   │   │   ├── workout-session.service.ts# Registro de series y finalización de sesión
│   │   │   ├── body-weight.service.ts    # Historial de pesajes
│   │   │   ├── analytics.service.ts      # Progresión de cargas y cálculo de adherencia
│   │   │   └── routine-template.service.ts# Biblioteca de plantillas de entrenamiento
│   │   ├── infrastructure/               # Modelos TypeORM y Repositorios Concretos
│   │   │   ├── exercise.orm-entity.ts
│   │   │   ├── training-plan.orm-entity.ts
│   │   │   ├── routine.orm-entity.ts
│   │   │   ├── exercise-item.orm-entity.ts
│   │   │   ├── workout-session.orm-entity.ts
│   │   │   ├── logged-set.orm-entity.ts
│   │   │   ├── body-weight.orm-entity.ts
│   │   │   ├── routine-template.orm-entity.ts
│   │   │   ├── typeorm-exercise.repository.ts
│   │   │   ├── typeorm-training-plan.repository.ts
│   │   │   ├── typeorm-workout-session.repository.ts
│   │   │   ├── typeorm-routine-template.repository.ts
│   │   │   └── database-seeder.service.ts# Sembrado automático de datos demo
│   │   └── presentation/                 # Controladores y Validadores de Entrada
│   │       ├── exercise.controller.ts
│   │       ├── training-plan.controller.ts
│   │       ├── workout-session.controller.ts
│   │       ├── body-weight.controller.ts
│   │       ├── analytics.controller.ts
│   │       ├── routine-template.controller.ts
│   │       └── dtos/                     # CreateExerciseDto, CreatePlanDto, LogSessionDto, etc.
│   │
│   ├── app.module.ts                     # Módulo raíz e inyección de dependencias
│   └── main.ts                           # Bootstrap, Swagger/Pipes/Filtros globales
```

### Bounded Contexts y Raíces de Agregado (Aggregate Roots)

| Bounded Context | Raíz de Agregado | Entidades / Value Objects Internos | Invariantes de Negocio |
| :--- | :--- | :--- | :--- |
| **Users** | `User` | Role (`ADMIN`, `ENTRENADOR`, `ATLETA`), Email, PasswordHash, AvatarUrl | El correo es estrictamente único. Las contraseñas se almacenan con salt `bcrypt`. Solo el `ADMIN` puede crear o eliminar usuarios. Ningún usuario puede alterar su propio rol. |
| **Training (Catálogo)** | `Exercise` | MuscleGroup, TargetZones, Equipment, VideoUrl | Nombre requerido, grupo muscular obligatorio, URL de video normalizada. Solo editables por entrenadores. |
| **Training (Prescripción)** | `TrainingPlan` | `Routine`, `ExerciseItem` | Solo puede haber **un plan en estado `ACTIVO`** por atleta a la vez. Al crear un nuevo plan, los anteriores pasan a archivados. |
| **Training (Plantillas)** | `RoutineTemplate`| `TemplateExerciseItem`, TrainerId | Plantillas reutilizables para entrenadores para agilizar armado de rutinas. |
| **Training (Ejecución)** | `WorkoutSession` | `LoggedSet`, RPE, Duration, SessionDate | Las series registradas no admiten pesos negativos ni repeticiones menores a cero. Una sesión finalizada queda sellada. |
| **Analytics & Antropometría**| `BodyWeightRecord`| Weight (kg), Date | El peso debe ser numérico positivo válido. Se indexa por atleta y marca temporal. |

---

## ⚙️ 3. Requisitos Previos e Instalación

### Requisitos de Entorno
- **Node.js**: Versión LTS recomendada `v18.x`, `v20.x` o superior.
- **Gestor de Paquetes**: `npm v9+` o `pnpm v8+`.
- **Base de Datos**: 
  - **SQLite3** (Modo por defecto: Cero configuración adicional, genera `gym.sqlite`).
  - **PostgreSQL 14+** (Soportado para entornos productivos mediante cambio de `DB_TYPE=postgres`).

### Variables de Entorno

Crear un archivo `.env` en la raíz de `GYM_BACK` tomando como base `.env.example`:

```bash
cp .env.example .env
```

#### Contenido de `.env.example`
```env
# Configuración del Servidor
PORT=3000
NODE_ENV=development

# Configuración de Base de Datos (sqlite | postgres)
DB_TYPE=sqlite
DB_DATABASE=gym.sqlite

# Parámetros para PostgreSQL (cuando DB_TYPE=postgres)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=gym_db

# Seguridad y Autenticación JWT
JWT_SECRET=super_secret_jwt_key_apex_fit_2026_production_change_me
JWT_EXPIRES_IN=7d

# Habilitar Seeder Automático (true en desarrollo para sembrar usuarios y ejercicios de prueba)
SEED_DATABASE=true
```

### Paso a Paso de Instalación

1. **Clonar el repositorio y situarse en la carpeta:**
   ```bash
   cd GYM_BACK
   ```

2. **Instalar dependencias:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Iniciar en entorno de Desarrollo (Watch mode con recarga en caliente):**
   ```bash
   npm run start:dev
   ```
   *La base de datos se inicializará y el servicio sembrará automáticamente las credenciales demo y el catálogo completo de ejercicios con videos operativos.*

4. **Compilar para Producción:**
   ```bash
   npm run build
   ```

5. **Iniciar en Producción:**
   ```bash
   npm run start:prod
   ```

---

## 📡 4. Especificación Completa de la API REST (Endpoints & DTOs)

Todos los endpoints protegidos requieren la cabecera HTTP estándar:
```http
Authorization: Bearer <JWT_TOKEN>
```

### 🔐 Módulo: Autenticación (`/api/v1/auth`)

| Método | Endpoint | Roles | Descripción | Request Body / Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Público | Autenticación con email y contraseña | **Body**: `{ "email": "...", "password": "..." }`<br>**Respuesta 200**: `{ "accessToken": "...", "user": { "id", "email", "fullName", "role", "avatarUrl" } }` |
| `POST` | `/api/v1/auth/register`| Público | Registro base (mantenido para tests y compatibilidad) | **Body**: `{ "email": "...", "password": "...", "fullName": "...", "role": "ATLETA" }` |
| `GET` | `/api/v1/auth/me` | Autenticado | Obtiene la información del usuario en sesión | **Respuesta 200**: Datos completos del usuario autenticado |

### 👥 Módulo: Usuarios, Administración y Perfil (`/api/v1/users`)

| Método | Endpoint | Roles | Descripción | Request Body / Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/users/admin/all` | `ADMIN` | Listado completo de usuarios del sistema | **Respuesta 200**: `Array<User>` con todos los campos |
| `POST` | `/api/v1/users/admin/create`| `ADMIN` | Alta de nuevo usuario con rol asignado | **Body**: `{ "email": "...", "password": "...", "fullName": "...", "role": "ENTRENADOR" \| "ATLETA", "phone": "..." }`<br>**Respuesta 201**: Usuario creado |
| `DELETE`| `/api/v1/users/admin/:id` | `ADMIN` | Baja definitiva de un usuario | **Respuesta 200**: Confirmación de eliminación |
| `GET` | `/api/v1/users/trainers` | Autenticado | Listado de entrenadores disponibles | **Respuesta 200**: `Array<User>` con rol ENTRENADOR |
| `GET` | `/api/v1/users/athletes` | `ENTRENADOR`, `ADMIN` | Listado de todos los atletas registrados | **Respuesta 200**: `Array<User>` con rol ATLETA |
| `PATCH` | `/api/v1/users/me` | Autenticado | Autogestión de perfil (nombre, teléfono, notas, avatar y contraseña) | **Body (opcional)**: `{ "fullName": "...", "phone": "...", "notes": "...", "avatarUrl": "...", "currentPassword": "...", "newPassword": "..." }` |
| `PATCH` | `/api/v1/users/profile` | Autenticado | Alias para actualización de perfil | Idéntico a `/api/v1/users/me` |
| `GET` | `/api/v1/users/:id` | Autenticado | Detalle público del perfil de un usuario | **Respuesta 200**: Perfil de usuario |

### 🏋️ Módulo: Catálogo de Ejercicios (`/api/v1/exercises`)

| Método | Endpoint | Roles | Descripción | Request Body / Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/exercises` | Autenticado | Consulta de todos los ejercicios del catálogo | **Respuesta 200**: Lista de ejercicios con zonas trabajadas y video |
| `GET` | `/api/v1/exercises/:id` | Autenticado | Detalle de un ejercicio específico | **Respuesta 200**: Detalle técnico del ejercicio |
| `POST` | `/api/v1/exercises` | `ENTRENADOR` | Creación de un nuevo ejercicio técnico | **Body**: `{ "nombre": "Press Militar", "grupoMuscular": "Hombros", "zonasTrabajadas": "Deltoides anterior, Tríceps", "instrucciones": "...", "equipamiento": "Barra Olímpica", "videoUrl": "https://..." }` |
| `PATCH` | `/api/v1/exercises/:id` | `ENTRENADOR` | Modificación completa de datos de un ejercicio | **Body**: Parcial de `CreateExerciseDto` |
| `DELETE`| `/api/v1/exercises/:id` | `ENTRENADOR` | Eliminación definitiva de un ejercicio | **Respuesta 204**: Sin contenido |

### 📋 Módulo: Plantillas de Rutinas (`/api/v1/templates`)

| Método | Endpoint | Roles | Descripción | Request Body / Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/templates` | Autenticado | Consulta las plantillas guardadas | **Respuesta 200**: `Array<RoutineTemplate>` |
| `GET` | `/api/v1/templates/:id` | Autenticado | Detalle de una plantilla específica | **Respuesta 200**: Objeto plantilla con sus ejercicios |
| `POST` | `/api/v1/templates` | `ENTRENADOR`, `ADMIN` | Guarda una nueva plantilla de rutina | **Body**: `{ "nombre": "Torso Hipertrofia", "descripcion": "...", "items": [ { "ejercicioId": "...", "seriesObjetivo": 4, "repeticionesSugeridas": "8-10", "descansoSegundos": 90 } ] }` |
| `DELETE`| `/api/v1/templates/:id` | `ENTRENADOR`, `ADMIN` | Elimina una plantilla | **Respuesta 200**: Confirmación de eliminación |

### 📅 Módulo: Planes de Entrenamiento (`/api/v1/training-plans`)

| Método | Endpoint | Roles | Descripción | Request Body / Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/training-plans` | `ENTRENADOR` | Crea y activa un plan de entrenamiento con rutinas | **Body**: `{ "nombre": "Fuerza 4 Días", "atletaId": "...", "fechaInicio": "2026-10-01", "fechaFin": "2026-11-01", "rutinas": [ { "nombreDia": "Día 1 - Torso", "items": [ { "ejercicioId": "...", "seriesObjetivo": 4, "repeticionesSugeridas": "6-8", "descansoSegundos": 120 } ] } ] }` |
| `GET` | `/api/v1/training-plans/athlete/:id` | Autenticado | Retorna el plan de entrenamiento **ACTIVO** del atleta | **Respuesta 200**: Objeto `TrainingPlan` activo con rutinas e items |
| `GET` | `/api/v1/training-plans/athlete/:id/all` | Autenticado | Historial completo de planes del atleta | **Respuesta 200**: `Array<TrainingPlan>` (activos e históricos) |
| `GET` | `/api/v1/training-plans/:id` | Autenticado | Detalle de un plan por su ID | **Respuesta 200**: Objeto `TrainingPlan` |

### ⏱️ Módulo: Ejecución de Sesiones (`/api/v1/training-sessions`)

| Método | Endpoint | Roles | Descripción | Request Body / Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/training-sessions/log` | `ATLETA` | Registra la ejecución real de una rutina completada | **Body**: `{ "atletaId": "...", "rutinaId": "...", "duracionMinutos": 60, "rpe": 8, "feedback": "Buena congestión", "series": [ { "ejercicioId": "...", "numeroSerie": 1, "pesoKg": 100, "repeticionesLogradas": 8 } ] }` |
| `GET` | `/api/v1/training-sessions/athlete/:id` | Autenticado | Historial cronológico de sesiones realizadas | **Respuesta 200**: `Array<WorkoutSession>` ordenado por fecha |

### ⚖️ Módulo: Antropometría y Analítica (`/api/v1/athletes` y `/api/v1/analytics`)

| Método | Endpoint | Roles | Descripción | Request Body / Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/athletes/:id/body-weight` | `ATLETA` | Registro de peso corporal | **Body**: `{ "pesoKg": 78.5, "fecha": "2026-10-14" }` |
| `GET` | `/api/v1/athletes/:id/body-weight` | Autenticado | Historial cronológico de pesajes | **Respuesta 200**: `Array<{ id, pesoKg, fecha }>` |
| `GET` | `/api/v1/analytics/athletes/:id/strength-progress` | Autenticado | Serie temporal de peso máximo alcanzado por ejercicio | **Respuesta 200**: `{ "ejercicios": [ { "ejercicio": "Press de Banca", "historial": [ { "fecha", "pesoMaximo" } ] } ] }` |
| `GET` | `/api/v1/analytics/athletes/:id/adherence` | Autenticado | Tasa porcentual de adherencia y sesiones completadas | **Respuesta 200**: `{ "sesionesCompletadas": 12, "sesionesEsperadas": 15, "porcentajeAdherencia": 80 }` |

---

## 🧪 5. Estrategia de Testeo y Aseguramiento de Calidad (QA)

El backend incorpora suites automatizadas de pruebas unitarias y de integración end-to-end con **Jest** y `@nestjs/testing`:

```bash
# Ejecutar todas las pruebas unitarias
npm run test

# Ejecutar pruebas en modo observador (TDD)
npm run test:watch

# Generar reporte de cobertura de código
npm run test:cov

# Ejecutar pruebas End-to-End (E2E)
npm run test:e2e
```

### Arquitectura de Pruebas
1. **Reglas de Dominio**: Se evalúan de forma pura, sin dependencias de base de datos ni frameworks, comprobando que las entidades (`TrainingPlan`, `WorkoutSession`, `User`) apliquen correctamente sus invariantes (ej. no permitir series negativas, versionado de planes, inmutabilidad de roles).
2. **Servicios de Aplicación**: Se prueban inyectando implementaciones simuladas (mocks) de las interfaces de repositorios para aislar la orquestación de la infraestructura.
3. **Controladores e Integración**: Verificación de pipes de validación, manejo de códigos de estado HTTP (200, 201, 204, 400, 401, 403, 404) y protección de rutas mediante `@UseGuards(JwtAuthGuard, RolesGuard)`.

---

## 💎 6. Principios de Calidad y Convenciones de Código

- **Validación Estricta de Entradas**: Todos los DTOs implementan decoradores de `class-validator` y `class-transformer` (`@IsNotEmpty`, `@IsString`, `@IsNumber`, `@Min`, `@IsUrl`, `@IsEnum`). Un `ValidationPipe` global con `{ whitelist: true, forbidNonWhitelisted: true }` descarta automáticamente cualquier propiedad no autorizada en el payload.
- **Filtro Global de Excepciones**: Implementación de [`AllExceptionsFilter`](file:///d:/Bautaco/Documents/Universidad/Ingenieria%20y%20calidad%20de%20software/Proyecto%203/GYM/GYM_BACK/src/shared/filters/http-exception.filter.ts) que intercepta errores HTTP y de base de datos, unificando la salida JSON en un formato consistente con marca de tiempo y ruta.
- **Linters y Formato**: Configuración estricta de **ESLint** y **Prettier** para mantener estándares de estilo en todo el equipo.
- **Seguridad Criptográfica**: Las contraseñas se almacenan mediante hashing irreversibles con **bcryptjs** (cost factor 10). Las firmas de los tokens JWT utilizan claves seguras configurables vía entorno.

---

## 👤 7. Usuarios y Credenciales Demo Precargadas

Al iniciar con `SEED_DATABASE=true`, la base de datos se sembrará con las siguientes cuentas de prueba:

| Rol | Correo Electrónico | Contraseña | Vistas y Capacidades |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@gym.com` | `admin123` | Control total de usuarios (crear/eliminar entrenadores y atletas), auditoría global |
| **ENTRENADOR** | `entrenador@gym.com` | `admin123` | Control de catálogo de ejercicios, creación y asignación de planes, biblioteca de plantillas, auditoría de métricas de alumnos |
| **ATLETA 1** | `atleta@gym.com` | `atleta123` | Plan de 2 días activo, historial de series y pesajes cargados, registro interactivo |
| **ATLETA 2** | `marcos@gym.com` | `atleta123` | Alumno registrado disponible para asignación de nuevos planes de entrenamiento |
