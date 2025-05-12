package com.bancoagricola.api.repository;

import com.bancoagricola.api.model.Prestamo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrestamoRepository extends JpaRepository<Prestamo, Integer> {
    List<Prestamo> findByClienteIdCliente(Integer idCliente);
    List<Prestamo> findByCajeroIdEmpleado(Integer idEmpleado);
    List<Prestamo> findByEstadoPrestamo(String estadoPrestamo);
}
