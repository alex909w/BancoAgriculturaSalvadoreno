package com.bancoagricola.api.repository;

import com.bancoagricola.api.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
    
    @Query("SELECT c FROM Cliente c WHERE c.usuario.idUsuario = :idUsuario")
    Optional<Cliente> findByUsuarioIdUsuario(@Param("idUsuario") Integer idUsuario);
    
    @Query("SELECT c FROM Cliente c WHERE c.dui = :dui")
    Optional<Cliente> findByDui(@Param("dui") String dui);
    
    @Query("SELECT c FROM Cliente c WHERE c.nombres LIKE %:nombre% OR c.apellidos LIKE %:nombre%")
    List<Cliente> findByNombresContainingOrApellidosContaining(@Param("nombre") String nombre);
}
