# 🏋️ Backend - Sistema de Gestión de Entrenamiento Físico y Seguimiento (APEX FIT)

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0803?style=for-the-badge&logo=typeorm&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)

Servicio Backend modular, desacoplado y de nivel empresarial diseñado para la **prescripción, gestión y auditoría del entrenamiento físico, métricas institucionales de alto rendimiento y progresión biomecánica** entre directores deportivos (`ADMIN`), entrenadores profesionales (`ENTRENADOR`) y atletas (`ATLETA`). Construido bajo principios de **Domain-Driven Design (DDD)** y Arquitectura Limpia en Capas con **NestJS**, **TypeORM**, **PostgreSQL / SQLite**, **Vitest** y **TypeScript**.

---

## 🎯 1. Propósito y Alcance del Sistema

Este servicio backend actúa como el núcleo de lógica de negocio, validaciones de dominio y persistencia para la plataforma de entrenamiento físico.

### Capacidades Centrales
- **Control de Acceso Basado en Roles (RBAC Estricto)**: Tres roles diferenciados: **`ADMIN`**, **`ENTRENADOR`** y **`ATLETA`**, gobernados mediante autenticación criptográfica vía JWT y guardias declarativas (`@Roles()`, `RolesGuard`).
- **Dashboard Ejecutivo para Administradores del CAR**: Panel analítico de métricas estratégicas institucionales (`/api/v1/analytics/admin/overview`) con:
  - **Adherencia y Cobertura**: Tasa global y por atleta agrupada en semáforos verde (`≥80%`), amarillo (`50–79%`) y rojo (`<50%`), y porcentaje de cobertura de planes activos (`activePlanCoveragePercentage`).
  - **Carga, Fatiga y Rendimiento**: Distribución de RPE en 4 bandas de intensidad, RPE promedio, volumen total levantado en kilogramos (tonelaje), PRs detectados y evolución antropométrica.
  - **Operación del Staff y Catálogo**: Carga de atletas por entrenador, uso de plantillas de rutina, desglose de usuarios por rol y auditoría de cobertura multimedia del catálogo de ejercicios.
  - **Filtros Flexibles**: Filtros por período (`all`, `30d`, `90d`, `365d`, o rangos de fecha `startDate`/`endDate`), entrenador asignado y rango de adherencia.
- **Catálogo de Ejercicios Biomecánico Dinámico**:
  - Clasificación por grupo muscular principal y zonas musculares trabajadas registradas dinámicamente en base de datos.
  - Soporte multimedia completo para videos in-app (YouTube estándar, YouTube Shorts y enlaces directos MP4/WebM).
  - Manejo completo de ejercicios sin video: eliminación persistente enviando `null` y estados de fallback amigables.
- **Prescripción y Versionado de Planes de Entrenamiento**:
  - Modelado de microciclos y rutinas estructuradas (series objetivo, repeticiones sugeridas, descansos, cadencia/tempo).
  - Al activar un nuevo plan, los planes previos pasan automáticamente a archivados.
  - Configuración de frecuencia semanal y sesiones por día.
  - **Validación Estricta de Superposición de Fechas (Overlap Validation)** que impide solapar microciclos activos o programados.
- **Biblioteca de Plantillas de Rutina (Templates)**: Rutinas reutilizables para que los entrenadores agilicen la prescripción.
- **Registro Real de Ejecución (Workout Sessions)**: Registro granular serie por serie de marcas reales (kg levantados y repeticiones), cálculo de RPE (escala Borg 1–10) y duración en minutos.
- **Value Objects Puros e Inmutables (SPMP 6.5.2 & 6.8.5)**: Modelado táctico con `Rpe`, `PesoKg`, `SerieRegistrada`, `Weight`, `Duration` y `SessionDate` garantizando autovalidación fail-fast e inmutabilidad.
- **Detección Automática de Récords Personales (PRs)**: Detección instantánea de superación de marcas históricas de peso máximo y 1RM estimado al guardar cada sesión.
- **Antropometría y Analítica Individual**: Registro de pesajes corporales, historial cronológico y curvas de progresión de cargas máximas por ejercicio.

> 🚫 **Delimitación de Alcance**: En estricta concordancia con la especificación del dominio deportivo, este sistema **no contempla** procesamiento de pagos, suscripciones monetarias, facturación ni molinetes/control de aforo físico.

---

## 🏗️ 2. Arquitectura de Software (Domain-Driven Design - DDD)

