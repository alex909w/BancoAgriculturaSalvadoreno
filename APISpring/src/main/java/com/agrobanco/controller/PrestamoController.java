package com.agrobanco.controller;

import com.agrobanco.model.Prestamo;
import com.agrobanco.service.PrestamoService;
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
@RequestMapping("/prestamos")
@CrossOrigin(origins = "*")
public class PrestamoController {
    
    @Autowired
    private PrestamoService prestamoService;
    
    @GetMapping
    public ResponseEntity<List<Prestamo>> getAllPrestamos() {
        try {
            List<Prestamo> prestamos = prestamoService.findAll();
            return ResponseEntity.ok(prestamos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Prestamo> getPrestamoById(@PathVariable Integer id) {
        try {
            Optional<Prestamo> prestamo = prestamoService.findById(id);
            return prestamo.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/numero/{numeroPrestamo}")
    public ResponseEntity<Prestamo> getPrestamoByNumero(@PathVariable String numeroPrestamo) {
        try {
            Optional<Prestamo> prestamo = prestamoService.findByNumeroPrestamo(numeroPrestamo);
            return prestamo.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Prestamo>> getPrestamosByCliente(@PathVariable Integer clienteId) {
        try {
            List<Prestamo> prestamos = prestamoService.findByClienteId(clienteId);
            return ResponseEntity.ok(prestamos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Prestamo>> getPrestamosByEstado(@PathVariable String estado) {
        try {
            Prestamo.EstadoPrestamo estadoPrestamo = Prestamo.EstadoPrestamo.valueOf(estado);
            List<Prestamo> prestamos = prestamoService.findByEstado(estadoPrestamo);
            return ResponseEntity.ok(prestamos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createPrestamo(@RequestBody Prestamo prestamo) {
        Map<String, Object> response = new HashMap<>();
        try {
            Prestamo nuevoPrestamo = prestamoService.save(prestamo);
            response.put("success", true);
            response.put("message", "Préstamo solicitado exitosamente");
            response.put("prestamo", nuevoPrestamo);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PutMapping("/{id}/aprobar")
    public ResponseEntity<Map<String, Object>> aprobarPrestamo(@PathVariable Integer id, @RequestBody Map<String, Object> aprobacionData) {
        Map<String, Object> response = new HashMap<>();
        try {
            BigDecimal montoAprobado = new BigDecimal(aprobacionData.get("montoAprobado").toString());
            Integer gerenteId = (Integer) aprobacionData.get("gerenteId");
            
            Prestamo prestamo = prestamoService.aprobarPrestamo(id, montoAprobado, gerenteId);
            
            response.put("success", true);
            response.put("message", "Préstamo aprobado exitosamente");
            response.put("prestamo", prestamo);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PutMapping("/{id}/rechazar")
    public ResponseEntity<Map<String, Object>> rechazarPrestamo(@PathVariable Integer id, @RequestBody Map<String, String> rechazoData) {
        Map<String, Object> response = new HashMap<>();
        try {
            String observaciones = rechazoData.get("observaciones");
            
            Prestamo prestamo = prestamoService.rechazarPrestamo(id, observaciones);
            
            response.put("success", true);
            response.put("message", "Préstamo rechazado");
            response.put("prestamo", prestamo);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PutMapping("/{id}/desembolsar")
    public ResponseEntity<Map<String, Object>> desembolsarPrestamo(@PathVariable Integer id, @RequestBody Map<String, Integer> desembolsoData) {
        Map<String, Object> response = new HashMap<>();
        try {
            Integer cajeroId = desembolsoData.get("cajeroId");
            
            Prestamo prestamo = prestamoService.desembolsarPrestamo(id, cajeroId);
            
            response.put("success", true);
            response.put("message", "Préstamo desembolsado exitosamente");
            response.put("prestamo", prestamo);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
