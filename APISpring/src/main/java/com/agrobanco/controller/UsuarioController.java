package com.agrobanco.controller;

import com.agrobanco.model.Usuario;
import com.agrobanco.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {
    
    @Autowired
    private UsuarioService usuarioService;
    
    @GetMapping
    public ResponseEntity<List<Usuario>> getAllUsuarios() {
        try {
            List<Usuario> usuarios = usuarioService.findAll();
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getUsuarioById(@PathVariable Integer id) {
        try {
            Optional<Usuario> usuario = usuarioService.findById(id);
            return usuario.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/username/{username}")
    public ResponseEntity<Usuario> getUsuarioByUsername(@PathVariable String username) {
        try {
            Optional<Usuario> usuario = usuarioService.findByUsername(username);
            return usuario.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<Usuario> getUsuarioByEmail(@PathVariable String email) {
        try {
            Optional<Usuario> usuario = usuarioService.findByEmail(email);
            return usuario.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/dui/{dui}")
    public ResponseEntity<Usuario> getUsuarioByDui(@PathVariable String dui) {
        try {
            Optional<Usuario> usuario = usuarioService.findByDui(dui);
            return usuario.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/rol/{rolNombre}")
    public ResponseEntity<List<Usuario>> getUsuariosByRol(@PathVariable String rolNombre) {
        try {
            List<Usuario> usuarios = usuarioService.findByRolNombre(rolNombre);
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/sucursal/{sucursalId}")
    public ResponseEntity<List<Usuario>> getUsuariosBySucursal(@PathVariable Integer sucursalId) {
        try {
            List<Usuario> usuarios = usuarioService.findBySucursalId(sucursalId);
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createUsuario(@RequestBody Usuario usuario) {
        Map<String, Object> response = new HashMap<>();
        try {
            Usuario nuevoUsuario = usuarioService.save(usuario);
            response.put("success", true);
            response.put("message", "Usuario creado exitosamente");
            response.put("usuario", nuevoUsuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateUsuario(@PathVariable Integer id, @RequestBody Usuario usuario) {
        Map<String, Object> response = new HashMap<>();
        try {
            Usuario usuarioActualizado = usuarioService.update(id, usuario);
            response.put("success", true);
            response.put("message", "Usuario actualizado exitosamente");
            response.put("usuario", usuarioActualizado);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PutMapping("/{id}/estado")
    public ResponseEntity<Map<String, Object>> cambiarEstadoUsuario(@PathVariable Integer id, @RequestBody Map<String, String> estadoData) {
        Map<String, Object> response = new HashMap<>();
        try {
            Usuario.EstadoUsuario nuevoEstado = Usuario.EstadoUsuario.valueOf(estadoData.get("estado"));
            Usuario usuario = usuarioService.cambiarEstado(id, nuevoEstado);
            response.put("success", true);
            response.put("message", "Estado del usuario actualizado");
            response.put("usuario", usuario);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteUsuario(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            usuarioService.delete(id);
            response.put("success", true);
            response.put("message", "Usuario eliminado exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
