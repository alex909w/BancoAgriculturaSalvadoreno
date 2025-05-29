package com.bancoagricola.api.repository;

import com.bancoagricola.api.model.Dependiente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DependienteRepository extends JpaRepository<Dependiente, Integer> {
    
    @Query("SELECT d FROM Dependiente d WHERE d.usuario.idUsuario = :idUsuario")
    Optional<Dependiente> findByUsuarioIdUsuario(@Param("idUsuario") Integer idUsuario);
    
    @Query("SELECT d FROM Dependiente d WHERE d.cui = :cui")
    Optional<Dependiente> findByCui(@Param("cui") String cui);
    
    @Query("SELECT d FROM Dependiente d WHERE d.nombreComercio LIKE %:nombre%")
    List<Dependiente> findByNombreComercioContaining(@Param("nombre") String nombre);
}
