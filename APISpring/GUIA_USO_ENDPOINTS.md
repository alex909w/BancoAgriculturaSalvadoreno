# 📚 Guía de Uso de Endpoints - API Banco Agrícola Salvadoreño

## 🏦 Información General

**Base URL:** `http://localhost:8081/api`  
**Versión:** 1.0.0  
**Banco:** AgroBanco Salvadoreño  
**Slogan:** "Crecemos contigo desde la raíz"

---

## 🔐 Autenticación

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "token": "jwt_token",
  "usuario": {
    "id": 1,
    "username": "usuario",
    "email": "email@ejemplo.com",
    "rol": "cliente|empleado|gerente|admin"
  }
}
```

### Información de Autenticación
```http
GET /auth/info
```

---

## 🏠 Endpoints Generales

### Página Principal
```http
GET /
```

### Estado de Salud
```http
GET /health
```

---

## 👥 Gestión de Usuarios

### Obtener todos los usuarios
```http
GET /usuarios
```

### Obtener usuario por ID
```http
GET /usuarios/{id}
```

### Buscar usuarios
```http
GET /usuarios/buscar?dui={dui}&email={email}&username={username}
```

### Usuarios por sucursal
```http
GET /usuarios/sucursal/{sucursalId}
```

### Crear usuario
```http
POST /usuarios
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "passwordHash": "string",
  "nombreCompleto": "string",
  "dui": "string",
  "telefono": "string",
  "direccion": "string",
  "fechaNacimiento": "YYYY-MM-DD",
  "genero": "M|F|Otro",
  "profesion": "string",
  "salario": 0.00,
  "rol": {
    "id": 1
  },
  "sucursal": {
    "id": 1
  }
}
```

### Actualizar usuario
```http
PUT /usuarios/{id}
Content-Type: application/json
```

### Cambiar estado de usuario
```http
PUT /usuarios/{id}/estado
Content-Type: application/json

{
  "estado": "activo|inactivo|suspendido"
}
```

### Eliminar usuario
```http
DELETE /usuarios/{id}
```

---

## 👨‍💼 Gestión de Clientes

### Obtener todos los clientes
```http
GET /clientes
```

### Obtener cliente por ID
```http
GET /clientes/{id}
```

### Obtener cuentas de un cliente
```http
GET /clientes/{id}/cuentas
```

### Obtener préstamos de un cliente
```http
GET /clientes/{id}/prestamos
```

### Resumen completo del cliente
```http
GET /clientes/{id}/resumen
```

### Buscar clientes
```http
GET /clientes/buscar?dui={dui}&email={email}&username={username}
```

### Crear cliente
```http
POST /clientes
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "passwordHash": "string",
  "nombreCompleto": "string",
  "dui": "string",
  "telefono": "string",
  "direccion": "string",
  "fechaNacimiento": "YYYY-MM-DD",
  "genero": "M|F|Otro",
  "profesion": "string",
  "salario": 0.00,
  "rol": {
    "id": 2,
    "nombre": "cliente"
  },
  "sucursal": {
    "id": 1
  }
}
```

### Actualizar cliente
```http
PUT /clientes/{id}
Content-Type: application/json
```

### Cambiar estado de cliente
```http
PUT /clientes/{id}/estado
Content-Type: application/json

{
  "estado": "activo|inactivo|suspendido"
}
```

### Eliminar cliente
```http
DELETE /clientes/{id}
```

---

## 💳 Gestión de Cuentas

### Obtener todas las cuentas
```http
GET /cuentas
```

### Obtener cuenta por ID
```http
GET /cuentas/{id}
```

### Buscar cuenta por número
```http
GET /cuentas/numero/{numeroCuenta}
```

### Cuentas por cliente
```http
GET /cuentas/cliente/{clienteId}
```

### Cuentas por sucursal
```http
GET /cuentas/sucursal/{sucursalId}
```

### Cuentas por tipo
```http
GET /cuentas/tipo/{tipoId}
```

### Cuentas por estado
```http
GET /cuentas/estado/{estado}
```

### Crear cuenta
```http
POST /cuentas
Content-Type: application/json

