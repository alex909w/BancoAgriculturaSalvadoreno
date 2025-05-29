package com.agrobanco.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
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
      @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, Object>> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex, WebRequest request) {
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("error", "Bad Request");
          String value = (ex.getValue() != null) ? ex.getValue().toString() : "null";
        String paramName = (ex.getName() != null) ? ex.getName() : "desconocido";
        Class<?> requiredType = ex.getRequiredType();
        String expectedType = (requiredType != null) ? requiredType.getSimpleName() : "desconocido";
        
        String message = String.format("El valor '%s' no es válido para el parámetro '%s'. Se esperaba un tipo %s",
                value, paramName, expectedType);
        
        // Mensaje específico para 'undefined'
        if ("undefined".equals(value)) {
            message = String.format("El parámetro '%s' tiene un valor no definido. Por favor, proporcione un valor válido de tipo %s",
                    paramName, expectedType);
        }
        
        response.put("message", message);
        response.put("path", request.getDescription(false).replace("uri=", ""));
        
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(NumberFormatException.class)
    public ResponseEntity<Map<String, Object>> handleNumberFormatException(
            NumberFormatException ex, WebRequest request) {
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("error", "Bad Request");
        response.put("message", "Formato de número inválido: " + ex.getMessage());
        response.put("path", request.getDescription(false).replace("uri=", ""));
        
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(
            RuntimeException ex, WebRequest request) {
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.put("error", "Internal Server Error");
        response.put("message", ex.getMessage());
        response.put("path", request.getDescription(false).replace("uri=", ""));
        
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        
        Map<String, Object> response = new HashMap<>();
        Map<String, String> errors = new HashMap<>();
        
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        response.put("success", false);
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("error", "Validation Failed");
        response.put("message", "Errores de validación en los campos");
        response.put("errors", errors);
        
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
      @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGlobalException(
            Exception ex, WebRequest request) {
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.put("error", "Internal Server Error");
        response.put("message", "Ha ocurrido un error interno del servidor");
        response.put("details", ex.getMessage());
        response.put("path", request.getDescription(false).replace("uri=", ""));
        
        // Log del error para debugging
        System.err.println("Error interno del servidor: " + ex.getMessage());
        ex.printStackTrace();
        
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
