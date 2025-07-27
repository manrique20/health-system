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
```
2. Iniciar el proyecto

Abrir dos terminales y ejecutar los siguiente comando en una terminal

```bash
npm run dev
```

y luego ejecutar el siguiente en la segunda terminal:
```bash
php artisan serve
```