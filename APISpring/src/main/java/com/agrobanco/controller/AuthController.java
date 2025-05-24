package com.agrobanco.controller;

import com.agrobanco.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginData) {
        try {
            String username = loginData.get("username");
            String password = loginData.get("password");
            
            Map<String, Object> response = authService.authenticate(username, password);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(401).body(errorResponse);
        }
    }
    
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("banco", "AgroBanco Salvadoreño");
        info.put("slogan", "Crecemos contigo desde la raíz");
        info.put("version", "1.0.0");
        info.put("endpoints", new String[]{
            "/auth/login",
            "/usuarios",
            "/cuentas",
            "/transacciones",
            "/prestamos",
            "/swagger-ui.html"
        });
        return ResponseEntity.ok(info);
    }
}
