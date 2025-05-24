package com.agrobanco.repository;

import com.agrobanco.model.TipoCuenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TipoCuentaRepository extends JpaRepository<TipoCuenta, Integer> {
    
    @Query("SELECT tc FROM TipoCuenta tc WHERE tc.nombre = :nombre")
    Optional<TipoCuenta> findByNombre(@Param("nombre") String nombre);
    
    @Query("SELECT CASE WHEN COUNT(tc) > 0 THEN true ELSE false END FROM TipoCuenta tc WHERE tc.nombre = :nombre")
    boolean existsByNombre(@Param("nombre") String nombre);
}
