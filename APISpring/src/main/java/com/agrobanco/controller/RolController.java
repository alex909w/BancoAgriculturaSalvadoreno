package com.agrobanco.controller;

import com.agrobanco.model.Rol;
import com.agrobanco.service.RolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/roles")
@CrossOrigin(origins = "*")
public class RolController {
    
    @Autowired
    private RolService rolService;
    
    @GetMapping
    public ResponseEntity<List<Rol>> getAllRoles() {
        try {
            List<Rol> roles = rolService.findAll();
            return ResponseEntity.ok(roles);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Rol> getRolById(@PathVariable Integer id) {
        try {
            Optional<Rol> rol = rolService.findById(id);
            return rol.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<Rol> getRolByNombre(@PathVariable String nombre) {
        try {
            Optional<Rol> rol = rolService.findByNombre(nombre);
            return rol.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createRol(@RequestBody Rol rol) {
        Map<String, Object> response = new HashMap<>();
        try {
            Rol nuevoRol = rolService.save(rol);
            response.put("success", true);
            response.put("message", "Rol creado exitosamente");
            response.put("rol", nuevoRol);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateRol(@PathVariable Integer id, @RequestBody Rol rol) {
        Map<String, Object> response = new HashMap<>();
        try {
            Rol rolActualizado = rolService.update(id, rol);
            response.put("success", true);
            response.put("message", "Rol actualizado exitosamente");
            response.put("rol", rolActualizado);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteRol(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            rolService.delete(id);
            response.put("success", true);
            response.put("message", "Rol eliminado exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
