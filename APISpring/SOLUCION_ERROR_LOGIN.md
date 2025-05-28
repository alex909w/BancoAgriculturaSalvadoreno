# Solución al Error "Required request body is missing"

## Problema Identificado

El error que estabas experimentando:
```json
{
  "path": "/api/auth/login",
  "success": false,
  "error": "Internal Server Error",
  "message": "Required request body is missing: public org.springframework.http.ResponseEntity<java.util.Map<java.lang.String, java.lang.Object>> com.agrobanco.controller.AuthController.login(java.util.Map<java.lang.String, java.lang.String>)",
  "timestamp": "2025-05-28T00:12:58.423",
  "status": 500
}
```

Indica que Spring Boot no está recibiendo el cuerpo de la petición HTTP en el endpoint `/auth/login`.

## Cambios Realizados

### 1. Mejorado el Manejo de Excepciones (`GlobalExceptionHandler.java`)

Se agregó un manejador específico para `HttpMessageNotReadableException`:

```java
@ExceptionHandler(HttpMessageNotReadableException.class)
public ResponseEntity<Map<String, Object>> handleHttpMessageNotReadable(
        HttpMessageNotReadableException ex, WebRequest request) {
    
    Map<String, Object> response = new HashMap<>();
    response.put("success", false);
    response.put("timestamp", LocalDateTime.now());
    response.put("status", HttpStatus.BAD_REQUEST.value());
    response.put("error", "Bad Request");
    
    String message = "Cuerpo de la petición requerido está ausente o mal formateado";
    
    // Verificar si es un problema de JSON malformado
    String exMessage = ex.getMessage();
    if (exMessage != null) {
        if (exMessage.contains("JSON")) {
            message = "El cuerpo de la petición contiene JSON malformado. Verifique la sintaxis.";
        } else if (exMessage.contains("Required request body is missing")) {
            message = "El cuerpo de la petición es requerido. Asegúrese de enviar los datos en formato JSON.";
        }
    }
    
    response.put("message", message);
    response.put("path", request.getDescription(false).replace("uri=", ""));
    response.put("esperado", "{ \"username\": \"usuario\", \"password\": \"contraseña\" }");
    
    return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
}
```

### 2. Mejorado el Controlador de Autenticación (`AuthController.java`)

Se agregó mejor logging y validación:

```java
@PostMapping("/login")
public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginData) {
    System.out.println("=== INICIO LOGIN ENDPOINT ===");
    System.out.println("Datos recibidos: " + loginData);
    
    try {
        // Validar que los datos estén presentes
        if (loginData == null) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "No se recibieron datos de login");
            errorResponse.put("esperado", "{ \"username\": \"usuario\", \"password\": \"contraseña\" }");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        String username = loginData.get("username");
        String password = loginData.get("password");
        
        System.out.println("Username: " + username);
        System.out.println("Password recibido: " + (password != null ? "Sí" : "No"));
        
        Map<String, Object> response = authService.authenticate(username, password);
        return ResponseEntity.ok(response);
        
    } catch (Exception e) {
        System.err.println("Error en login: " + e.getMessage());
        e.printStackTrace();
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", e.getMessage());
        return ResponseEntity.status(401).body(errorResponse);
    }
}
```

### 3. Agregado Endpoint de Prueba

Se agregó un endpoint `/auth/test-login` para probar la conectividad:

```java
@PostMapping("/test-login")
public ResponseEntity<Map<String, Object>> testLogin(@RequestBody(required = false) Map<String, String> loginData) {
    Map<String, Object> response = new HashMap<>();
    response.put("success", true);
    response.put("message", "Endpoint de login disponible");
    response.put("datosRecibidos", loginData);
    response.put("metodo", "POST");
    response.put("contentType", "application/json");
    
    Map<String, String> ejemplo = new HashMap<>();
    ejemplo.put("username", "admin");
    ejemplo.put("password", "admin123");
    response.put("ejemplo", ejemplo);
    
    return ResponseEntity.ok(response);
}
```

## Cómo Probar la Solución

### 1. Ejecutar la Aplicación
```bash
cd "c:\Users\rosma\OneDrive\Escritorio\DWF\BancoAgriculturaSalvadoreno\APISpring"
mvn spring-boot:run
```

### 2. Probar el Endpoint de Test
```bash
curl -X POST http://localhost:8080/auth/test-login \
  -H "Content-Type: application/json" \
  -d '{"username": "test", "password": "test"}'
```

### 3. Probar el Login Real
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

## Posibles Causas del Problema Original

1. **Cliente no envía Content-Type**: Asegúrate de que el cliente envíe `Content-Type: application/json`
2. **Cuerpo vacío**: El cliente no está enviando el body de la petición
3. **JSON malformado**: El JSON enviado tiene errores de sintaxis
4. **Método incorrecto**: Se está usando GET en lugar de POST

## Mensajes de Error Mejorados

Ahora recibirás mensajes más específicos:

- Error 400 si falta el cuerpo de la petición
- Error 400 si el JSON está malformado
- Error 401 si las credenciales son incorrectas
- Error 500 solo para errores internos reales

## Próximos Pasos

1. Ejecuta la aplicación
2. Prueba primero con `/auth/test-login`
3. Si funciona, prueba con `/auth/login`
4. Revisa los logs en la consola para debugging
