package com.agrobanco.repository;

import com.agrobanco.model.Cuenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CuentaRepository extends JpaRepository<Cuenta, Integer> {
    
    @Query("SELECT c FROM Cuenta c WHERE c.numeroCuenta = :numeroCuenta")
    Optional<Cuenta> findByNumeroCuenta(@Param("numeroCuenta") String numeroCuenta);
    
    @Query("SELECT c FROM Cuenta c WHERE c.cliente.id = :clienteId")
    List<Cuenta> findByClienteId(@Param("clienteId") Integer clienteId);
    
    @Query("SELECT c FROM Cuenta c WHERE c.sucursal.id = :sucursalId")
    List<Cuenta> findBySucursalId(@Param("sucursalId") Integer sucursalId);
    
    @Query("SELECT c FROM Cuenta c WHERE c.tipoCuenta.id = :tipoCuentaId")
    List<Cuenta> findByTipoCuentaId(@Param("tipoCuentaId") Integer tipoCuentaId);
    
    @Query("SELECT c FROM Cuenta c WHERE c.estado = :estado")
    List<Cuenta> findByEstado(@Param("estado") Cuenta.EstadoCuenta estado);
    
    @Query("SELECT c FROM Cuenta c WHERE c.cliente.id = :clienteId AND c.estado = :estado")
    List<Cuenta> findByClienteIdAndEstado(@Param("clienteId") Integer clienteId, @Param("estado") Cuenta.EstadoCuenta estado);
    
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Cuenta c WHERE c.numeroCuenta = :numeroCuenta")
    boolean existsByNumeroCuenta(@Param("numeroCuenta") String numeroCuenta);
}
