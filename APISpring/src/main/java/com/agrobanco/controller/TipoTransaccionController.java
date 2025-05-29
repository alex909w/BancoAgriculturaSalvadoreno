package com.agrobanco.controller;

import com.agrobanco.model.TipoTransaccion;
import com.agrobanco.service.TipoTransaccionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/tipos-transaccion")
@CrossOrigin(origins = "*")
public class TipoTransaccionController {
    
    @Autowired
    private TipoTransaccionService tipoTransaccionService;
    
    @GetMapping
    public ResponseEntity<List<TipoTransaccion>> getAllTiposTransaccion() {
        try {
            List<TipoTransaccion> tiposTransaccion = tipoTransaccionService.findAll();
            return ResponseEntity.ok(tiposTransaccion);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TipoTransaccion> getTipoTransaccionById(@PathVariable Integer id) {
        try {
            Optional<TipoTransaccion> tipoTransaccion = tipoTransaccionService.findById(id);
            return tipoTransaccion.map(ResponseEntity::ok)
                                 .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<TipoTransaccion> getTipoTransaccionByNombre(@PathVariable String nombre) {
        try {
            Optional<TipoTransaccion> tipoTransaccion = tipoTransaccionService.findByNombre(nombre);
            return tipoTransaccion.map(ResponseEntity::ok)
                                 .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createTipoTransaccion(@RequestBody TipoTransaccion tipoTransaccion) {
        Map<String, Object> response = new HashMap<>();
        try {
            TipoTransaccion nuevoTipoTransaccion = tipoTransaccionService.save(tipoTransaccion);
            response.put("success", true);
            response.put("message", "Tipo de transacción creado exitosamente");
            response.put("tipoTransaccion", nuevoTipoTransaccion);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateTipoTransaccion(@PathVariable Integer id, @RequestBody TipoTransaccion tipoTransaccion) {
        Map<String, Object> response = new HashMap<>();
        try {
            TipoTransaccion tipoTransaccionActualizado = tipoTransaccionService.update(id, tipoTransaccion);
            response.put("success", true);
            response.put("message", "Tipo de transacción actualizado exitosamente");
            response.put("tipoTransaccion", tipoTransaccionActualizado);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteTipoTransaccion(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            tipoTransaccionService.delete(id);
            response.put("success", true);
            response.put("message", "Tipo de transacción eliminado exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
