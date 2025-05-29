package com.agrobanco.repository;

import com.agrobanco.model.Sucursal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SucursalRepository extends JpaRepository<Sucursal, Integer> {
    
    @Query("SELECT s FROM Sucursal s WHERE s.codigo = :codigo")
    Optional<Sucursal> findByCodigo(@Param("codigo") String codigo);
    
    @Query("SELECT s FROM Sucursal s WHERE s.estado = :estado")
    List<Sucursal> findByEstado(@Param("estado") Sucursal.EstadoSucursal estado);
    
    @Query("SELECT s FROM Sucursal s WHERE s.tipo = :tipo")
    List<Sucursal> findByTipo(@Param("tipo") Sucursal.TipoSucursal tipo);
    
    @Query("SELECT s FROM Sucursal s WHERE s.departamento = :departamento")
    List<Sucursal> findByDepartamento(@Param("departamento") String departamento);
    
    @Query("SELECT s FROM Sucursal s WHERE s.municipio = :municipio")
    List<Sucursal> findByMunicipio(@Param("municipio") String municipio);
}
