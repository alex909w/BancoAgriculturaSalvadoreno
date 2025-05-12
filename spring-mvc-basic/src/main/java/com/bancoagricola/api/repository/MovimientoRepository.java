package com.bancoagricola.api.repository;

import com.bancoagricola.api.model.Movimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface MovimientoRepository extends JpaRepository<Movimiento, Integer> {
    List<Movimiento> findByCuentaIdCuenta(Integer idCuenta);
    List<Movimiento> findByFechaHoraBetween(Date fechaInicio, Date fechaFin);
    List<Movimiento> findByTipoMovimiento(String tipoMovimiento);
}
