package com.agrobanco.controller;

import com.agrobanco.model.Transaccion;
import com.agrobanco.service.TransaccionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/transacciones")
@CrossOrigin(origins = "*")
public class TransaccionController {
    
    @Autowired
    private TransaccionService transaccionService;    @GetMapping
    public ResponseEntity<?> getAllTransacciones() {
        try {
            List<Transaccion> transacciones = transaccionService.findAll();
            return ResponseEntity.ok(transacciones);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error al obtener las transacciones. Posible inconsistencia en los datos.");
            error.put("error", e.getMessage());
            error.put("solucion", "Ejecute el endpoint /api/data-fix/diagnostico-transacciones para más información");
            error.put("timestamp", java.time.LocalDateTime.now());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
      @GetMapping("/{id}")
    public ResponseEntity<?> getTransaccionById(@PathVariable Integer id) {
        try {
            Optional<Transaccion> transaccion = transaccionService.findById(id);
            if (transaccion.isPresent()) {
                return ResponseEntity.ok(transaccion.get());
            } else {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "Transacción con ID " + id + " no encontrada");
                error.put("timestamp", java.time.LocalDateTime.now());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error al obtener la transacción: " + e.getMessage());
            error.put("timestamp", java.time.LocalDateTime.now());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    @GetMapping("/numero/{numeroTransaccion}")
    public ResponseEntity<Transaccion> getTransaccionByNumero(@PathVariable String numeroTransaccion) {
        try {
            Optional<Transaccion> transaccion = transaccionService.findByNumeroTransaccion(numeroTransaccion);
            return transaccion.map(ResponseEntity::ok)
                            .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
      @GetMapping("/cuenta/{cuentaId}")
    public ResponseEntity<?> getTransaccionesByCuenta(@PathVariable Integer cuentaId) {
        try {
            List<Transaccion> transacciones = transaccionService.findByCuentaId(cuentaId);
            return ResponseEntity.ok(transacciones);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error al obtener las transacciones de la cuenta: " + e.getMessage());
            error.put("timestamp", java.time.LocalDateTime.now());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    @PostMapping("/deposito")
    public ResponseEntity<Map<String, Object>> realizarDeposito(@RequestBody Map<String, Object> depositoData) {
        Map<String, Object> response = new HashMap<>();
        try {
            Integer cuentaId = (Integer) depositoData.get("cuentaId");
            BigDecimal monto = new BigDecimal(depositoData.get("monto").toString());
            Integer cajeroId = (Integer) depositoData.get("cajeroId");
            Integer sucursalId = (Integer) depositoData.get("sucursalId");
            String descripcion = (String) depositoData.get("descripcion");
            
            Transaccion transaccion = transaccionService.realizarDeposito(cuentaId, monto, cajeroId, sucursalId, descripcion);
            
            response.put("success", true);
            response.put("message", "Depósito realizado exitosamente");
            response.put("transaccion", transaccion);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PostMapping("/retiro")
    public ResponseEntity<Map<String, Object>> realizarRetiro(@RequestBody Map<String, Object> retiroData) {
        Map<String, Object> response = new HashMap<>();
        try {
            Integer cuentaId = (Integer) retiroData.get("cuentaId");
            BigDecimal monto = new BigDecimal(retiroData.get("monto").toString());
            Integer cajeroId = (Integer) retiroData.get("cajeroId");
            Integer sucursalId = (Integer) retiroData.get("sucursalId");
            String descripcion = (String) retiroData.get("descripcion");
            
            Transaccion transaccion = transaccionService.realizarRetiro(cuentaId, monto, cajeroId, sucursalId, descripcion);
            
            response.put("success", true);
            response.put("message", "Retiro realizado exitosamente");
            response.put("transaccion", transaccion);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PostMapping("/transferencia")
    public ResponseEntity<Map<String, Object>> realizarTransferencia(@RequestBody Map<String, Object> transferenciaData) {
        Map<String, Object> response = new HashMap<>();
        try {
            Integer cuentaOrigenId = (Integer) transferenciaData.get("cuentaOrigenId");
            Integer cuentaDestinoId = (Integer) transferenciaData.get("cuentaDestinoId");
            BigDecimal monto = new BigDecimal(transferenciaData.get("monto").toString());
            Integer cajeroId = (Integer) transferenciaData.get("cajeroId");
            Integer sucursalId = (Integer) transferenciaData.get("sucursalId");
            String descripcion = (String) transferenciaData.get("descripcion");
            
            Transaccion transaccion = transaccionService.realizarTransferencia(cuentaOrigenId, cuentaDestinoId, monto, cajeroId, sucursalId, descripcion);
            
            response.put("success", true);
            response.put("message", "Transferencia realizada exitosamente");
            response.put("transaccion", transaccion);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
