package com.agrobanco.repository;

import com.agrobanco.model.TipoTransaccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TipoTransaccionRepository extends JpaRepository<TipoTransaccion, Integer> {
    
    @Query("SELECT tt FROM TipoTransaccion tt WHERE tt.nombre = :nombre")
    Optional<TipoTransaccion> findByNombre(@Param("nombre") String nombre);
    
    @Query("SELECT tt FROM TipoTransaccion tt WHERE tt.requiereCuentaDestino = :requiere")
    List<TipoTransaccion> findByRequiereCuentaDestino(@Param("requiere") Boolean requiere);
    
    @Query("SELECT CASE WHEN COUNT(tt) > 0 THEN true ELSE false END FROM TipoTransaccion tt WHERE tt.nombre = :nombre")
    boolean existsByNombre(@Param("nombre") String nombre);
}
