package com.bancoagricola.api.repository;

import com.bancoagricola.api.model.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmpleadoRepository extends JpaRepository<Empleado, Integer> {
    Optional<Empleado> findByDui(String dui);
    List<Empleado> findByActivo(String activo);
    List<Empleado> findBySucursalIdSucursal(Integer idSucursal);
    List<Empleado> findByRolIdRol(Integer idRol);
}
