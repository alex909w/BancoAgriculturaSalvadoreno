package com.bancoagricola.api.service;

import com.bancoagricola.api.model.PrestamoAgricola;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;
import java.util.Calendar;
import java.util.Date;

@Service
public class PrestamoAgricolaService {
    
    private final Map<Long, PrestamoAgricola> prestamos = new HashMap<>();
    private final AtomicLong idCounter = new AtomicLong(1);
    
    public List<PrestamoAgricola> findAll() {
        return new ArrayList<>(prestamos.values());
    }
    
    public PrestamoAgricola findById(Long id) {
        return prestamos.get(id);
    }
    
    public List<PrestamoAgricola> findByClienteId(Long clienteId) {
        List<PrestamoAgricola> prestamosCliente = new ArrayList<>();
        for (PrestamoAgricola prestamo : prestamos.values()) {
            if (prestamo.getClienteId().equals(clienteId)) {
                prestamosCliente.add(prestamo);
            }
        }
        return prestamosCliente;
    }
    
    public PrestamoAgricola save(PrestamoAgricola prestamo) {
        if (prestamo.getId() == null) {
            prestamo.setId(idCounter.getAndIncrement());
            // Generar número de préstamo único
            prestamo.setNumeroPrestamo("PA-" + System.currentTimeMillis());
            
            // Establecer fecha de aprobación como la fecha actual
            prestamo.setFechaAprobacion(new Date());
            
            // Calcular fecha de vencimiento basada en el plazo
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(prestamo.getFechaAprobacion());
            calendar.add(Calendar.MONTH, prestamo.getPlazoMeses());
            prestamo.setFechaVencimiento(calendar.getTime());
            
            // Estado inicial
            prestamo.setEstado("SOLICITADO");
        }
        prestamos.put(prestamo.getId(), prestamo);
        return prestamo;
    }
    
    public boolean delete(Long id) {
        return prestamos.remove(id) != null;
    }
    
    public PrestamoAgricola update(Long id, PrestamoAgricola prestamo) {
        if (!prestamos.containsKey(id)) {
            return null;
        }
        // Preservar el número de préstamo y fechas originales
        PrestamoAgricola original = prestamos.get(id);
        prestamo.setId(id);
        prestamo.setNumeroPrestamo(original.getNumeroPrestamo());
        prestamo.setFechaAprobacion(original.getFechaAprobacion());
        
        // Recalcular fecha de vencimiento si el plazo cambió
        if (!original.getPlazoMeses().equals(prestamo.getPlazoMeses())) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(prestamo.getFechaAprobacion());
            calendar.add(Calendar.MONTH, prestamo.getPlazoMeses());
            prestamo.setFechaVencimiento(calendar.getTime());
        } else {
            prestamo.setFechaVencimiento(original.getFechaVencimiento());
        }
        
        prestamos.put(id, prestamo);
        return prestamo;
    }
    
    public PrestamoAgricola aprobarPrestamo(Long id) {
        PrestamoAgricola prestamo = prestamos.get(id);
        if (prestamo != null && "SOLICITADO".equals(prestamo.getEstado())) {
            prestamo.setEstado("APROBADO");
            prestamo.setFechaAprobacion(new Date());
            
            // Recalcular fecha de vencimiento
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(prestamo.getFechaAprobacion());
            calendar.add(Calendar.MONTH, prestamo.getPlazoMeses());
            prestamo.setFechaVencimiento(calendar.getTime());
            
            prestamos.put(id, prestamo);
        }
        return prestamo;
    }
    
    public PrestamoAgricola rechazarPrestamo(Long id) {
        PrestamoAgricola prestamo = prestamos.get(id);
        if (prestamo != null && "SOLICITADO".equals(prestamo.getEstado())) {
            prestamo.setEstado("RECHAZADO");
            prestamos.put(id, prestamo);
        }
        return prestamo;
    }
}
