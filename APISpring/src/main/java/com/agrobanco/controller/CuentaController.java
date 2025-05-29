package com.agrobanco.controller;

import com.agrobanco.model.Cuenta;
import com.agrobanco.service.CuentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/cuentas")
@CrossOrigin(origins = "*")
public class CuentaController {
    
    @Autowired
    private CuentaService cuentaService;
    
    @GetMapping
    public ResponseEntity<List<Cuenta>> getAllCuentas() {
        try {
            List<Cuenta> cuentas = cuentaService.findAll();
            return ResponseEntity.ok(cuentas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Cuenta> getCuentaById(@PathVariable Integer id) {
        try {
            Optional<Cuenta> cuenta = cuentaService.findById(id);
            return cuenta.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/numero/{numeroCuenta}")
    public ResponseEntity<Cuenta> getCuentaByNumero(@PathVariable String numeroCuenta) {
        try {
            Optional<Cuenta> cuenta = cuentaService.findByNumeroCuenta(numeroCuenta);
            return cuenta.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Cuenta>> getCuentasByCliente(@PathVariable Integer clienteId) {
        try {
            List<Cuenta> cuentas = cuentaService.findByClienteId(clienteId);
            return ResponseEntity.ok(cuentas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/sucursal/{sucursalId}")
    public ResponseEntity<List<Cuenta>> getCuentasBySucursal(@PathVariable Integer sucursalId) {
        try {
            List<Cuenta> cuentas = cuentaService.findBySucursalId(sucursalId);
            return ResponseEntity.ok(cuentas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createCuenta(@RequestBody Cuenta cuenta) {
        Map<String, Object> response = new HashMap<>();
        try {
            Cuenta nuevaCuenta = cuentaService.save(cuenta);
            response.put("success", true);
            response.put("message", "Cuenta creada exitosamente");
            response.put("cuenta", nuevaCuenta);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateCuenta(@PathVariable Integer id, @RequestBody Cuenta cuenta) {
        Map<String, Object> response = new HashMap<>();
        try {
            Cuenta cuentaActualizada = cuentaService.update(id, cuenta);
            response.put("success", true);
            response.put("message", "Cuenta actualizada exitosamente");
            response.put("cuenta", cuentaActualizada);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PutMapping("/{id}/estado")
    public ResponseEntity<Map<String, Object>> cambiarEstadoCuenta(@PathVariable Integer id, @RequestBody Map<String, String> estadoData) {
        Map<String, Object> response = new HashMap<>();
        try {
            Cuenta.EstadoCuenta nuevoEstado = Cuenta.EstadoCuenta.valueOf(estadoData.get("estado"));
            Cuenta cuenta = cuentaService.cambiarEstado(id, nuevoEstado);
            response.put("success", true);
            response.put("message", "Estado de la cuenta actualizado");
            response.put("cuenta", cuenta);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteCuenta(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            cuentaService.delete(id);
            response.put("success", true);
            response.put("message", "Cuenta eliminada exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
