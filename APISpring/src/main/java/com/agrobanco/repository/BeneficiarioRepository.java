package com.agrobanco.repository;

import com.agrobanco.model.Beneficiario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface BeneficiarioRepository extends JpaRepository<Beneficiario, Integer> {
      @Query("SELECT b FROM Beneficiario b WHERE b.cuenta.id = :cuentaId")
    List<Beneficiario> findByCuentaId(@Param("cuentaId") Integer cuentaId);
    
    @Query("SELECT b FROM Beneficiario b WHERE b.dui = :dui")
    List<Beneficiario> findByDui(@Param("dui") String dui);
    
    @Query("SELECT b FROM Beneficiario b WHERE LOWER(b.nombreCompleto) LIKE LOWER(CONCAT('%', :nombre, '%'))")
    List<Beneficiario> findByNombreContaining(@Param("nombre") String nombre);
    
    @Query("SELECT b FROM Beneficiario b WHERE b.cuenta.id = :cuentaId AND b.dui = :dui")
    Optional<Beneficiario> findByCuentaIdAndDui(@Param("cuentaId") Integer cuentaId, @Param("dui") String dui);
    
    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM Beneficiario b WHERE b.cuenta.id = :cuentaId AND b.dui = :dui")
    boolean existsByCuentaIdAndDui(@Param("cuentaId") Integer cuentaId, @Param("dui") String dui);
    
    @Query("SELECT SUM(b.porcentaje) FROM Beneficiario b WHERE b.cuenta.id = :cuentaId")
    BigDecimal sumPorcentajeByCuentaId(@Param("cuentaId") Integer cuentaId);
}
