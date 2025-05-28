package com.agrobanco.controller;

import com.agrobanco.model.PagoPrestamo;
import com.agrobanco.service.PagoPrestamoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/pagos-prestamos")
@CrossOrigin(origins = "*")
public class PagoPrestamoController {
    
    @Autowired
    private PagoPrestamoService pagoPrestamoService;
    
    @GetMapping
    public ResponseEntity<List<PagoPrestamo>> getAllPagosPrestamos() {
        try {
            List<PagoPrestamo> pagos = pagoPrestamoService.findAll();
            return ResponseEntity.ok(pagos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PagoPrestamo> getPagoPrestamoById(@PathVariable Integer id) {
        try {
            Optional<PagoPrestamo> pago = pagoPrestamoService.findById(id);
            return pago.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/prestamo/{prestamoId}")
    public ResponseEntity<List<PagoPrestamo>> getPagosByPrestamoId(@PathVariable Integer prestamoId) {
        try {
            List<PagoPrestamo> pagos = pagoPrestamoService.findByPrestamoId(prestamoId);
            return ResponseEntity.ok(pagos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/prestamo/{prestamoId}/cuota/{numeroCuota}")
    public ResponseEntity<PagoPrestamo> getPagoByPrestamoAndCuota(
            @PathVariable Integer prestamoId, @PathVariable Integer numeroCuota) {
        try {
            Optional<PagoPrestamo> pago = pagoPrestamoService.findByPrestamoIdAndNumeroCuota(prestamoId, numeroCuota);
            return pago.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<PagoPrestamo>> getPagosByEstado(@PathVariable String estado) {
        try {
            PagoPrestamo.EstadoPago estadoPago = PagoPrestamo.EstadoPago.valueOf(estado);
            List<PagoPrestamo> pagos = pagoPrestamoService.findByEstado(estadoPago);
            return ResponseEntity.ok(pagos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/vencidos")
    public ResponseEntity<List<PagoPrestamo>> getPagosVencidos() {
        try {
            List<PagoPrestamo> pagos = pagoPrestamoService.findPagosVencidos();
            return ResponseEntity.ok(pagos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/proximos-vencer/{dias}")
    public ResponseEntity<List<PagoPrestamo>> getPagosProximosAVencer(@PathVariable Integer dias) {
        try {
            List<PagoPrestamo> pagos = pagoPrestamoService.findPagosProximosAVencer(dias);
            return ResponseEntity.ok(pagos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/fecha-vencimiento")
    public ResponseEntity<List<PagoPrestamo>> getPagosByFechaVencimiento(
            @RequestParam LocalDate fechaInicio, @RequestParam LocalDate fechaFin) {
        try {
            List<PagoPrestamo> pagos = pagoPrestamoService.findByFechaVencimientoRange(fechaInicio, fechaFin);
            return ResponseEntity.ok(pagos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createPagoPrestamo(@RequestBody PagoPrestamo pagoPrestamo) {
        Map<String, Object> response = new HashMap<>();
        try {
            PagoPrestamo nuevoPago = pagoPrestamoService.save(pagoPrestamo);
            response.put("success", true);
            response.put("message", "Pago de préstamo creado exitosamente");
            response.put("pago", nuevoPago);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updatePagoPrestamo(@PathVariable Integer id, @RequestBody PagoPrestamo pagoPrestamo) {
        Map<String, Object> response = new HashMap<>();
        try {
            PagoPrestamo pagoActualizado = pagoPrestamoService.update(id, pagoPrestamo);
            response.put("success", true);
            response.put("message", "Pago de préstamo actualizado exitosamente");
            response.put("pago", pagoActualizado);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PutMapping("/{id}/procesar")
    public ResponseEntity<Map<String, Object>> procesarPago(@PathVariable Integer id, @RequestBody Map<String, Object> pagoData) {
        Map<String, Object> response = new HashMap<>();
        try {
            BigDecimal montoPagado = new BigDecimal(pagoData.get("montoPagado").toString());
            
            PagoPrestamo pagoActualizado = pagoPrestamoService.procesarPago(id, montoPagado);
            
            response.put("success", true);
            response.put("message", "Pago procesado exitosamente");
            response.put("pago", pagoActualizado);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PostMapping("/generar-cuotas/{prestamoId}")
    public ResponseEntity<Map<String, Object>> generarCuotasPrestamo(@PathVariable Integer prestamoId) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Necesitamos obtener el objeto Prestamo completo
            // Esto se haría a través del PrestamoService
            response.put("success", false);
            response.put("message", "Método no implementado completamente. Requiere integración con PrestamoService");
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PutMapping("/actualizar-vencidos")
    public ResponseEntity<Map<String, Object>> actualizarEstadosPagosVencidos() {
        Map<String, Object> response = new HashMap<>();
        try {
            pagoPrestamoService.actualizarEstadosPagosVencidos();
            response.put("success", true);
            response.put("message", "Estados de pagos vencidos actualizados exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping("/total-pagado/{prestamoId}")
    public ResponseEntity<Map<String, Object>> getTotalPagadoPrestamo(@PathVariable Integer prestamoId) {
        Map<String, Object> response = new HashMap<>();
        try {
            BigDecimal totalPagado = pagoPrestamoService.calcularTotalPagadoPrestamo(prestamoId);
            response.put("success", true);
            response.put("totalPagado", totalPagado);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping("/saldo-pendiente/{prestamoId}")
    public ResponseEntity<Map<String, Object>> getSaldoPendientePrestamo(@PathVariable Integer prestamoId) {
        Map<String, Object> response = new HashMap<>();
        try {
            BigDecimal saldoPendiente = pagoPrestamoService.calcularSaldoPendientePrestamo(prestamoId);
            response.put("success", true);
            response.put("saldoPendiente", saldoPendiente);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deletePagoPrestamo(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            pagoPrestamoService.delete(id);
            response.put("success", true);
            response.put("message", "Pago de préstamo eliminado exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