{
  "numeroCuenta": "string",
  "saldo": 0.00,
  "cliente": {
    "id": 1
  },
  "tipoCuenta": {
    "id": 1
  },
  "sucursal": {
    "id": 1
  },
  "estado": "activa|inactiva|bloqueada|cerrada"
}
```

### Actualizar cuenta
```http
PUT /cuentas/{id}
Content-Type: application/json
```

### Cambiar estado de cuenta
```http
PUT /cuentas/{id}/estado
Content-Type: application/json

{
  "estado": "activa|inactiva|bloqueada|cerrada"
}
```

### Eliminar cuenta
```http
DELETE /cuentas/{id}
```

---

## 💰 Gestión de Transacciones

### Obtener todas las transacciones
```http
GET /transacciones
```

### Obtener transacción por ID
```http
GET /transacciones/{id}
```

### Buscar por número de transacción
```http
GET /transacciones/numero/{numeroTransaccion}
```

### Transacciones por cuenta
```http
GET /transacciones/cuenta/{cuentaId}
```

### Transacciones por estado
```http
GET /transacciones/estado/{estado}
```

### Transacciones por sucursal
```http
GET /transacciones/sucursal/{sucursalId}
```

### Realizar depósito
```http
POST /transacciones/deposito
Content-Type: application/json

{
  "cuentaId": 1,
  "monto": 100.00,
  "cajeroId": 1,
  "sucursalId": 1,
  "descripcion": "Depósito en efectivo"
}
```

### Realizar retiro
```http
POST /transacciones/retiro
Content-Type: application/json

{
  "cuentaId": 1,
  "monto": 50.00,
  "cajeroId": 1,
  "sucursalId": 1,
  "descripcion": "Retiro en efectivo"
}
```

### Realizar transferencia
```http
POST /transacciones/transferencia
Content-Type: application/json

{
  "cuentaOrigenId": 1,
  "cuentaDestinoId": 2,
  "monto": 75.00,
  "cajeroId": 1,
  "sucursalId": 1,
  "descripcion": "Transferencia entre cuentas"
}
```

---

## 🏛️ Gestión de Sucursales

### Obtener todas las sucursales
```http
GET /sucursales
```

### Obtener sucursal por ID
```http
GET /sucursales/{id}
```

### Buscar por código
```http
GET /sucursales/codigo/{codigo}
```

### Sucursales por departamento
```http
GET /sucursales/departamento/{departamento}
```

### Sucursales por tipo
```http
GET /sucursales/tipo/{tipo}
```

### Sucursales por estado
```http
GET /sucursales/estado/{estado}
```

### Crear sucursal
```http
POST /sucursales
Content-Type: application/json

{
  "nombre": "string",
  "codigo": "string",
  "departamento": "string",
  "municipio": "string",
  "direccion": "string",
  "telefono": "string",
  "email": "string",
  "tipo": "express|standard",
  "estado": "activa|inactiva"
}
```

### Actualizar sucursal
```http
PUT /sucursales/{id}
Content-Type: application/json
```

### Eliminar sucursal
```http
DELETE /sucursales/{id}
```

---

## 💸 Gestión de Préstamos

### Obtener todos los préstamos
```http
GET /prestamos
```

### Obtener préstamo por ID
```http
GET /prestamos/{id}
```

### Préstamos por cliente
```http
GET /prestamos/cliente/{clienteId}
```

### Préstamos por estado
```http
GET /prestamos/estado/{estado}
```

### Préstamos por sucursal
```http
GET /prestamos/sucursal/{sucursalId}
```

### Crear préstamo
```http
POST /prestamos
Content-Type: application/json

{
  "numeroReferencia": "string",
  "monto": 1000.00,
  "tasaInteres": 12.50,
  "plazoMeses": 12,
  "proposito": "string",
  "cliente": {
    "id": 1
  },
  "tipoPrestamo": {
    "id": 1
  },
  "sucursal": {
    "id": 1
  }
}
```

### Aprobar préstamo
```http
PUT /prestamos/{id}/aprobar
Content-Type: application/json

{
  "gerenteAprobadorId": 1,
  "observaciones": "string"
}
```

### Rechazar préstamo
```http
PUT /prestamos/{id}/rechazar
Content-Type: application/json

{
  "observaciones": "string"
}
```

### Desembolsar préstamo
```http
PUT /prestamos/{id}/desembolsar
Content-Type: application/json