```
GYM_BACK/
├── SEED/                                 # 📦 Datos Semilla y Respaldos JSON de PostgreSQL
│   ├── json/                             # Exportaciones JSON por tabla (users, exercises, sessions...)
│   └── README.md                         # Documentación del seed institucional
│
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
│   │   │   └── user.repository.interface.ts # Puerto secundario
│   │   ├── application/                  # Casos de Uso (auth.service, users.service)
│   │   ├── infrastructure/               # Persistencia TypeORM y JWT Strategy
│   │   └── presentation/                 # auth.controller, users.controller y DTOs
│   │
│   ├── training/                         # 🏋️ Bounded Context: Entrenamiento y Métricas
│   │   ├── domain/                       # Entidades y Value Objects Puros
│   │   │   ├── value-objects/            # Rpe, PesoKg, SerieRegistrada, Weight, Duration, SessionDate
│   │   │   ├── exercise.entity.ts        # Entidad Ejercicio
│   │   │   ├── training-plan.entity.ts   # Aggregate Root: TrainingPlan
│   │   │   ├── routine.entity.ts         # Rutina del plan
│   │   │   ├── exercise-item.entity.ts   # Ejercicio sugerido en rutina
│   │   │   ├── workout-session.entity.ts # Aggregate Root: Sesión de entrenamiento ejecutada
│   │   │   ├── logged-set.entity.ts      # Serie registrada
│   │   │   ├── body-weight-record.entity.ts # Registro antropométrico
│   │   │   ├── routine-template.entity.ts# Plantilla de rutina
│   │   │   └── *.repository.interface.ts # Contratos de repositorios
│   │   ├── application/                  # Servicios de Aplicación
│   │   │   ├── analytics.service.ts      # Métricas ejecutivas CAR, adherencia y progresión
│   │   │   ├── exercise.service.ts       # CRUD de catálogo, grupos musculares y videos
│   │   │   ├── training-plan.service.ts  # Planes, versionado y validación de superposición
│   │   │   ├── workout-session.service.ts# Ejecución, RPE y detección de PRs
│   │   │   ├── body-weight.service.ts    # Historial de pesajes
│   │   │   └── routine-template.service.ts# Plantillas reutilizables
│   │   ├── infrastructure/               # Modelos TypeORM y Repositorios Concretos
│   │   │   ├── *.orm-entity.ts           # Modelos mapeados a PostgreSQL / SQLite
│   │   │   ├── typeorm-*.repository.ts   # Implementaciones de persistencia
│   │   │   └── database-seeder.service.ts# Sembrado inicial automático
│   │   └── presentation/                 # Controladores REST y DTOs
│   │       ├── analytics.controller.ts   # Métricas y Dashboard CAR
│   │       ├── exercise.controller.ts    # Catálogo de ejercicios
│   │       ├── training-plan.controller.ts
│   │       ├── workout-session.controller.ts
│   │       └── dtos/
│   │
│   ├── app.module.ts                     # Módulo raíz de la aplicación
│   └── main.ts                           # Bootstrap, Swagger, ValidationPipe global y CORS
```

---

## ⚙️ 3. Configuración, Base de Datos e Instalación

### Requisitos de Entorno
- **Node.js**: Versión LTS `v20.x` o `v22.x` recomendada.
- **PostgreSQL**: `v14+` en puerto `5432` con base de datos `gym_db`.
- **SQLite3**: Alternativa ligera embebida sin configuración adicional.

### Archivo `.env`

```env
PORT=3000
NODE_ENV=development

# Configuración de Base de Datos (postgres | sqlite)
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=Bautaco
DB_NAME=gym_db

# Para SQLite (alternativo):
# DB_TYPE=sqlite
# DB_DATABASE=gym.sqlite

# Seguridad y Autenticación JWT
JWT_SECRET=super_secret_jwt_key_apex_fit_2026_production_change_me
JWT_EXPIRES_IN=7d

# Sembrador Automático (opcional en primer arranque)
SEED_DATABASE=false
```

### Comandos de Ejecución

```bash
# 1. Instalar dependencias
npm install --legacy-peer-deps

# 2. Iniciar en modo desarrollo (Watch mode)
npm run start:dev

# 3. Compilar para producción (0 errores TypeScript)
npm run build

# 4. Iniciar en modo producción
npm run start:prod
```

---

## 📡 4. Especificación de Endpoints Principales (API REST)

Todos los endpoints protegidos requieren el encabezado:
```http
Authorization: Bearer <JWT_TOKEN>
```

