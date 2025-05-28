package com.agrobanco.repository;

import com.agrobanco.model.PagoPrestamo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PagoPrestamoRepository extends JpaRepository<PagoPrestamo, Integer> {
    
    @Query("SELECT p FROM PagoPrestamo p WHERE p.prestamo.id = :prestamoId ORDER BY p.numeroCuota")
    List<PagoPrestamo> findByPrestamoId(@Param("prestamoId") Integer prestamoId);
    
    @Query("SELECT p FROM PagoPrestamo p WHERE p.prestamo.id = :prestamoId AND p.numeroCuota = :numeroCuota")
    Optional<PagoPrestamo> findByPrestamoIdAndNumeroCuota(@Param("prestamoId") Integer prestamoId, @Param("numeroCuota") Integer numeroCuota);
    
    @Query("SELECT p FROM PagoPrestamo p WHERE p.estado = :estado ORDER BY p.fechaVencimiento")
    List<PagoPrestamo> findByEstado(@Param("estado") PagoPrestamo.EstadoPago estado);
    
    @Query("SELECT p FROM PagoPrestamo p WHERE p.fechaVencimiento BETWEEN :fechaInicio AND :fechaFin ORDER BY p.fechaVencimiento")
    List<PagoPrestamo> findByFechaVencimientoBetween(@Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFin") LocalDate fechaFin);
    
    @Query("SELECT p FROM PagoPrestamo p WHERE p.fechaVencimiento <= :fecha AND p.estado = 'pendiente' ORDER BY p.fechaVencimiento")
    List<PagoPrestamo> findPagosVencidos(@Param("fecha") LocalDate fecha);
    
    @Query("SELECT p FROM PagoPrestamo p WHERE p.prestamo.cliente.id = :clienteId ORDER BY p.fechaVencimiento")
    List<PagoPrestamo> findByClienteId(@Param("clienteId") Integer clienteId);
    
    @Query("SELECT COUNT(p) FROM PagoPrestamo p WHERE p.prestamo.id = :prestamoId AND p.estado = 'pagado'")
    Long countPagosByPrestamoIdAndEstadoPagado(@Param("prestamoId") Integer prestamoId);
    
    @Query("SELECT COUNT(p) FROM PagoPrestamo p WHERE p.prestamo.id = :prestamoId AND p.estado = 'pendiente'")
    Long countPagosPendientesByPrestamoId(@Param("prestamoId") Integer prestamoId);
    
    @Query("SELECT p FROM PagoPrestamo p WHERE p.fechaVencimiento <= CURRENT_DATE AND p.estado = 'pendiente' ORDER BY p.fechaVencimiento")
    List<PagoPrestamo> findPagosVencidos();
    
    @Query("SELECT p FROM PagoPrestamo p WHERE p.fechaVencimiento BETWEEN CURRENT_DATE AND DATE_ADD(CURRENT_DATE, :dias) AND p.estado = 'pendiente' ORDER BY p.fechaVencimiento")
    List<PagoPrestamo> findPagosProximosAVencer(@Param("dias") Integer dias);
    
    @Query("SELECT p FROM PagoPrestamo p WHERE p.fechaVencimiento < CURRENT_DATE AND p.estado = 'pendiente'")
    List<PagoPrestamo> findPagosParaMarcarVencidos();
    
    @Query("SELECT COALESCE(SUM(p.montoPagado), 0) FROM PagoPrestamo p WHERE p.prestamo.id = :prestamoId AND p.estado = 'pagado'")
    BigDecimal calcularTotalPagadoPorPrestamo(@Param("prestamoId") Integer prestamoId);
    
    @Query("SELECT COALESCE(SUM(p.montoCuota), 0) - COALESCE(SUM(p.montoPagado), 0) FROM PagoPrestamo p WHERE p.prestamo.id = :prestamoId")
    BigDecimal calcularSaldoPendientePorPrestamo(@Param("prestamoId") Integer prestamoId);
}
