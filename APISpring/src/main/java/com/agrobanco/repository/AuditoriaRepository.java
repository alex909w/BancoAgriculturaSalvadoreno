package com.agrobanco.repository;

import com.agrobanco.model.Auditoria;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditoriaRepository extends JpaRepository<Auditoria, Integer> {
    
    @Query("SELECT a FROM Auditoria a WHERE a.tablaAfectada = :tabla")
    List<Auditoria> findByTablaAfectada(@Param("tabla") String tabla);
    
    @Query("SELECT a FROM Auditoria a WHERE a.tablaAfectada = :tabla AND a.registroId = :registroId ORDER BY a.createdAt DESC")
    List<Auditoria> findByTablaAfectadaAndRegistroId(@Param("tabla") String tabla, @Param("registroId") Integer registroId);
    
    @Query("SELECT a FROM Auditoria a WHERE a.usuario.id = :usuarioId ORDER BY a.createdAt DESC")
    List<Auditoria> findByUsuarioId(@Param("usuarioId") Integer usuarioId);
    
    @Query("SELECT a FROM Auditoria a WHERE a.accion = :accion ORDER BY a.createdAt DESC")
    List<Auditoria> findByAccion(@Param("accion") Auditoria.AccionAuditoria accion);
    
    @Query("SELECT a FROM Auditoria a WHERE a.createdAt BETWEEN :fechaInicio AND :fechaFin ORDER BY a.createdAt DESC")
    List<Auditoria> findByCreatedAtBetween(@Param("fechaInicio") LocalDateTime fechaInicio, @Param("fechaFin") LocalDateTime fechaFin);
      @Query("SELECT a FROM Auditoria a WHERE a.ipAddress = :ipAddress ORDER BY a.createdAt DESC")
    List<Auditoria> findByIpAddress(@Param("ipAddress") String ipAddress);
    
    // Métodos adicionales requeridos por AuditoriaService    @Query("SELECT a FROM Auditoria a WHERE a.registroId = :registroId ORDER BY a.createdAt DESC")
    List<Auditoria> findByRegistroId(@Param("registroId") Integer registroId);
    
    @Query("SELECT a FROM Auditoria a ORDER BY a.createdAt DESC")
    List<Auditoria> findRecentAuditorias(Pageable pageable);
    
    @Query("SELECT COUNT(a) FROM Auditoria a WHERE a.accion = :accion")
    long countByAccion(@Param("accion") Auditoria.AccionAuditoria accion);
    
    @Query("SELECT a.tablaAfectada, COUNT(a) FROM Auditoria a GROUP BY a.tablaAfectada")
    List<Object[]> countByTablaAfectada();
    
    @Modifying
    @Query("DELETE FROM Auditoria a WHERE a.createdAt < :fechaLimite")
    void deleteByCreatedAtBefore(@Param("fechaLimite") LocalDateTime fechaLimite);
}
