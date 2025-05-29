package com.agrobanco.controller;

import com.agrobanco.model.Auditoria;
import com.agrobanco.service.AuditoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auditoria")
@CrossOrigin(origins = "*")
public class AuditoriaController {
    
    @Autowired
    private AuditoriaService auditoriaService;
    
    @GetMapping
    public ResponseEntity<List<Auditoria>> getAllAuditorias() {
        try {
            List<Auditoria> auditorias = auditoriaService.findAll();
            return ResponseEntity.ok(auditorias);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Auditoria> getAuditoriaById(@PathVariable Integer id) {
        try {
            Optional<Auditoria> auditoria = auditoriaService.findById(id);
            return auditoria.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/tabla/{tablaAfectada}")
    public ResponseEntity<List<Auditoria>> getAuditoriasByTabla(@PathVariable String tablaAfectada) {
        try {
            List<Auditoria> auditorias = auditoriaService.findByTablaAfectada(tablaAfectada);
            return ResponseEntity.ok(auditorias);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/accion/{accion}")
    public ResponseEntity<List<Auditoria>> getAuditoriasByAccion(@PathVariable String accion) {
        try {
            Auditoria.AccionAuditoria accionAuditoria = Auditoria.AccionAuditoria.valueOf(accion.toUpperCase());
            List<Auditoria> auditorias = auditoriaService.findByAccion(accionAuditoria);
            return ResponseEntity.ok(auditorias);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Auditoria>> getAuditoriasByUsuario(@PathVariable Integer usuarioId) {
        try {
            List<Auditoria> auditorias = auditoriaService.findByUsuarioId(usuarioId);
            return ResponseEntity.ok(auditorias);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/fecha")
    public ResponseEntity<List<Auditoria>> getAuditoriasByFecha(
            @RequestParam LocalDateTime fechaInicio, @RequestParam LocalDateTime fechaFin) {
        try {
            List<Auditoria> auditorias = auditoriaService.findByFechaRange(fechaInicio, fechaFin);
            return ResponseEntity.ok(auditorias);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/registro/{registroId}")
    public ResponseEntity<List<Auditoria>> getAuditoriasByRegistro(@PathVariable Integer registroId) {
        try {
            List<Auditoria> auditorias = auditoriaService.findByRegistroId(registroId);
            return ResponseEntity.ok(auditorias);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/recientes/{limit}")
    public ResponseEntity<List<Auditoria>> getAuditoriasRecientes(@PathVariable Integer limit) {
        try {
            List<Auditoria> auditorias = auditoriaService.findRecientes(limit);
            return ResponseEntity.ok(auditorias);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createAuditoria(@RequestBody Auditoria auditoria) {
        Map<String, Object> response = new HashMap<>();
        try {
            Auditoria nuevaAuditoria = auditoriaService.save(auditoria);
            response.put("success", true);
            response.put("message", "Registro de auditoría creado exitosamente");
            response.put("auditoria", nuevaAuditoria);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PostMapping("/registrar")
    public ResponseEntity<Map<String, Object>> registrarAccion(@RequestBody Map<String, Object> auditData) {
        Map<String, Object> response = new HashMap<>();
        try {
            String tablaAfectada = (String) auditData.get("tablaAfectada");
            String accion = (String) auditData.get("accion");
            Integer registroId = (Integer) auditData.get("registroId");
            Integer usuarioId = (Integer) auditData.get("usuarioId");
            String datosAnteriores = auditData.get("datosAnteriores") != null ? 
                                   auditData.get("datosAnteriores").toString() : null;
            String datosNuevos = auditData.get("datosNuevos") != null ? 
                               auditData.get("datosNuevos").toString() : null;
            String direccionIp = (String) auditData.get("direccionIp");
            String userAgent = (String) auditData.get("userAgent");
            
            Auditoria auditoria = auditoriaService.registrarAccion(
                tablaAfectada, 
                Auditoria.AccionAuditoria.valueOf(accion.toUpperCase()), 
                registroId, 
                usuarioId, 
                datosAnteriores, 
                datosNuevos, 
                direccionIp, 
                userAgent
            );
            
            response.put("success", true);
            response.put("message", "Acción auditada exitosamente");
            response.put("auditoria", auditoria);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @GetMapping("/estadisticas/acciones")
    public ResponseEntity<Map<String, Object>> getEstadisticasAcciones() {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Long> estadisticas = new HashMap<>();
            for (Auditoria.AccionAuditoria accion : Auditoria.AccionAuditoria.values()) {
                long count = auditoriaService.contarPorAccion(accion);
                estadisticas.put(accion.name(), count);
            }
            
            response.put("success", true);
            response.put("estadisticas", estadisticas);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
      @GetMapping("/estadisticas/tablas")
    public ResponseEntity<Map<String, Object>> getEstadisticasTablas() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Object[]> resultados = auditoriaService.contarPorTabla();
            
            // Convertir List<Object[]> a Map<String, Long>
            Map<String, Long> estadisticas = new HashMap<>();
            for (Object[] resultado : resultados) {
                String tabla = (String) resultado[0];
                Long conteo = (Long) resultado[1];
                estadisticas.put(tabla, conteo);
            }
            
            response.put("success", true);
            response.put("estadisticas", estadisticas);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteAuditoria(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            auditoriaService.delete(id);
            response.put("success", true);
            response.put("message", "Registro de auditoría eliminado exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @DeleteMapping("/limpiar")
    public ResponseEntity<Map<String, Object>> limpiarAuditoriaAntigua(@RequestParam Integer diasAntiguedad) {
        Map<String, Object> response = new HashMap<>();
        try {
            auditoriaService.limpiarRegistrosAntiguos(diasAntiguedad);
            response.put("success", true);
            response.put("message", "Registros de auditoría antiguos eliminados exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
