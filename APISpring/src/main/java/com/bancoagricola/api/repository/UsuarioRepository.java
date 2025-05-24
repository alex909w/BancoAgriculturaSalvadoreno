package com.bancoagricola.api.repository;

import com.bancoagricola.api.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    
    @Query("SELECT u FROM Usuario u WHERE u.usuario = :usuario")
    Optional<Usuario> findByUsuario(@Param("usuario") String usuario);
    
    @Query("SELECT u FROM Usuario u WHERE u.usuario = :usuario AND u.password = :password")
    Optional<Usuario> findByUsuarioAndPassword(@Param("usuario") String usuario, @Param("password") String password);
    
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM Usuario u WHERE u.usuario = :usuario")
    boolean existsByUsuario(@Param("usuario") String usuario);
}
