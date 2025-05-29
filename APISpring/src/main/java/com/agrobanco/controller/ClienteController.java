package com.agrobanco.controller;

import com.agrobanco.model.Cuenta;
import com.agrobanco.model.Prestamo;
import com.agrobanco.model.Usuario;
import com.agrobanco.service.CuentaService;
import com.agrobanco.service.PrestamoService;
import com.agrobanco.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/clientes")
@CrossOrigin(origins = "*")
public class ClienteController {
    
    @Autowired
    private UsuarioService usuarioService;
    
    @Autowired
    private CuentaService cuentaService;
    
    @Autowired
    private PrestamoService prestamoService;
    
    @GetMapping
    public ResponseEntity<List<Usuario>> getAllClientes() {
        try {
            // Buscar usuarios con rol de "cliente"
            List<Usuario> clientes = usuarioService.findByRolNombre("cliente");
            return ResponseEntity.ok(clientes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getClienteById(@PathVariable Integer id) {
        try {
            Optional<Usuario> cliente = usuarioService.findById(id);
            if (cliente.isPresent()) {
                // Verificar que sea un cliente (tiene rol de cliente)
                Usuario usuario = cliente.get();
                if (usuario.getRol() != null && "cliente".equalsIgnoreCase(usuario.getRol().getNombre())) {
                    return ResponseEntity.ok(usuario);
                } else {
                    return ResponseEntity.notFound().build();
                }
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}/cuentas")
    public ResponseEntity<List<Cuenta>> getCuentasByCliente(@PathVariable Integer id) {
        try {
            List<Cuenta> cuentas = cuentaService.findByClienteId(id);
            return ResponseEntity.ok(cuentas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}/prestamos")
    public ResponseEntity<List<Prestamo>> getPrestamosByCliente(@PathVariable Integer id) {
        try {
            List<Prestamo> prestamos = prestamoService.findByClienteId(id);
            return ResponseEntity.ok(prestamos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}/resumen")
    public ResponseEntity<Map<String, Object>> getResumenCliente(@PathVariable Integer id) {
        try {
            Optional<Usuario> clienteOpt = usuarioService.findById(id);
            if (!clienteOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            Usuario cliente = clienteOpt.get();
            if (cliente.getRol() == null || !"cliente".equalsIgnoreCase(cliente.getRol().getNombre())) {
                return ResponseEntity.notFound().build();
            }
            
            List<Cuenta> cuentas = cuentaService.findByClienteId(id);
            List<Prestamo> prestamos = prestamoService.findByClienteId(id);
            
            Map<String, Object> resumen = new HashMap<>();
            resumen.put("cliente", cliente);
            resumen.put("totalCuentas", cuentas.size());
            resumen.put("totalPrestamos", prestamos.size());
            resumen.put("cuentas", cuentas);
            resumen.put("prestamos", prestamos);
            
            return ResponseEntity.ok(resumen);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/buscar")
    public ResponseEntity<List<Usuario>> buscarClientes(@RequestParam(required = false) String dui,
                                                       @RequestParam(required = false) String email,
                                                       @RequestParam(required = false) String username) {
        try {
            List<Usuario> clientes;
              if (dui != null && !dui.isEmpty()) {
                Optional<Usuario> cliente = usuarioService.findByDui(dui);
                clientes = cliente.map(u -> Arrays.asList(u)).orElse(Collections.emptyList());
            } else if (email != null && !email.isEmpty()) {
                Optional<Usuario> cliente = usuarioService.findByEmail(email);
                clientes = cliente.map(u -> Arrays.asList(u)).orElse(Collections.emptyList());
            } else if (username != null && !username.isEmpty()) {
                Optional<Usuario> cliente = usuarioService.findByUsername(username);
                clientes = cliente.map(u -> Arrays.asList(u)).orElse(Collections.emptyList());
            } else {
                clientes = usuarioService.findByRolNombre("cliente");
            }
            
            // Filtrar solo usuarios con rol de cliente
            clientes = clientes.stream()
                .filter(u -> u.getRol() != null && "cliente".equalsIgnoreCase(u.getRol().getNombre()))
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(clientes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createCliente(@RequestBody Usuario cliente) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Asegurar que se está creando un cliente
            if (cliente.getRol() == null || !"cliente".equalsIgnoreCase(cliente.getRol().getNombre())) {
                response.put("success", false);
                response.put("message", "El usuario debe tener rol de cliente");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            Usuario nuevoCliente = usuarioService.save(cliente);
            response.put("success", true);
            response.put("message", "Cliente creado exitosamente");
            response.put("cliente", nuevoCliente);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateCliente(@PathVariable Integer id, @RequestBody Usuario cliente) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Verificar que el usuario sea un cliente
            Optional<Usuario> clienteExistente = usuarioService.findById(id);
            if (!clienteExistente.isPresent()) {
                response.put("success", false);
                response.put("message", "Cliente no encontrado");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            Usuario clienteActual = clienteExistente.get();
            if (clienteActual.getRol() == null || !"cliente".equalsIgnoreCase(clienteActual.getRol().getNombre())) {
                response.put("success", false);
                response.put("message", "El usuario especificado no es un cliente");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            // Asegurar que se mantiene el rol de cliente
            if (cliente.getRol() == null || !"cliente".equalsIgnoreCase(cliente.getRol().getNombre())) {
                cliente.setRol(clienteActual.getRol());
            }
            
            Usuario clienteActualizado = usuarioService.update(id, cliente);
            response.put("success", true);
            response.put("message", "Cliente actualizado exitosamente");
            response.put("cliente", clienteActualizado);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PutMapping("/{id}/estado")
    public ResponseEntity<Map<String, Object>> cambiarEstadoCliente(@PathVariable Integer id, @RequestBody Map<String, String> estadoData) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Verificar que el usuario sea un cliente
            Optional<Usuario> clienteOpt = usuarioService.findById(id);
            if (!clienteOpt.isPresent()) {
                response.put("success", false);
                response.put("message", "Cliente no encontrado");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            Usuario cliente = clienteOpt.get();
            if (cliente.getRol() == null || !"cliente".equalsIgnoreCase(cliente.getRol().getNombre())) {
                response.put("success", false);
                response.put("message", "El usuario especificado no es un cliente");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            Usuario.EstadoUsuario nuevoEstado = Usuario.EstadoUsuario.valueOf(estadoData.get("estado"));
            Usuario clienteActualizado = usuarioService.cambiarEstado(id, nuevoEstado);
            response.put("success", true);
            response.put("message", "Estado del cliente actualizado");
            response.put("cliente", clienteActualizado);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteCliente(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Verificar que el usuario sea un cliente
            Optional<Usuario> clienteOpt = usuarioService.findById(id);
            if (!clienteOpt.isPresent()) {
                response.put("success", false);
                response.put("message", "Cliente no encontrado");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            Usuario cliente = clienteOpt.get();
            if (cliente.getRol() == null || !"cliente".equalsIgnoreCase(cliente.getRol().getNombre())) {
                response.put("success", false);
                response.put("message", "El usuario especificado no es un cliente");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            usuarioService.delete(id);
            response.put("success", true);
            response.put("message", "Cliente eliminado exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
