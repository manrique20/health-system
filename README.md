# Sistema de Panel de Control de Citas Médicas

Sistema de gestión de citas médicas desarrollado con Laravel 10 y Vue 3 (Composition API).

## Características

- ✅ Visualización de citas en lista y calendario
- ✅ Creación y cancelación de citas
- ✅ Validación de superposición de horarios
- ✅ Manejo de zonas horarias (España/Argentina)
- ✅ Simulación de sincronización con calendarios externos
- ✅ Simulación de envío de correos (Mailtrap)
- ✅ Exportación a formato iCal
- ✅ Persistencia local con LocalStorage
- ✅ Diseño responsivec
## ¿Qué puedo hacer como doctor?
Al ser doctor podras asignarte citas con todos los pacientes
Podrás crear otros pacientes
Verás todas las citas que tengas o tuviste programadas que correspondan a tu id
Tendras detalle a tu información personal

## ¿Qué puedo hacer como paciente?

Al ser paciente podrás solo agendar citas y ver cuales citas tienes programadas

## ¿De que sirve la url terminada en "/General"?
En esta pagina podrás hacer y tener acceso a toda la información de pacientes y doctores viendose reflejada en el formulario al crear una nueva cita
Ademas de ver todas las citas que hay en el sistema
Podrás crear doctores y pacientes
Una vez tengas creado doctores y pacientes con su correo correspondiente, estos podrán ingresar a la pagina por medio del login


## Instalación

1. Clonar el repositorio

```bash
git clone https://github.com/manrique20/health-system
cd health-system
```
2. Instalar dependencias

```bash
npm i
composer i
npm run build
```
3. Configurar entorno (.env)
```bash
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
```
4. Iniciar el proyecto

Abrir dos terminales y ejecutar los siguiente comando en una terminal

```bash
npm run dev
```

y luego ejecutar el siguiente en la segunda terminal:
```bash
php artisan serve
```