### 📊 Métricas Institucionales y Analíticas (`/api/v1/analytics`)
| Método | Endpoint | Roles | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/analytics/admin/overview` | `ADMIN` | Dashboard ejecutivo CAR (Adherencia, Cobertura, RPE, Tonelaje, PRs, Carga Staff y Catálogo). Acepta `period`, `startDate`, `endDate`, `trainerId`, `adherenceRange`. |
| `GET` | `/api/v1/analytics/athletes/:id/adherence` | Autenticado | Tasa porcentual de adherencia y sesiones esperadas vs. completadas del atleta. |
| `GET` | `/api/v1/analytics/athletes/:id/strength-progress` | Autenticado | Progresión temporal de peso máximo alcanzado por ejercicio (`?exerciseId=...`). |

### 🏋️ Catálogo de Ejercicios (`/api/v1/exercises`)
| Método | Endpoint | Roles | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/exercises` | Autenticado | Lista completa de ejercicios del catálogo. |
| `GET` | `/api/v1/exercises/muscle-groups` | Autenticado | Grupos musculares registrados y consolidados. |
| `GET` | `/api/v1/exercises/target-zones` | Autenticado | Zonas musculares trabajadas dinámicas. |
| `POST` | `/api/v1/exercises` | `ENTRENADOR` | Crea un ejercicio registrando grupos y zonas si no existían. |
| `PATCH` | `/api/v1/exercises/:id` | `ENTRENADOR` | Edición completa. Enviar `videoUrl: null` o `""` elimina el video. |
| `DELETE`| `/api/v1/exercises/:id` | `ENTRENADOR` | Eliminación de un ejercicio. |

### 📅 Planes y Sesiones (`/api/v1/training-plans` y `/api/v1/training-sessions`)
| Método | Endpoint | Roles | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/training-plans` | `ENTRENADOR` | Crea y activa un plan de entrenamiento con validación de superposición de fechas. |
| `PUT` | `/api/v1/training-plans/:id` | `ENTRENADOR` | Actualiza un plan existente revalidando rangos temporales. |
| `GET` | `/api/v1/training-plans/athlete/:id` | Autenticado | Obtiene el plan activo del atleta. |
| `GET` | `/api/v1/training-plans/athlete/:id/all` | Autenticado | Historial cronológico completo de planes del atleta. |
| `POST` | `/api/v1/training-sessions/log` | `ATLETA` | Registra sesión ejecutada, RPE, duración y detecta récords personales (PRs). |

---

## 🧪 5. Testing y Aseguramiento de Calidad (QA)

El backend cuenta con **7 suites de prueba y 74 tests automatizados pasando al 100%**:

```bash
# Ejecutar todas las pruebas unitarias y de integración
npm test

# Ejecutar pruebas en modo observador (watch)
npm run test:watch

# Generar reporte de cobertura de código
npm run test:cov
```

### Cobertura de las Suites
- **`value-objects.spec.ts` (23 tests)**: Inmutabilidad, comparación por valor y autovalidaciones de los Value Objects del dominio (`Rpe`, `PesoKg`, `SerieRegistrada`, `Weight`, `Duration`, `SessionDate`).
- **`analytics.service.spec.ts` (16 tests)**: Métricas CAR de adherencia, cobertura de planes, fatiga/RPE, PRs, antropometría, auditoría de entrenadores, catálogo multimedia y filtros temporales.
- **`exercise.service.spec.ts` (13 tests)**: Creación de ejercicios, sincronización automática de grupos musculares y eliminación persistente de video (`null`/`""`).
- **`exercise.controller.spec.ts` (7 tests)**: Control de endpoints REST de ejercicios, grupos y zonas.
- **`training-plan.service.spec.ts` (8 tests)**: Creación, archivado de planes anteriores y validación contra superposición de fechas.
- **`workout-session.service.spec.ts` (6 tests)**: Registro de series, validación de pesos no negativos y detección de PRs.
- **`app.controller.spec.ts` (1 test)**: Comprobación de salud e inyección del core NestJS.

---

## 🔑 6. Usuarios Demo Precargados

| Rol | Correo Electrónico | Contraseña | Vistas y Capacidades |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@gym.com` | `admin123` | Control total de usuarios, auditoría general y Dashboard Ejecutivo de Alto Rendimiento |
| **ENTRENADOR** | `entrenador@gym.com` | `admin123` | Constructor de planes, biblioteca de plantillas, catálogo de ejercicios y métricas de alumnos |
| **ATLETA 1** | `atleta@gym.com` | `atleta123` | Atleta con plan activo, historial de series registradas, pesajes y gráficos de progresión |
| **ATLETA 2** | `marcos@gym.com` | `atleta123` | Atleta registrado disponible para prescripción de nuevos programas |
