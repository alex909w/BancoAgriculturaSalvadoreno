package com.agrobanco.service;

import com.agrobanco.model.Prestamo;
import com.agrobanco.repository.PrestamoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class PrestamoService {
    
    @Autowired
    private PrestamoRepository prestamoRepository;
    
    @Transactional(readOnly = true)
    public List<Prestamo> findAll() {
        return prestamoRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Optional<Prestamo> findById(Integer id) {
        return prestamoRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public Optional<Prestamo> findByNumeroPrestamo(String numeroPrestamo) {
        return prestamoRepository.findByNumeroPrestamo(numeroPrestamo);
    }
    
    @Transactional(readOnly = true)
    public List<Prestamo> findByClienteId(Integer clienteId) {
        return prestamoRepository.findByClienteId(clienteId);
    }
    
    @Transactional(readOnly = true)
    public List<Prestamo> findByEstado(Prestamo.EstadoPrestamo estado) {
        return prestamoRepository.findByEstado(estado);
    }
    
    @Transactional
    public Prestamo save(Prestamo prestamo) {
        // Generar número de préstamo si no existe
        if (prestamo.getNumeroPrestamo() == null || prestamo.getNumeroPrestamo().isEmpty()) {
            prestamo.setNumeroPrestamo(generarNumeroPrestamo());
        }
        
        // Validar que el número de préstamo no exista
        if (prestamoRepository.existsByNumeroPrestamo(prestamo.getNumeroPrestamo())) {
            throw new RuntimeException("El número de préstamo ya existe");
        }
        
        // Calcular cuota mensual si no está establecida
        if (prestamo.getCuotaMensual() == null) {
            prestamo.setCuotaMensual(calcularCuotaMensual(
                prestamo.getMontoSolicitado(),
                prestamo.getTasaInteres(),
                prestamo.getPlazoMeses()
            ));
        }
        
        // Establecer saldo pendiente inicial
        if (prestamo.getSaldoPendiente() == null) {
            prestamo.setSaldoPendiente(prestamo.getMontoSolicitado());
        }
        
        return prestamoRepository.save(prestamo);
    }
    
    @Transactional
    public Prestamo update(Integer id, Prestamo prestamo) {
        if (!prestamoRepository.existsById(id)) {
            throw new RuntimeException("Préstamo no encontrado");
        }
        
        prestamo.setId(id);
        return prestamoRepository.save(prestamo);
    }
    
    @Transactional
    public Prestamo aprobarPrestamo(Integer id, BigDecimal montoAprobado, Integer gerenteId) {
        Prestamo prestamo = prestamoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));
        
        if (prestamo.getEstado() != Prestamo.EstadoPrestamo.solicitado) {
            throw new RuntimeException("El préstamo no está en estado solicitado");
        }
        
        prestamo.setMontoAprobado(montoAprobado);
        prestamo.setEstado(Prestamo.EstadoPrestamo.aprobado);
        prestamo.setFechaAprobacion(LocalDate.now());
        prestamo.setSaldoPendiente(montoAprobado);
        
        // Recalcular cuota mensual con el monto aprobado
        prestamo.setCuotaMensual(calcularCuotaMensual(
            montoAprobado,
            prestamo.getTasaInteres(),
            prestamo.getPlazoMeses()
        ));
        
        return prestamoRepository.save(prestamo);
    }
    
    @Transactional
    public Prestamo rechazarPrestamo(Integer id, String observaciones) {
        Prestamo prestamo = prestamoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));
        
        if (prestamo.getEstado() != Prestamo.EstadoPrestamo.solicitado) {
            throw new RuntimeException("El préstamo no está en estado solicitado");
        }
        
        prestamo.setEstado(Prestamo.EstadoPrestamo.rechazado);
        prestamo.setObservaciones(observaciones);
        
        return prestamoRepository.save(prestamo);
    }
    
    @Transactional
    public Prestamo desembolsarPrestamo(Integer id, Integer cajeroId) {
        Prestamo prestamo = prestamoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));
        
        if (prestamo.getEstado() != Prestamo.EstadoPrestamo.aprobado) {
            throw new RuntimeException("El préstamo no está aprobado");
        }
        
        prestamo.setEstado(Prestamo.EstadoPrestamo.desembolsado);
        prestamo.setFechaDesembolso(LocalDate.now());
        prestamo.setFechaVencimiento(LocalDate.now().plusMonths(prestamo.getPlazoMeses()));
        
        return prestamoRepository.save(prestamo);
    }
    
    private BigDecimal calcularCuotaMensual(BigDecimal monto, BigDecimal tasaAnual, Integer plazoMeses) {
        // Convertir tasa anual a mensual
        BigDecimal tasaMensual = tasaAnual.divide(BigDecimal.valueOf(12), 6, RoundingMode.HALF_UP)
                                         .divide(BigDecimal.valueOf(100), 6, RoundingMode.HALF_UP);
        
        // Fórmula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
        // Donde: M = cuota mensual, P = principal, r = tasa mensual, n = número de pagos
        
        BigDecimal unoPlusTasa = BigDecimal.ONE.add(tasaMensual);
        BigDecimal unoPlusTasaPotencia = unoPlusTasa.pow(plazoMeses);
        
        BigDecimal numerador = monto.multiply(tasaMensual).multiply(unoPlusTasaPotencia);
        BigDecimal denominador = unoPlusTasaPotencia.subtract(BigDecimal.ONE);
        
        return numerador.divide(denominador, 2, RoundingMode.HALF_UP);
    }
    
    private String generarNumeroPrestamo() {
        String numeroPrestamo;
        do {
            // Generar número de préstamo: PRE + año + mes + random
            LocalDate now = LocalDate.now();
            Random random = new Random();
            int randomNum = random.nextInt(99999);
            numeroPrestamo = String.format("PRE%d%02d%05d", now.getYear(), now.getMonthValue(), randomNum);
        } while (prestamoRepository.existsByNumeroPrestamo(numeroPrestamo));
        
        return numeroPrestamo;
    }
}
