package com.agrobanco.repository;

import com.agrobanco.model.Prestamo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrestamoRepository extends JpaRepository<Prestamo, Integer> {
    
    @Query("SELECT p FROM Prestamo p WHERE p.numeroPrestamo = :numeroPrestamo")
    Optional<Prestamo> findByNumeroPrestamo(@Param("numeroPrestamo") String numeroPrestamo);
    
    @Query("SELECT p FROM Prestamo p WHERE p.cliente.id = :clienteId ORDER BY p.fechaSolicitud DESC")
    List<Prestamo> findByClienteId(@Param("clienteId") Integer clienteId);
    
    @Query("SELECT p FROM Prestamo p WHERE p.estado = :estado")
    List<Prestamo> findByEstado(@Param("estado") Prestamo.EstadoPrestamo estado);
    
    @Query("SELECT p FROM Prestamo p WHERE p.tipoPrestamo.id = :tipoPrestamoId")
    List<Prestamo> findByTipoPrestamoId(@Param("tipoPrestamoId") Integer tipoPrestamoId);
    
    @Query("SELECT p FROM Prestamo p WHERE p.cajero.id = :cajeroId ORDER BY p.fechaSolicitud DESC")
    List<Prestamo> findByCajeroId(@Param("cajeroId") Integer cajeroId);
    
    @Query("SELECT p FROM Prestamo p WHERE p.gerenteAprobador.id = :gerenteId ORDER BY p.fechaAprobacion DESC")
    List<Prestamo> findByGerenteAprobadorId(@Param("gerenteId") Integer gerenteId);
    
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Prestamo p WHERE p.numeroPrestamo = :numeroPrestamo")
    boolean existsByNumeroPrestamo(@Param("numeroPrestamo") String numeroPrestamo);
}
