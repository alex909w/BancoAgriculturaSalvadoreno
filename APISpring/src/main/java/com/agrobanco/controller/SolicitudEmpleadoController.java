package com.agrobanco.controller;

import com.agrobanco.model.SolicitudEmpleado;
import com.agrobanco.service.SolicitudEmpleadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/solicitudes-empleados")
@CrossOrigin(origins = "*")
public class SolicitudEmpleadoController {
    
    @Autowired
    private SolicitudEmpleadoService solicitudEmpleadoService;
    
    @GetMapping
    public ResponseEntity<List<SolicitudEmpleado>> getAllSolicitudesEmpleados() {
        try {
            List<SolicitudEmpleado> solicitudes = solicitudEmpleadoService.findAll();
            return ResponseEntity.ok(solicitudes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SolicitudEmpleado> getSolicitudEmpleadoById(@PathVariable Integer id) {
        try {
            Optional<SolicitudEmpleado> solicitud = solicitudEmpleadoService.findById(id);
            return solicitud.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<SolicitudEmpleado>> getSolicitudesByEstado(@PathVariable String estado) {
        try {
            SolicitudEmpleado.EstadoSolicitud estadoSolicitud = SolicitudEmpleado.EstadoSolicitud.valueOf(estado);
            List<SolicitudEmpleado> solicitudes = solicitudEmpleadoService.findByEstado(estadoSolicitud);
            return ResponseEntity.ok(solicitudes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/sucursal/{sucursalId}")
    public ResponseEntity<List<SolicitudEmpleado>> getSolicitudesBySucursal(@PathVariable Integer sucursalId) {
        try {
            List<SolicitudEmpleado> solicitudes = solicitudEmpleadoService.findBySucursalId(sucursalId);
            return ResponseEntity.ok(solicitudes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/dui/{dui}")
    public ResponseEntity<SolicitudEmpleado> getSolicitudByDui(@PathVariable String dui) {
        try {
            Optional<SolicitudEmpleado> solicitud = solicitudEmpleadoService.findByDui(dui);
            return solicitud.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<SolicitudEmpleado> getSolicitudByEmail(@PathVariable String email) {
        try {
            Optional<SolicitudEmpleado> solicitud = solicitudEmpleadoService.findByEmail(email);
            return solicitud.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/puesto/{puesto}")
    public ResponseEntity<List<SolicitudEmpleado>> getSolicitudesByPuesto(@PathVariable String puesto) {
        try {
            List<SolicitudEmpleado> solicitudes = solicitudEmpleadoService.findByPuestoSolicitado(puesto);
            return ResponseEntity.ok(solicitudes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/gerente/{gerenteId}")
    public ResponseEntity<List<SolicitudEmpleado>> getSolicitudesByGerente(@PathVariable Integer gerenteId) {
        try {
            List<SolicitudEmpleado> solicitudes = solicitudEmpleadoService.findByGerenteRevisorId(gerenteId);
            return ResponseEntity.ok(solicitudes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/fecha-solicitud")
    public ResponseEntity<List<SolicitudEmpleado>> getSolicitudesByFechaSolicitud(
            @RequestParam LocalDate fechaInicio, @RequestParam LocalDate fechaFin) {
        try {
            List<SolicitudEmpleado> solicitudes = solicitudEmpleadoService.findByFechaSolicitudRange(fechaInicio, fechaFin);
            return ResponseEntity.ok(solicitudes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/pendientes-tiempo/{dias}")
    public ResponseEntity<List<SolicitudEmpleado>> getSolicitudesPendientesPorTiempo(@PathVariable Integer dias) {
        try {
            List<SolicitudEmpleado> solicitudes = solicitudEmpleadoService.findSolicitudesPendientesPorTiempo(dias);
            return ResponseEntity.ok(solicitudes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createSolicitudEmpleado(@RequestBody SolicitudEmpleado solicitudEmpleado) {
        Map<String, Object> response = new HashMap<>();
        try {
            SolicitudEmpleado nuevaSolicitud = solicitudEmpleadoService.save(solicitudEmpleado);
            response.put("success", true);
            response.put("message", "Solicitud de empleado creada exitosamente");
            response.put("solicitud", nuevaSolicitud);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateSolicitudEmpleado(@PathVariable Integer id, @RequestBody SolicitudEmpleado solicitudEmpleado) {
        Map<String, Object> response = new HashMap<>();
        try {
            SolicitudEmpleado solicitudActualizada = solicitudEmpleadoService.update(id, solicitudEmpleado);
            response.put("success", true);
            response.put("message", "Solicitud de empleado actualizada exitosamente");
            response.put("solicitud", solicitudActualizada);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PutMapping("/{id}/aprobar")
    public ResponseEntity<Map<String, Object>> aprobarSolicitud(@PathVariable Integer id, @RequestBody Map<String, Object> aprobacionData) {
        Map<String, Object> response = new HashMap<>();
        try {
            Integer gerenteRevisorId = aprobacionData.get("gerenteRevisorId") != null ? 
                                      (Integer) aprobacionData.get("gerenteRevisorId") : null;
            String observaciones = (String) aprobacionData.get("observaciones");
            
            SolicitudEmpleado solicitudAprobada = solicitudEmpleadoService.aprobarSolicitud(id, gerenteRevisorId, observaciones);
            
            response.put("success", true);
            response.put("message", "Solicitud aprobada exitosamente");
            response.put("solicitud", solicitudAprobada);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PutMapping("/{id}/rechazar")
    public ResponseEntity<Map<String, Object>> rechazarSolicitud(@PathVariable Integer id, @RequestBody Map<String, Object> rechazoData) {
        Map<String, Object> response = new HashMap<>();
        try {
            Integer gerenteRevisorId = rechazoData.get("gerenteRevisorId") != null ? 
                                      (Integer) rechazoData.get("gerenteRevisorId") : null;
            String observaciones = (String) rechazoData.get("observaciones");
            
            SolicitudEmpleado solicitudRechazada = solicitudEmpleadoService.rechazarSolicitud(id, gerenteRevisorId, observaciones);
            
            response.put("success", true);
            response.put("message", "Solicitud rechazada exitosamente");
            response.put("solicitud", solicitudRechazada);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PutMapping("/{id}/en-revision")
    public ResponseEntity<Map<String, Object>> marcarEnRevision(@PathVariable Integer id, @RequestBody Map<String, Integer> revisionData) {
        Map<String, Object> response = new HashMap<>();
        try {
            Integer gerenteRevisorId = revisionData.get("gerenteRevisorId");
            
            SolicitudEmpleado solicitudEnRevision = solicitudEmpleadoService.marcarEnRevision(id, gerenteRevisorId);
            
            response.put("success", true);
            response.put("message", "Solicitud marcada en revisión exitosamente");
            response.put("solicitud", solicitudEnRevision);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @GetMapping("/estadisticas/estado/{estado}")
    public ResponseEntity<Map<String, Object>> getEstadisticasPorEstado(@PathVariable String estado) {
        Map<String, Object> response = new HashMap<>();
        try {
            SolicitudEmpleado.EstadoSolicitud estadoSolicitud = SolicitudEmpleado.EstadoSolicitud.valueOf(estado);
            long count = solicitudEmpleadoService.contarSolicitudesPorEstado(estadoSolicitud);
            
            response.put("success", true);
            response.put("estado", estado);
            response.put("cantidad", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping("/estadisticas/sucursal/{sucursalId}")
    public ResponseEntity<Map<String, Object>> getEstadisticasPorSucursal(@PathVariable Integer sucursalId) {
        Map<String, Object> response = new HashMap<>();
        try {
            long count = solicitudEmpleadoService.contarSolicitudesPorSucursal(sucursalId);
            
            response.put("success", true);
            response.put("sucursalId", sucursalId);
            response.put("cantidad", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping("/validar-dui/{dui}")
    public ResponseEntity<Map<String, Object>> validarDuiDisponible(@PathVariable String dui) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean existe = solicitudEmpleadoService.existsByDui(dui);
            
            response.put("success", true);
            response.put("dui", dui);
            response.put("existe", existe);
            response.put("disponible", !existe);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping("/validar-email/{email}")
    public ResponseEntity<Map<String, Object>> validarEmailDisponible(@PathVariable String email) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean existe = solicitudEmpleadoService.existsByEmail(email);
            
            response.put("success", true);
            response.put("email", email);
            response.put("existe", existe);
            response.put("disponible", !existe);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteSolicitudEmpleado(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            solicitudEmpleadoService.delete(id);
            response.put("success", true);
            response.put("message", "Solicitud de empleado eliminada exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
