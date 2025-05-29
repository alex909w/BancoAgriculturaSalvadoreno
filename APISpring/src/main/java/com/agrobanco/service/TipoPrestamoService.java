package com.agrobanco.service;

import com.agrobanco.model.TipoPrestamo;
import com.agrobanco.repository.TipoPrestamoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TipoPrestamoService {
    
    @Autowired
    private TipoPrestamoRepository tipoPrestamoRepository;
    
    @Transactional(readOnly = true)
    public List<TipoPrestamo> findAll() {
        return tipoPrestamoRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Optional<TipoPrestamo> findById(Integer id) {
        return tipoPrestamoRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public Optional<TipoPrestamo> findByNombre(String nombre) {
        return tipoPrestamoRepository.findByNombre(nombre);
    }
    
    @Transactional(readOnly = true)
    public List<TipoPrestamo> findByRequiereGarantia(Boolean requiere) {
        return tipoPrestamoRepository.findByRequiereGarantia(requiere);
    }
    
    @Transactional
    public TipoPrestamo save(TipoPrestamo tipoPrestamo) {
        if (tipoPrestamoRepository.existsByNombre(tipoPrestamo.getNombre())) {
            throw new RuntimeException("El nombre del tipo de préstamo ya existe");
        }
        return tipoPrestamoRepository.save(tipoPrestamo);
    }
    
    @Transactional
    public TipoPrestamo update(Integer id, TipoPrestamo tipoPrestamo) {
        if (!tipoPrestamoRepository.existsById(id)) {
            throw new RuntimeException("Tipo de préstamo no encontrado");
        }
        tipoPrestamo.setId(id);
        return tipoPrestamoRepository.save(tipoPrestamo);
    }
    
    @Transactional
    public void delete(Integer id) {
        if (!tipoPrestamoRepository.existsById(id)) {
            throw new RuntimeException("Tipo de préstamo no encontrado");
        }
        tipoPrestamoRepository.deleteById(id);
    }
}