{
  "cajeroId": 1
}
```

---

## 💳 Gestión de Pagos de Préstamos

### Obtener todos los pagos
```http
GET /pagos-prestamos
```

### Pagos por préstamo
```http
GET /pagos-prestamos/prestamo/{prestamoId}
```

### Pagos por estado
```http
GET /pagos-prestamos/estado/{estado}
```

### Pagos vencidos
```http
GET /pagos-prestamos/vencidos
```

### Total pagado por préstamo
```http
GET /pagos-prestamos/total-pagado/{prestamoId}
```

### Procesar pago
```http
PUT /pagos-prestamos/{id}/procesar
Content-Type: application/json

{
  "montoPagado": 100.00
}
```

### Generar cuotas de préstamo
```http
POST /pagos-prestamos/generar-cuotas/{prestamoId}
```

### Actualizar pagos vencidos
```http
PUT /pagos-prestamos/actualizar-vencidos
```

---

## 👥 Gestión de Beneficiarios

### Obtener todos los beneficiarios
```http
GET /beneficiarios
```

### Obtener beneficiario por ID
```http
GET /beneficiarios/{id}
```

### Beneficiarios por cuenta
```http
GET /beneficiarios/cuenta/{cuentaId}
```

### Buscar por DUI
```http
GET /beneficiarios/buscar/dui/{dui}
```

### Buscar por nombre
```http
GET /beneficiarios/buscar/nombre?nombre={nombre}
```

### Crear beneficiario
```http
POST /beneficiarios
Content-Type: application/json

{
  "nombre": "string",
  "dui": "string",
  "telefono": "string",
  "email": "string",
  "parentesco": "string",
  "cuenta": {
    "id": 1
  }
}
```

---

## 👔 Gestión de Roles

### Obtener todos los roles
```http
GET /roles
```

### Obtener rol por ID
```http
GET /roles/{id}
```

### Obtener rol por nombre
```http
GET /roles/nombre/{nombre}
```

### Crear rol
```http
POST /roles
Content-Type: application/json

{
  "nombre": "string",
  "descripcion": "string"
}
```

### Actualizar rol
```http
PUT /roles/{id}
Content-Type: application/json
```

### Eliminar rol
```http
DELETE /roles/{id}
```

---

## 📋 Solicitudes de Empleados

### Obtener todas las solicitudes
```http
GET /solicitudes-empleados
```

### Obtener solicitud por ID
```http
GET /solicitudes-empleados/{id}
```

### Solicitudes por estado
```http
GET /solicitudes-empleados/estado/{estado}
```

### Solicitudes por sucursal
```http
GET /solicitudes-empleados/sucursal/{sucursalId}
```

### Buscar por DUI
```http
GET /solicitudes-empleados/dui/{dui}
```

### Buscar por email
```http
GET /solicitudes-empleados/email/{email}
```

### Crear solicitud
```http
POST /solicitudes-empleados
Content-Type: application/json

{
  "nombreCompleto": "string",
  "dui": "string",
  "email": "string",
  "telefono": "string",
  "direccion": "string",
  "fechaNacimiento": "YYYY-MM-DD",
  "puestoSolicitado": "string",
  "experienciaLaboral": "string",
  "nivelEducativo": "string",
  "salarioEsperado": 800.00,
  "sucursal": {
    "id": 1
  }
}
```

### Aprobar solicitud
```http
PUT /solicitudes-empleados/{id}/aprobar
Content-Type: application/json

{
  "gerenteRevisorId": 1,
  "observaciones": "string"
}
```

### Rechazar solicitud
```http
PUT /solicitudes-empleados/{id}/rechazar
Content-Type: application/json

{
  "gerenteRevisorId": 1,
  "observaciones": "string"
}
```

---

## ⚙️ Configuración del Sistema

### Obtener todas las configuraciones
```http
GET /configuracion-sistema
```

### Configuraciones por categoría
```http
GET /configuracion-sistema/categoria/{categoria}
```

### Configuraciones activas
```http
GET /configuracion-sistema/activas
```

### Obtener valor por clave
```http
GET /configuracion-sistema/valor/{clave}
```

### Crear configuración
```http
POST /configuracion-sistema
Content-Type: application/json

