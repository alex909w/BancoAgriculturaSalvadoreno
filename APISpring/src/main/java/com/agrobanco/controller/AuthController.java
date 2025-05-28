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
