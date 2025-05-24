package com.bancoagricola.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "*")
public class HomeController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Bienvenido a la API de Banco Agrícola");
        response.put("version", "1.0.0");
        response.put("status", "ACTIVO");
        response.put("endpoints", new String[]{
            "/api/usuarios/login",
            "/api/clientes",
            "/api/cuentas",
            "/api/movimientos",
            "/swagger-ui.html"
        });
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
}
