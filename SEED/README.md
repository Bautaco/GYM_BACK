# 📦 SEED - Copia de Seguridad y Datos Oficiales de PostgreSQL (`gym_db`)

Esta carpeta dentro de **`GYM_BACK/SEED`** contiene la exportación completa y estructurada de la base de datos PostgreSQL **`gym_db`** del sistema **APEX FIT / GYM**.

---

## 📂 Contenido del Directorio

| Archivo / Carpeta | Tipo | Descripción |
| :--- | :--- | :--- |
| **`gym_db_full_dump.sql`** | SQL Dump Completo | Esquema completo (tablas, secuencias, claves foráneas, índices) más todos los datos. Ideal para inicializar una base de datos nueva o restaurar desde cero. |
| **`gym_db_data_inserts.sql`** | SQL Inserts Puros | Sentencias estándar `INSERT INTO <table> (...) VALUES (...)` para todas las tablas con nombres explícitos de columnas. Compatible con cualquier cliente SQL. |
| **`json/`** | Exportación JSON | Carpeta con un archivo `.json` independiente por cada una de las 11 tablas de la base de datos, en formato legible y listo para scripts o auditorías. |

---

## 📊 Tablas y Datos Respaldados

1. **`users`** (`json/users.json`): Usuarios registrados (Administradores, Entrenadores y Atletas) con contraseñas hasheadas (`bcrypt`), roles y avatares.
2. **`exercises`** (`json/exercises.json`): Catálogo técnico completo de ejercicios con descripciones biomecánicas y URLs de videos demostrativos.
3. **`muscle_groups`** (`json/muscle_groups.json`): Catálogo oficial de grupos musculares (Piernas, Pecho, Espalda, Hombros, Brazos, Core, etc.).
4. **`target_zones`** (`json/target_zones.json`): Zonas y subgrupos anatómicos trabajados por los movimientos.
5. **`routine_templates`** (`json/routine_templates.json`): Plantillas maestras de rutinas prediseñadas (Push, Pull, Legs, etc.).
6. **`training_plans`** (`json/training_plans.json`): Microciclos y planes asignados con fechas, estados, frecuencias semanales y sesiones diarias.
7. **`routines`** (`json/routines.json`): Días estructurados dentro de cada plan de entrenamiento.
8. **`exercise_items`** (`json/exercise_items.json`): Ejercicios prescritos por rutina con series, repeticiones sugeridas, cadencias y descansos.
9. **`workout_sessions`** (`json/workout_sessions.json`): Sesiones de entrenamiento ejecutadas por los atletas con RPE y feedback.
10. **`logged_sets`** (`json/logged_sets.json`): Series reales registradas (peso en kg levantado y repeticiones logradas por serie).
11. **`body_weight_records`** (`json/body_weight_records.json`): Historial antropométrico de pesajes corporales.

---

## 🚀 Cómo Restaurar la Base de Datos

### Opción 1: Desde la consola con `psql` (Recomendado)

Desde la carpeta `GYM_BACK`:
```bash
# 1. Crear la base de datos limpia (si aún no existe)
createdb -U postgres -h localhost gym_db

# 2. Restaurar esquema completo y datos
psql -U postgres -h localhost -d gym_db -f "SEED/gym_db_full_dump.sql"
```

### Opción 2: Solo los datos (si las tablas ya fueron creadas por TypeORM)

Desde la carpeta `GYM_BACK`:
```bash
psql -U postgres -h localhost -d gym_db -f "SEED/gym_db_data_inserts.sql"
```

### Opción 3: Desde la interfaz de pgAdmin 4

1. En el árbol izquierdo, haz clic derecho sobre la base de datos `gym_db`.
2. Selecciona **Restore...**
3. Elige el archivo `SEED/gym_db_full_dump.sql` y pulsa **Restore**.
