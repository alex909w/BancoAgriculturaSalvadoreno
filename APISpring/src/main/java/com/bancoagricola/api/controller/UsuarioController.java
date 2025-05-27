package com.bancoagricola.api.controller;

import com.bancoagricola.api.model.Usuario;
import com.bancoagricola.api.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {
    
    @Autowired
    private UsuarioService usuarioService;
    
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> test() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "API funcionando correctamente");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("=== INICIANDO LOGIN ===");
            String usuario = loginData.get("usuario");
            String password = loginData.get("password");
            
            System.out.println("Usuario recibido: " + usuario);
            
            if (usuario == null || password == null || usuario.trim().isEmpty() || password.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Usuario y contraseña son requeridos");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Usar el método authenticate que incluye información del tipo de usuario
            Map<String, Object> authResponse = usuarioService.authenticate(usuario, password);
            System.out.println("=== LOGIN EXITOSO ===");
            System.out.println("Tipo de usuario: " + authResponse.get("tipoUsuario"));
            
            return ResponseEntity.ok(authResponse);
            
        } catch (Exception e) {
            System.err.println("=== ERROR EN LOGIN ===");
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(401).body(response);
        }
    }
    
    @GetMapping("/tipos")
    public ResponseEntity<Map<String, Object>> getTiposUsuario() {
        Map<String, Object> response = new HashMap<>();
        response.put("tipos", new String[]{"EMPLEADO", "CLIENTE", "DEPENDIENTE"});
        
        Map<String, String> descripcion = new HashMap<>();
        descripcion.put("EMPLEADO", "Personal del banco (cajeros, gerentes, asesores)");
        descripcion.put("CLIENTE", "Clientes del banco con cuentas");
        descripcion.put("DEPENDIENTE", "Comercios afiliados");
        response.put("descripcion", descripcion);
        
        return ResponseEntity.ok(response);
    }
}
