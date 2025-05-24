package com.agrobanco.controller;

import com.agrobanco.model.Sucursal;
import com.agrobanco.service.SucursalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/sucursales")
@CrossOrigin(origins = "*")
public class SucursalController {
    
    @Autowired
    private SucursalService sucursalService;
    
    @GetMapping
    public ResponseEntity<List<Sucursal>> getAllSucursales() {
        try {
            List<Sucursal> sucursales = sucursalService.findAll();
            return ResponseEntity.ok(sucursales);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Sucursal> getSucursalById(@PathVariable Integer id) {
        try {
            Optional<Sucursal> sucursal = sucursalService.findById(id);
            return sucursal.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<Sucursal> getSucursalByCodigo(@PathVariable String codigo) {
        try {
            Optional<Sucursal> sucursal = sucursalService.findByCodigo(codigo);
            return sucursal.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Sucursal>> getSucursalesByEstado(@PathVariable String estado) {
        try {
            Sucursal.EstadoSucursal estadoSucursal = Sucursal.EstadoSucursal.valueOf(estado);
            List<Sucursal> sucursales = sucursalService.findByEstado(estadoSucursal);
            return ResponseEntity.ok(sucursales);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<Sucursal>> getSucursalesByTipo(@PathVariable String tipo) {
        try {
            Sucursal.TipoSucursal tipoSucursal = Sucursal.TipoSucursal.valueOf(tipo);
            List<Sucursal> sucursales = sucursalService.findByTipo(tipoSucursal);
            return ResponseEntity.ok(sucursales);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/departamento/{departamento}")
    public ResponseEntity<List<Sucursal>> getSucursalesByDepartamento(@PathVariable String departamento) {
        try {
            List<Sucursal> sucursales = sucursalService.findByDepartamento(departamento);
            return ResponseEntity.ok(sucursales);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createSucursal(@RequestBody Sucursal sucursal) {
        Map<String, Object> response = new HashMap<>();
        try {
            Sucursal nuevaSucursal = sucursalService.save(sucursal);
            response.put("success", true);
            response.put("message", "Sucursal creada exitosamente");
            response.put("sucursal", nuevaSucursal);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateSucursal(@PathVariable Integer id, @RequestBody Sucursal sucursal) {
        Map<String, Object> response = new HashMap<>();
        try {
            Sucursal sucursalActualizada = sucursalService.update(id, sucursal);
            response.put("success", true);
            response.put("message", "Sucursal actualizada exitosamente");
            response.put("sucursal", sucursalActualizada);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteSucursal(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            sucursalService.delete(id);
            response.put("success", true);
            response.put("message", "Sucursal eliminada exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
