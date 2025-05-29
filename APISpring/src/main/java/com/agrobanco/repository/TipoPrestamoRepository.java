package com.agrobanco.repository;

import com.agrobanco.model.TipoPrestamo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TipoPrestamoRepository extends JpaRepository<TipoPrestamo, Integer> {
    
    @Query("SELECT tp FROM TipoPrestamo tp WHERE tp.nombre = :nombre")
    Optional<TipoPrestamo> findByNombre(@Param("nombre") String nombre);
    
    @Query("SELECT tp FROM TipoPrestamo tp WHERE tp.requiereGarantia = :requiere")
    List<TipoPrestamo> findByRequiereGarantia(@Param("requiere") Boolean requiere);
    
    @Query("SELECT CASE WHEN COUNT(tp) > 0 THEN true ELSE false END FROM TipoPrestamo tp WHERE tp.nombre = :nombre")
    boolean existsByNombre(@Param("nombre") String nombre);
}
