package com.agrobanco.repository;

import com.agrobanco.model.ConfiguracionSistema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConfiguracionSistemaRepository extends JpaRepository<ConfiguracionSistema, Integer> {
    
    @Query("SELECT c FROM ConfiguracionSistema c WHERE c.clave = :clave")
    Optional<ConfiguracionSistema> findByClave(@Param("clave") String clave);
    
    @Query("SELECT c FROM ConfiguracionSistema c WHERE c.tipo = :tipo")
    List<ConfiguracionSistema> findByTipo(@Param("tipo") ConfiguracionSistema.TipoConfiguracion tipo);
    
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM ConfiguracionSistema c WHERE c.clave = :clave")
    boolean existsByClave(@Param("clave") String clave);
    
    @Query("SELECT c.valor FROM ConfiguracionSistema c WHERE c.clave = :clave")
    Optional<String> findValorByClave(@Param("clave") String clave);
    
    @Modifying
    @Query("DELETE FROM ConfiguracionSistema c WHERE c.clave = :clave")
    void deleteByClave(@Param("clave") String clave);
    
    // Métodos para simular categoria basada en descripción
    @Query("SELECT c FROM ConfiguracionSistema c WHERE c.descripcion LIKE %:categoria%")
    List<ConfiguracionSistema> findByDescripcionContaining(@Param("categoria") String categoria);
}
