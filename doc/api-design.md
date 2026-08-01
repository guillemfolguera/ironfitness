# API Design

## Modelos de datos

---

# User

Representa a un usuario registrado en la aplicación.

| Campo | Tipo | Validaciones | Notas |
|-------|------|--------------|-------|
| `name` | String | `required` | Nombre del usuario. |
| `email` | String | `required`, `unique` | Utilizado para iniciar sesión. |
| `password` | String | `required` | Contraseña almacenada de forma cifrada (bcrypt). |
| `objective` | String | `required`, `enum: ['lose-weight', 'gain-muscle', 'maintain']` | Objetivo físico del usuario. |
| `initialWeight` | Number | `required`, `min: 0` | Peso introducido durante el registro. |

### Mongoose Schema

```javascript
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    objective: {
      type: String,
      enum: ["lose-weight", "gain-muscle", "maintain"],
      required: true,
    },
    initialWeight: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);
```

---

# WeeklyRoutine

Representa la planificación completa de entrenamiento de una semana.

**Restricción:** un usuario solo puede tener una rutina por semana.

| Campo | Tipo | Validaciones | Notas |
|-------|------|--------------|-------|
| `week` | Date | `required` | Fecha correspondiente al lunes de la semana. |
| `owner` | ObjectId | `required`, `ref: 'User'` | Usuario propietario de la rutina. |
| `days` | Array | `required` | Lista de entrenamientos planificados para la semana. |

### days[]

Cada elemento del array representa un día de la semana.

| Campo | Tipo | Validaciones | Notas |
|-------|------|--------------|-------|
| `day` | String | `required`, `enum` | Día de la semana. |
| `trainingType` | String | - | Tipo de entrenamiento. Si está vacío, se considera un día de descanso. |
| `duration` | Number | `min: 0` | Duración estimada en minutos. |
| `details` | String | - | Descripción del entrenamiento. |
| `status` | String | `required`, `enum: ['pending', 'completed', 'missed']` | Estado del entrenamiento. |

### Mongoose Schema

```javascript
const weeklyRoutineSchema = new Schema(
  {
    week: {
      type: Date,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    days: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          required: true,
        },
        trainingType: {
          type: String,
        },
        duration: {
          type: Number,
          min: 0,
        },
        details: {
          type: String,
        },
        status: {
          type: String,
          enum: ["pending", "completed", "missed"],
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
```

---

# Meal

Representa una comida registrada por el usuario.

| Campo | Tipo | Validaciones | Notas |
|-------|------|--------------|-------|
| `date` | Date | `required` | Fecha de la comida. |
| `name` | String | `required` | Nombre de la comida. |
| `calories` | Number | `required`, `min: 0` | Calorías consumidas. |
| `protein` | Number | `required`, `min: 0` | Proteínas consumidas (g). |
| `owner` | ObjectId | `required`, `ref: 'User'` | Usuario propietario del registro. |

### Mongoose Schema

```javascript
const mealSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
      min: 0,
    },
    protein: {
      type: Number,
      required: true,
      min: 0,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
```

---

# WeightEntry

Representa un registro de peso realizado por el usuario.

| Campo | Tipo | Validaciones | Notas |
|-------|------|--------------|-------|
| `date` | Date | `required` | Fecha del registro. |
| `weight` | Number | `required`, `min: 0` | Peso corporal en kilogramos. |
| `owner` | ObjectId | `required`, `ref: 'User'` | Usuario propietario del registro. |

### Mongoose Schema

```javascript
const weightEntrySchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
```


# Endpoints

---

## Autenticación

| Método | Ruta | Descripción | Body | Respuesta |
|---|---|---|---|---|
| POST | `/api/v1/auth/register` | Registrar un nuevo usuario | `{ name, email, password, objective, initialWeight }` | `201` — objeto User |
| POST | `/api/v1/auth/login` | Iniciar sesión | `{ email, password }` | `200` — objeto User |
| DELETE | `/api/v1/auth/logout` | Cerrar la sesión del usuario autenticado | — | `204` |

---

## Perfil

| Método | Ruta | Descripción | Body | Respuesta |
|---|---|---|---|---|
| GET | `/api/v1/profile` | Obtener el perfil del usuario autenticado | — | `200` — objeto User |
| PUT | `/api/v1/profile` | Actualizar la información del perfil | `{ name, objective }` | `200` — objeto User actualizado |

---

## Rutinas

| Método | Ruta | Descripción | Body | Respuesta |
|---|---|---|---|---|
| GET | `/api/v1/routines` | Obtener las rutinas del usuario. Permite filtrar por semana mediante query params. | — | `200` — array de WeeklyRoutine |
| POST | `/api/v1/routines` | Crear una nueva rutina semanal | `{ week, days }` | `201` — objeto WeeklyRoutine |
| GET | `/api/v1/routines/:routineId` | Obtener el detalle de una rutina | — | `200` — objeto WeeklyRoutine |
| PUT | `/api/v1/routines/:routineId` | Actualizar una rutina semanal | `{ week, days }` | `200` — objeto WeeklyRoutine actualizado |
| PATCH | `/api/v1/routines/:routineId/days/:dayId` | Actualizar el estado de un entrenamiento planificado | `{ status }` | `200` — objeto WeeklyRoutine actualizado |
| DELETE | `/api/v1/routines/:routineId` | Eliminar una rutina semanal | — | `204` |

---

## Comidas

| Método | Ruta | Descripción | Body | Respuesta |
|---|---|---|---|---|
| GET | `/api/v1/meals` | Obtener las comidas registradas por el usuario | — | `200` — array de Meal |
| POST | `/api/v1/meals` | Registrar una nueva comida | `{ date, name, calories, protein }` | `201` — objeto Meal |
| DELETE | `/api/v1/meals/:mealId` | Eliminar una comida registrada | — | `204` |

---

## Peso

| Método | Ruta | Descripción | Body | Respuesta |
|---|---|---|---|---|
| GET | `/api/v1/weights` | Obtener el historial de peso del usuario | — | `200` — array de WeightEntry |
| POST | `/api/v1/weights` | Registrar un nuevo peso | `{ date, weight }` | `201` — objeto WeightEntry |
