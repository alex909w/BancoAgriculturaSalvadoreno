package com.agrobanco.controller;

import com.agrobanco.model.TipoPrestamo;
import com.agrobanco.service.TipoPrestamoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/tipos-prestamo")
@CrossOrigin(origins = "*")
public class TipoPrestamoController {
    
    @Autowired
    private TipoPrestamoService tipoPrestamoService;
    
    @GetMapping
    public ResponseEntity<List<TipoPrestamo>> getAllTiposPrestamo() {
        try {
            List<TipoPrestamo> tiposPrestamo = tipoPrestamoService.findAll();
            return ResponseEntity.ok(tiposPrestamo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TipoPrestamo> getTipoPrestamoById(@PathVariable Integer id) {
        try {
            Optional<TipoPrestamo> tipoPrestamo = tipoPrestamoService.findById(id);
            return tipoPrestamo.map(ResponseEntity::ok)
                              .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<TipoPrestamo> getTipoPrestamoByNombre(@PathVariable String nombre) {
        try {
            Optional<TipoPrestamo> tipoPrestamo = tipoPrestamoService.findByNombre(nombre);
            return tipoPrestamo.map(ResponseEntity::ok)
                              .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/garantia/{requiere}")
    public ResponseEntity<List<TipoPrestamo>> getTiposPrestamoByGarantia(@PathVariable Boolean requiere) {
        try {
            List<TipoPrestamo> tiposPrestamo = tipoPrestamoService.findByRequiereGarantia(requiere);
            return ResponseEntity.ok(tiposPrestamo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createTipoPrestamo(@RequestBody TipoPrestamo tipoPrestamo) {
        Map<String, Object> response = new HashMap<>();
        try {
            TipoPrestamo nuevoTipoPrestamo = tipoPrestamoService.save(tipoPrestamo);
            response.put("success", true);
            response.put("message", "Tipo de préstamo creado exitosamente");
            response.put("tipoPrestamo", nuevoTipoPrestamo);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateTipoPrestamo(@PathVariable Integer id, @RequestBody TipoPrestamo tipoPrestamo) {
        Map<String, Object> response = new HashMap<>();
        try {
            TipoPrestamo tipoPrestamoActualizado = tipoPrestamoService.update(id, tipoPrestamo);
            response.put("success", true);
            response.put("message", "Tipo de préstamo actualizado exitosamente");
            response.put("tipoPrestamo", tipoPrestamoActualizado);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteTipoPrestamo(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            tipoPrestamoService.delete(id);
            response.put("success", true);
            response.put("message", "Tipo de préstamo eliminado exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
