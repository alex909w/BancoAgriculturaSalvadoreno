package com.bancoagricola.api.repository;

import com.bancoagricola.api.model.Transaccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransaccionRepository extends JpaRepository<Transaccion, Long> {
    List<Transaccion> findByNumeroCuenta(String numeroCuenta);
}
