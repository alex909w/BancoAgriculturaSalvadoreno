package com.agrobanco.repository;

import com.agrobanco.model.Transaccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransaccionRepository extends JpaRepository<Transaccion, Integer> {
    
    @Query("SELECT t FROM Transaccion t WHERE t.numeroTransaccion = :numeroTransaccion")
    Optional<Transaccion> findByNumeroTransaccion(@Param("numeroTransaccion") String numeroTransaccion);
    
    @Query("SELECT t FROM Transaccion t WHERE t.cuentaOrigen.id = :cuentaId OR t.cuentaDestino.id = :cuentaId ORDER BY t.fechaTransaccion DESC")
    List<Transaccion> findByCuentaId(@Param("cuentaId") Integer cuentaId);
    
    @Query("SELECT t FROM Transaccion t WHERE t.cuentaOrigen.id = :cuentaId ORDER BY t.fechaTransaccion DESC")
    List<Transaccion> findByCuentaOrigenId(@Param("cuentaId") Integer cuentaId);
    
    @Query("SELECT t FROM Transaccion t WHERE t.estado = :estado")
    List<Transaccion> findByEstado(@Param("estado") Transaccion.EstadoTransaccion estado);
    
    @Query("SELECT t FROM Transaccion t WHERE t.fechaTransaccion BETWEEN :fechaInicio AND :fechaFin")
    List<Transaccion> findByFechaTransaccionBetween(@Param("fechaInicio") LocalDateTime fechaInicio, @Param("fechaFin") LocalDateTime fechaFin);
    
    @Query("SELECT t FROM Transaccion t WHERE t.sucursal.id = :sucursalId ORDER BY t.fechaTransaccion DESC")
    List<Transaccion> findBySucursalId(@Param("sucursalId") Integer sucursalId);
    
    @Query("SELECT t FROM Transaccion t WHERE t.cajero.id = :cajeroId ORDER BY t.fechaTransaccion DESC")
    List<Transaccion> findByCajeroId(@Param("cajeroId") Integer cajeroId);
}
