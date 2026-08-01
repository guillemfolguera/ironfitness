# Wireframes

Los wireframes completos del MVP pueden consultarse en el siguiente enlace de Whimsical: https://whimsical.com/guillem42/iron-fitness-D9ZWuDkTHccUYjeBt8bbFL@9kGbMz9Kzt
 
---

# Pantallas del MVP

## Usuario no autenticado

- `/register` – Formulario de registro de usuario con nombre, email, contraseña, peso inicial y objetivo físico.
- `/login` – Formulario de inicio de sesión.

---

## Usuario autenticado

### Inicio

- `/` – Pantalla principal de la aplicación. Muestra un resumen del progreso del usuario, incluyendo su objetivo físico, el peso actual, el número de entrenamientos realizados durante la semana y el mes, la rutina semanal y los últimos entrenamientos. Desde esta pantalla el usuario puede acceder a sus rutinas, registrar una nueva comida y navegar al resto de módulos de la aplicación.

### Rutinas

- `/routines` – Muestra la planificación semanal del usuario. Permite consultar la rutina asignada a cada día, marcar el estado del entrenamiento, acceder al detalle de una rutina, crear una nueva rutina semanal y eliminar una rutina.

- `/routines/:routineId` – Muestra toda la información de una rutina semanal. Desde esta pantalla el usuario puede consultar sus datos, modificarla o eliminarla.

- `/routines/new` – Formulario para crear una nueva rutina semanal seleccionando una semana disponible y definiendo la planificación de entrenamiento para cada día.

### Alimentación

- `/meals` – Muestra los registros de comidas de una fecha determinada, junto con el total de calorías y proteínas consumidas. También permite eliminar registros.

- `/meals/new` – Formulario para registrar una nueva comida.

### Peso

- `/weight` – Pantalla de seguimiento del peso. Muestra el peso inicial, el peso actual, permite registrar el peso del día y visualizar la evolución mediante una gráfica.

### Perfil

- `/profile` – Pantalla de perfil del usuario. Permite modificar el nombre y el objetivo físico.