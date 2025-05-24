package com.agrobanco.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "*")
public class HomeController {
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("banco", "AgroBanco Salvadoreño");
        response.put("slogan", "Crecemos contigo desde la raíz");
        response.put("version", "1.0.0");
        response.put("status", "ACTIVO");
        response.put("timestamp", LocalDateTime.now());
        response.put("endpoints", new String[]{
            "/auth/login - Autenticación",
            "/usuarios - Gestión de usuarios",
            "/cuentas - Gestión de cuentas",
            "/transacciones - Gestión de transacciones",
            "/prestamos - Gestión de préstamos",
            "/swagger-ui.html - Documentación"
        });
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now());
        response.put("database", "MySQL - agrobanco_salvadoreno");
        response.put("version", "1.0.0");
        return ResponseEntity.ok(response);
    }
}
