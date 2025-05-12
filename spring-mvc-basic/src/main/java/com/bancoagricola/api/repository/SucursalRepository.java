package com.bancoagricola.api.repository;

import com.bancoagricola.api.model.Sucursal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SucursalRepository extends JpaRepository<Sucursal, Integer> {
    Optional<Sucursal> findByNombre(String nombre);
}
