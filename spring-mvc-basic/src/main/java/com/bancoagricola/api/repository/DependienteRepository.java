package com.bancoagricola.api.repository;

import com.bancoagricola.api.model.Dependiente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DependienteRepository extends JpaRepository<Dependiente, Integer> {
    Optional<Dependiente> findByDui(String dui);
    Optional<Dependiente> findByNombreComercio(String nombreComercio);
}
