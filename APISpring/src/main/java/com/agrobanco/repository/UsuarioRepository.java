package com.agrobanco.repository;

import com.agrobanco.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    
    @Query("SELECT u FROM Usuario u WHERE u.username = :username")
    Optional<Usuario> findByUsername(@Param("username") String username);
    
    @Query("SELECT u FROM Usuario u WHERE u.email = :email")
    Optional<Usuario> findByEmail(@Param("email") String email);
    
    @Query("SELECT u FROM Usuario u WHERE u.dui = :dui")
    Optional<Usuario> findByDui(@Param("dui") String dui);
    
    @Query("SELECT u FROM Usuario u WHERE u.rol.nombre = :rolNombre")
    List<Usuario> findByRolNombre(@Param("rolNombre") String rolNombre);
    
    @Query("SELECT u FROM Usuario u WHERE u.sucursal.id = :sucursalId")
    List<Usuario> findBySucursalId(@Param("sucursalId") Integer sucursalId);
    
    @Query("SELECT u FROM Usuario u WHERE u.estado = :estado")
    List<Usuario> findByEstado(@Param("estado") Usuario.EstadoUsuario estado);
    
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM Usuario u WHERE u.username = :username")
    boolean existsByUsername(@Param("username") String username);
    
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM Usuario u WHERE u.email = :email")
    boolean existsByEmail(@Param("email") String email);
    
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM Usuario u WHERE u.dui = :dui")
    boolean existsByDui(@Param("dui") String dui);
}
