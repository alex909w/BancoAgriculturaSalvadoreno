package com.agrobanco.repository;

import com.agrobanco.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RolRepository extends JpaRepository<Rol, Integer> {
    
    @Query("SELECT r FROM Rol r WHERE r.nombre = :nombre")
    Optional<Rol> findByNombre(@Param("nombre") String nombre);
    
    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM Rol r WHERE r.nombre = :nombre")
    boolean existsByNombre(@Param("nombre") String nombre);
}
