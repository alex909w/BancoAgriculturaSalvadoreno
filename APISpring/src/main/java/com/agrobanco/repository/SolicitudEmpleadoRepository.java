package com.agrobanco.repository;

import com.agrobanco.model.SolicitudEmpleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SolicitudEmpleadoRepository extends JpaRepository<SolicitudEmpleado, Integer> {
    
    @Query("SELECT s FROM SolicitudEmpleado s WHERE s.estado = :estado ORDER BY s.fechaSolicitud DESC")
    List<SolicitudEmpleado> findByEstado(@Param("estado") SolicitudEmpleado.EstadoSolicitud estado);
    
    @Query("SELECT s FROM SolicitudEmpleado s WHERE s.sucursal.id = :sucursalId ORDER BY s.fechaSolicitud DESC")
    List<SolicitudEmpleado> findBySucursalId(@Param("sucursalId") Integer sucursalId);
    
    @Query("SELECT s FROM SolicitudEmpleado s WHERE s.dui = :dui")
    Optional<SolicitudEmpleado> findByDui(@Param("dui") String dui);
    
    @Query("SELECT s FROM SolicitudEmpleado s WHERE s.email = :email")
    Optional<SolicitudEmpleado> findByEmail(@Param("email") String email);
    
    @Query("SELECT s FROM SolicitudEmpleado s WHERE s.gerenteRevisor.id = :gerenteId ORDER BY s.fechaRevision DESC")
    List<SolicitudEmpleado> findByGerenteRevisorId(@Param("gerenteId") Integer gerenteId);
    
    @Query("SELECT s FROM SolicitudEmpleado s WHERE s.fechaSolicitud BETWEEN :fechaInicio AND :fechaFin ORDER BY s.fechaSolicitud DESC")
    List<SolicitudEmpleado> findByFechaSolicitudBetween(@Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFin") LocalDate fechaFin);
    
    @Query("SELECT s FROM SolicitudEmpleado s WHERE s.puestoSolicitado = :puesto ORDER BY s.fechaSolicitud DESC")
    List<SolicitudEmpleado> findByPuestoSolicitado(@Param("puesto") String puesto);
    
    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM SolicitudEmpleado s WHERE s.dui = :dui")
    boolean existsByDui(@Param("dui") String dui);
    
    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM SolicitudEmpleado s WHERE s.email = :email")
    boolean existsByEmail(@Param("email") String email);
    
    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM SolicitudEmpleado s WHERE s.dui = :dui AND s.estado IN :estados")
    boolean existsByDuiAndEstadoIn(@Param("dui") String dui, @Param("estados") List<SolicitudEmpleado.EstadoSolicitud> estados);
    
    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM SolicitudEmpleado s WHERE s.email = :email AND s.estado IN :estados")
    boolean existsByEmailAndEstadoIn(@Param("email") String email, @Param("estados") List<SolicitudEmpleado.EstadoSolicitud> estados);
    
    @Query("SELECT s FROM SolicitudEmpleado s WHERE s.estado = 'pendiente' AND DATEDIFF(CURRENT_DATE, s.fechaSolicitud) >= :dias ORDER BY s.fechaSolicitud")
    List<SolicitudEmpleado> findSolicitudesPendientesPorTiempo(@Param("dias") Integer dias);
    
    @Query("SELECT COUNT(s) FROM SolicitudEmpleado s WHERE s.estado = :estado")
    long countByEstado(@Param("estado") SolicitudEmpleado.EstadoSolicitud estado);
    
    @Query("SELECT COUNT(s) FROM SolicitudEmpleado s WHERE s.sucursal.id = :sucursalId")
    long countBySucursalId(@Param("sucursalId") Integer sucursalId);
}
