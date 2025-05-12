package com.bancoagricola.api.service;

import com.bancoagricola.api.exception.ResourceNotFoundException;
import com.bancoagricola.api.model.Prestamo;
import com.bancoagricola.api.repository.PrestamoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class PrestamoService {
    
    private final PrestamoRepository prestamoRepository;
    
    @Autowired
    public PrestamoService(PrestamoRepository prestamoRepository) {
        this.prestamoRepository = prestamoRepository;
    }
    
    @Transactional(readOnly = true)
    public List<Prestamo> findAll() {
        return prestamoRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Prestamo findById(Integer id) {
        return prestamoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Préstamo", "id", id));
    }
    
    @Transactional(readOnly = true)
    public List<Prestamo> findByClienteId(Integer idCliente) {
        return prestamoRepository.findByClienteIdCliente(idCliente);
    }
    
    @Transactional(readOnly = true)
    public List<Prestamo> findByCajeroId(Integer idCajero) {
        return prestamoRepository.findByCajeroIdEmpleado(idCajero);
    }
    
    @Transactional(readOnly = true)
    public List<Prestamo> findByEstado(String estado) {
        return prestamoRepository.findByEstadoPrestamo(estado);
    }
    
    @Transactional
    public Prestamo save(Prestamo prestamo) {
        // Calcular cuota mensual si no está establecida
        if (prestamo.getCuotaMensual() == null && prestamo.getMontoPrestamo() != null 
                && prestamo.getTasaInteres() != null && prestamo.getPlazoMeses() != null) {
            
            BigDecimal monto = prestamo.getMontoPrestamo();
            BigDecimal tasaMensual = prestamo.getTasaInteres().divide(new BigDecimal("100"), 10, RoundingMode.HALF_UP)
                    .divide(new BigDecimal("12"), 10, RoundingMode.HALF_UP);
            int plazo = prestamo.getPlazoMeses();
            
            // Fórmula de cuota: P * r * (1 + r)^n / ((1 + r)^n - 1)
            BigDecimal numerador = monto.multiply(tasaMensual).multiply(
                    BigDecimal.ONE.add(tasaMensual).pow(plazo));
            BigDecimal denominador = BigDecimal.ONE.add(tasaMensual).pow(plazo).subtract(BigDecimal.ONE);
            
            BigDecimal cuotaMensual = numerador.divide(denominador, 2, RoundingMode.HALF_UP);
            prestamo.setCuotaMensual(cuotaMensual);
        }
        
        // Establecer estado inicial si no está establecido
        if (prestamo.getEstadoPrestamo() == null) {
            prestamo.setEstadoPrestamo("SOLICITADO");
        }
        
        return prestamoRepository.save(prestamo);
    }
    
    @Transactional
    public Prestamo update(Integer id, Prestamo prestamo) {
        if (!prestamoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Préstamo", "id", id);
        }
        prestamo.setIdPrestamo(id);
        return prestamoRepository.save(prestamo);
    }
    
    @Transactional
    public Prestamo cambiarEstado(Integer id, String nuevoEstado) {
        Prestamo prestamo = prestamoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Préstamo", "id", id));
        
        prestamo.setEstadoPrestamo(nuevoEstado);
        return prestamoRepository.save(prestamo);
    }
    
    @Transactional
    public void delete(Integer id) {
        if (!prestamoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Préstamo", "id", id);
        }
        prestamoRepository.deleteById(id);
    }
}
