package com.bancoagricola.api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("nombre", "Banco de Agricultura Salvadoreño S.A. de C.V.");
        response.put("version", "1.0");
        response.put("descripcion", "API RESTful para servicios bancarios agrícolas");
        
        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("clientes", "/api/clientes");
        endpoints.put("cuentas", "/api/cuentas");
        endpoints.put("movimientos", "/api/movimientos");
        endpoints.put("transacciones", "/api/transacciones");
        endpoints.put("prestamos", "/api/prestamos");
        endpoints.put("empleados", "/api/empleados");
        endpoints.put("sucursales", "/api/sucursales");
        
        response.put("endpoints", endpoints);
        
        return response;
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", new java.util.Date());
        return response;
    }
}
