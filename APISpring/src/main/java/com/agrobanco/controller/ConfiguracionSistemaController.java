package com.agrobanco.controller;

import com.agrobanco.model.ConfiguracionSistema;
import com.agrobanco.service.ConfiguracionSistemaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/configuracion-sistema")
@CrossOrigin(origins = "*")
public class ConfiguracionSistemaController {
    
    @Autowired
    private ConfiguracionSistemaService configuracionSistemaService;
    
    @GetMapping
    public ResponseEntity<List<ConfiguracionSistema>> getAllConfiguraciones() {
        try {
            List<ConfiguracionSistema> configuraciones = configuracionSistemaService.findAll();
            return ResponseEntity.ok(configuraciones);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ConfiguracionSistema> getConfiguracionById(@PathVariable Integer id) {
        try {
            Optional<ConfiguracionSistema> configuracion = configuracionSistemaService.findById(id);
            return configuracion.map(ResponseEntity::ok)
                               .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/clave/{clave}")
    public ResponseEntity<ConfiguracionSistema> getConfiguracionByClave(@PathVariable String clave) {
        try {
            Optional<ConfiguracionSistema> configuracion = configuracionSistemaService.findByClave(clave);
            return configuracion.map(ResponseEntity::ok)
                               .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/valor/{clave}")
    public ResponseEntity<Map<String, Object>> getValorByClave(@PathVariable String clave) {
        Map<String, Object> response = new HashMap<>();
        try {
            String valor = configuracionSistemaService.getValorByClave(clave);
            
            response.put("success", true);
            response.put("clave", clave);
            response.put("valor", valor);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
    
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<ConfiguracionSistema>> getConfiguracionesByTipo(@PathVariable String tipo) {
        try {
            ConfiguracionSistema.TipoConfiguracion tipoConfiguracion = ConfiguracionSistema.TipoConfiguracion.valueOf(tipo);
            List<ConfiguracionSistema> configuraciones = configuracionSistemaService.findByTipo(tipoConfiguracion);
            return ResponseEntity.ok(configuraciones);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/activas")
    public ResponseEntity<List<ConfiguracionSistema>> getConfiguracionesActivas() {
        try {
            List<ConfiguracionSistema> configuraciones = configuracionSistemaService.findByActivo(true);
            return ResponseEntity.ok(configuraciones);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<ConfiguracionSistema>> getConfiguracionesByCategoria(@PathVariable String categoria) {
        try {
            List<ConfiguracionSistema> configuraciones = configuracionSistemaService.findByCategoria(categoria);
            return ResponseEntity.ok(configuraciones);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createConfiguracion(@RequestBody ConfiguracionSistema configuracion) {
        Map<String, Object> response = new HashMap<>();
        try {
            ConfiguracionSistema nuevaConfiguracion = configuracionSistemaService.save(configuracion);
            response.put("success", true);
            response.put("message", "Configuración creada exitosamente");
            response.put("configuracion", nuevaConfiguracion);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateConfiguracion(@PathVariable Integer id, @RequestBody ConfiguracionSistema configuracion) {
        Map<String, Object> response = new HashMap<>();
        try {
            ConfiguracionSistema configuracionActualizada = configuracionSistemaService.update(id, configuracion);
            response.put("success", true);
            response.put("message", "Configuración actualizada exitosamente");
            response.put("configuracion", configuracionActualizada);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PutMapping("/valor/{clave}")
    public ResponseEntity<Map<String, Object>> updateValor(@PathVariable String clave, @RequestBody Map<String, String> valorData) {
        Map<String, Object> response = new HashMap<>();
        try {
            String nuevoValor = valorData.get("valor");
            ConfiguracionSistema configuracionActualizada = configuracionSistemaService.updateValor(clave, nuevoValor);
            
            response.put("success", true);
            response.put("message", "Valor de configuración actualizado exitosamente");
            response.put("configuracion", configuracionActualizada);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PutMapping("/{id}/activar")
    public ResponseEntity<Map<String, Object>> activarConfiguracion(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            ConfiguracionSistema configuracionActualizada = configuracionSistemaService.activarConfiguracion(id);
            response.put("success", true);
            response.put("message", "Configuración activada exitosamente");
            response.put("configuracion", configuracionActualizada);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PutMapping("/{id}/desactivar")
    public ResponseEntity<Map<String, Object>> desactivarConfiguracion(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            ConfiguracionSistema configuracionActualizada = configuracionSistemaService.desactivarConfiguracion(id);
            response.put("success", true);
            response.put("message", "Configuración desactivada exitosamente");
            response.put("configuracion", configuracionActualizada);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PostMapping("/bulk")
    public ResponseEntity<Map<String, Object>> updateMultiplesConfiguraciones(@RequestBody Map<String, String> configuraciones) {
        Map<String, Object> response = new HashMap<>();
        try {
            configuracionSistemaService.updateMultiplesConfiguraciones(configuraciones);
            response.put("success", true);
            response.put("message", "Configuraciones actualizadas exitosamente");
            response.put("cantidadActualizada", configuraciones.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @GetMapping("/validar/{clave}")
    public ResponseEntity<Map<String, Object>> validarConfiguracion(@PathVariable String clave) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean esValida = configuracionSistemaService.validarConfiguracion(clave);
            
            response.put("success", true);
            response.put("clave", clave);
            response.put("esValida", esValida);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping("/exportar")
    public ResponseEntity<Map<String, Object>> exportarConfiguraciones() {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, String> configuracionesExportadas = configuracionSistemaService.exportarConfiguraciones();
            
            response.put("success", true);
            response.put("configuraciones", configuracionesExportadas);
            response.put("totalExportadas", configuracionesExportadas.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteConfiguracion(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            configuracionSistemaService.delete(id);
            response.put("success", true);
            response.put("message", "Configuración eliminada exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
