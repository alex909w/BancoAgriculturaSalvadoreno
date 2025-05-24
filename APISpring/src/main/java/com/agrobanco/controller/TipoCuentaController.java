package com.agrobanco.controller;

import com.agrobanco.model.TipoCuenta;
import com.agrobanco.service.TipoCuentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/tipos-cuenta")
@CrossOrigin(origins = "*")
public class TipoCuentaController {
    
    @Autowired
    private TipoCuentaService tipoCuentaService;
    
    @GetMapping
    public ResponseEntity<List<TipoCuenta>> getAllTiposCuenta() {
        try {
            List<TipoCuenta> tiposCuenta = tipoCuentaService.findAll();
            return ResponseEntity.ok(tiposCuenta);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TipoCuenta> getTipoCuentaById(@PathVariable Integer id) {
        try {
            Optional<TipoCuenta> tipoCuenta = tipoCuentaService.findById(id);
            return tipoCuenta.map(ResponseEntity::ok)
                            .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<TipoCuenta> getTipoCuentaByNombre(@PathVariable String nombre) {
        try {
            Optional<TipoCuenta> tipoCuenta = tipoCuentaService.findByNombre(nombre);
            return tipoCuenta.map(ResponseEntity::ok)
                            .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createTipoCuenta(@RequestBody TipoCuenta tipoCuenta) {
        Map<String, Object> response = new HashMap<>();
        try {
            TipoCuenta nuevoTipoCuenta = tipoCuentaService.save(tipoCuenta);
            response.put("success", true);
            response.put("message", "Tipo de cuenta creado exitosamente");
            response.put("tipoCuenta", nuevoTipoCuenta);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateTipoCuenta(@PathVariable Integer id, @RequestBody TipoCuenta tipoCuenta) {
        Map<String, Object> response = new HashMap<>();
        try {
            TipoCuenta tipoCuentaActualizado = tipoCuentaService.update(id, tipoCuenta);
            response.put("success", true);
            response.put("message", "Tipo de cuenta actualizado exitosamente");
            response.put("tipoCuenta", tipoCuentaActualizado);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteTipoCuenta(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            tipoCuentaService.delete(id);
            response.put("success", true);
            response.put("message", "Tipo de cuenta eliminado exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
