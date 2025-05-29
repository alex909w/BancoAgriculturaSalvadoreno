package com.bancoagricola.api.repository;

import com.bancoagricola.api.model.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmpleadoRepository extends JpaRepository<Empleado, Integer> {
    
    @Query("SELECT e FROM Empleado e LEFT JOIN FETCH e.sucursal LEFT JOIN FETCH e.rol WHERE e.usuario.idUsuario = :idUsuario")
    Optional<Empleado> findByUsuarioIdUsuario(@Param("idUsuario") Integer idUsuario);
    
    @Query("SELECT e FROM Empleado e WHERE e.dui = :dui")
    Optional<Empleado> findByDui(@Param("dui") String dui);
    
    @Query("SELECT e FROM Empleado e WHERE e.activo = 'S'")
    List<Empleado> findByActivoTrue();
    
    @Query("SELECT e FROM Empleado e WHERE e.sucursal.idSucursal = :idSucursal")
    List<Empleado> findBySucursalId(@Param("idSucursal") Integer idSucursal);
}
