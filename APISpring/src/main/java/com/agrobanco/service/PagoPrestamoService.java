package com.agrobanco.service;

import com.agrobanco.model.PagoPrestamo;
import com.agrobanco.model.Prestamo;
import com.agrobanco.repository.PagoPrestamoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PagoPrestamoService {
    
    @Autowired
    private PagoPrestamoRepository pagoPrestamoRepository;
    
    @Transactional(readOnly = true)
    public List<PagoPrestamo> findAll() {
        return pagoPrestamoRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Optional<PagoPrestamo> findById(Integer id) {
        return pagoPrestamoRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public List<PagoPrestamo> findByPrestamoId(Integer prestamoId) {
        return pagoPrestamoRepository.findByPrestamoId(prestamoId);
    }
    
    @Transactional(readOnly = true)
    public Optional<PagoPrestamo> findByPrestamoIdAndNumeroCuota(Integer prestamoId, Integer numeroCuota) {
        return pagoPrestamoRepository.findByPrestamoIdAndNumeroCuota(prestamoId, numeroCuota);
    }
    
    @Transactional(readOnly = true)
    public List<PagoPrestamo> findByEstado(PagoPrestamo.EstadoPago estado) {
        return pagoPrestamoRepository.findByEstado(estado);
    }
    
    @Transactional(readOnly = true)
    public List<PagoPrestamo> findByFechaVencimientoRange(LocalDate fechaInicio, LocalDate fechaFin) {
        return pagoPrestamoRepository.findByFechaVencimientoBetween(fechaInicio, fechaFin);
    }
    
    @Transactional(readOnly = true)
    public List<PagoPrestamo> findPagosVencidos() {
        return pagoPrestamoRepository.findPagosVencidos();
    }
    
    @Transactional(readOnly = true)
    public List<PagoPrestamo> findPagosProximosAVencer(Integer dias) {
        return pagoPrestamoRepository.findPagosProximosAVencer(dias);
    }
    
    @Transactional
    public PagoPrestamo save(PagoPrestamo pagoPrestamo) {
        return pagoPrestamoRepository.save(pagoPrestamo);
    }
    
    @Transactional
    public PagoPrestamo update(Integer id, PagoPrestamo pagoPrestamo) {
        if (!pagoPrestamoRepository.existsById(id)) {
            throw new RuntimeException("Pago de préstamo no encontrado");
        }
        pagoPrestamo.setId(id);
        return pagoPrestamoRepository.save(pagoPrestamo);
    }
    
    @Transactional
    public void delete(Integer id) {
        if (!pagoPrestamoRepository.existsById(id)) {
            throw new RuntimeException("Pago de préstamo no encontrado");
        }
        pagoPrestamoRepository.deleteById(id);
    }
    
    @Transactional
    public PagoPrestamo procesarPago(Integer pagoId, BigDecimal montoPagado) {
        PagoPrestamo pago = pagoPrestamoRepository.findById(pagoId)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));
        
        if (pago.getEstado() != PagoPrestamo.EstadoPago.pendiente) {
            throw new RuntimeException("El pago ya fue procesado");
        }
        
        pago.setMontoPagado(montoPagado);
        pago.setFechaPago(LocalDate.now());
        
        // Determinar estado según el monto pagado
        BigDecimal montoCuota = pago.getMontoCuota();
        if (montoPagado.compareTo(montoCuota) >= 0) {
            pago.setEstado(PagoPrestamo.EstadoPago.pagado);
        } else {
            // Si es pago parcial, mantener como pendiente o crear otra lógica
            pago.setEstado(PagoPrestamo.EstadoPago.pagado);
        }
        
        return pagoPrestamoRepository.save(pago);
    }
    
    @Transactional
    public void generarCuotasPrestamo(Prestamo prestamo) {
        // Limpiar cuotas existentes si las hay
        List<PagoPrestamo> cuotasExistentes = pagoPrestamoRepository.findByPrestamoId(prestamo.getId());
        if (!cuotasExistentes.isEmpty()) {
            pagoPrestamoRepository.deleteAll(cuotasExistentes);
        }
        
        // Generar nuevas cuotas
        LocalDate fechaInicio = prestamo.getFechaDesembolso() != null ? 
                                prestamo.getFechaDesembolso() : LocalDate.now();
        
        BigDecimal montoCapitalPorCuota = prestamo.getMontoAprobado()
                .divide(BigDecimal.valueOf(prestamo.getPlazoMeses()), 2, BigDecimal.ROUND_HALF_UP);
        
        for (int i = 1; i <= prestamo.getPlazoMeses(); i++) {
            PagoPrestamo cuota = new PagoPrestamo();
            cuota.setPrestamo(prestamo);
            cuota.setNumeroCuota(i);
            cuota.setMontoCuota(prestamo.getCuotaMensual());
            cuota.setMontoCapital(montoCapitalPorCuota);
            cuota.setMontoInteres(prestamo.getCuotaMensual().subtract(montoCapitalPorCuota));
            cuota.setFechaVencimiento(fechaInicio.plusMonths(i));
            cuota.setEstado(PagoPrestamo.EstadoPago.pendiente);
            
            pagoPrestamoRepository.save(cuota);
        }
    }
    
    @Transactional
    public void actualizarEstadosPagosVencidos() {
        List<PagoPrestamo> pagosVencidos = pagoPrestamoRepository.findPagosParaMarcarVencidos();
        
        for (PagoPrestamo pago : pagosVencidos) {
            pago.setEstado(PagoPrestamo.EstadoPago.vencido);
            pagoPrestamoRepository.save(pago);
        }
    }
    
    @Transactional(readOnly = true)
    public BigDecimal calcularTotalPagadoPrestamo(Integer prestamoId) {
        return pagoPrestamoRepository.calcularTotalPagadoPorPrestamo(prestamoId);
    }
    
    @Transactional(readOnly = true)
    public BigDecimal calcularSaldoPendientePrestamo(Integer prestamoId) {
        return pagoPrestamoRepository.calcularSaldoPendientePorPrestamo(prestamoId);
    }
}