{
  "clave": "string",
  "valor": "string",
  "descripcion": "string",
  "categoria": "string",
  "activa": true
}
```

### Actualizar valor
```http
PUT /configuracion-sistema/valor/{clave}
Content-Type: application/json

{
  "valor": "string"
}
```

---

## 📊 Auditoría

### Obtener registros de auditoría
```http
GET /auditoria
```

### Auditoría por usuario
```http
GET /auditoria/usuario/{usuarioId}
```

### Auditoría por tabla
```http
GET /auditoria/tabla/{tabla}
```

### Auditoría por acción
```http
GET /auditoria/accion/{accion}
```

### Auditoría por rango de fechas
```http
GET /auditoria/fecha?fechaInicio={fecha}&fechaFin={fecha}
```

---

## 🔍 Validaciones

### Validar DUI disponible
```http
GET /validation/dui/{dui}/disponible
```

### Validar email disponible
```http
GET /validation/email/{email}/disponible
```

### Validar username disponible
```http
GET /validation/username/{username}/disponible
```

### Validar número de cuenta disponible
```http
GET /validation/numero-cuenta/{numeroCuenta}/disponible
```

---

## 📝 Tipos de Datos

### Tipos de Cuenta
```http
GET /tipos-cuenta
POST /tipos-cuenta
PUT /tipos-cuenta/{id}
DELETE /tipos-cuenta/{id}
```

### Tipos de Préstamo
```http
GET /tipos-prestamo
POST /tipos-prestamo
PUT /tipos-prestamo/{id}
DELETE /tipos-prestamo/{id}
```

### Tipos de Transacción
```http
GET /tipos-transaccion
POST /tipos-transaccion
PUT /tipos-transaccion/{id}
DELETE /tipos-transaccion/{id}
```

---

## 📋 Estados Disponibles

### Estados de Usuario
- `activo`
- `inactivo`
- `suspendido`

### Estados de Cuenta
- `activa`
- `inactiva`
- `bloqueada`
- `cerrada`

### Estados de Transacción
- `pendiente`
- `completada`
- `fallida`
- `cancelada`

### Estados de Préstamo
- `pendiente`
- `aprobado`
- `rechazado`
- `desembolsado`
- `completado`
- `en_mora`

### Estados de Pago
- `pendiente`
- `pagado`
- `vencido`

### Estados de Solicitud de Empleado
- `pendiente`
- `en_revision`
- `aprobada`
- `rechazada`

---

## 🔧 Códigos de Respuesta HTTP

- **200 OK**: Operación exitosa
- **201 Created**: Recurso creado exitosamente
- **400 Bad Request**: Error en los datos enviados
- **401 Unauthorized**: No autenticado
- **403 Forbidden**: Sin permisos
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Error interno del servidor

---

## 📱 Ejemplos de Uso con cURL

### Autenticación
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Obtener estado de la aplicación
```bash
curl -X GET http://localhost:8081/api/health
```

### Crear un cliente
```bash
curl -X POST http://localhost:8081/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "username": "cliente1",
    "email": "cliente1@ejemplo.com",
    "passwordHash": "hashedpassword",
    "nombreCompleto": "Juan Pérez",
    "dui": "12345678-9",
    "telefono": "7777-7777",
    "rol": {"id": 2}
  }'
```

### Realizar un depósito
```bash
curl -X POST http://localhost:8081/api/transacciones/deposito \
  -H "Content-Type: application/json" \
  -d '{
    "cuentaId": 1,
    "monto": 500.00,
    "cajeroId": 1,
    "sucursalId": 1,
    "descripcion": "Depósito en efectivo"
  }'
```

---

## 🚀 Notas Importantes

1. **CORS**: Todos los endpoints tienen CORS habilitado para "*"
2. **Validación**: Los endpoints POST y PUT incluyen validación de datos
3. **Transacciones**: Las operaciones financieras son transaccionales
4. **Auditoría**: Las operaciones importantes se registran automáticamente
5. **Paginación**: Algunos endpoints pueden requerir paginación para grandes volúmenes de datos
6. **Seguridad**: Se recomienda implementar autenticación JWT para producción

---

## 📞 Soporte

Para más información o soporte técnico, contactar al equipo de desarrollo de AgroBanco Salvadoreño.

**Versión de la Guía:** 1.0.0  
**Última actualización:** Mayo 2025
