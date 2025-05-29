package com.agrobanco.service;

import com.agrobanco.model.TipoTransaccion;
import com.agrobanco.repository.TipoTransaccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TipoTransaccionService {
    
    @Autowired
    private TipoTransaccionRepository tipoTransaccionRepository;
    
    @Transactional(readOnly = true)
    public List<TipoTransaccion> findAll() {
        return tipoTransaccionRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Optional<TipoTransaccion> findById(Integer id) {
        return tipoTransaccionRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public Optional<TipoTransaccion> findByNombre(String nombre) {
        return tipoTransaccionRepository.findByNombre(nombre);
    }
    
    @Transactional(readOnly = true)
    public List<TipoTransaccion> findByRequiereCuentaDestino(Boolean requiere) {
        return tipoTransaccionRepository.findByRequiereCuentaDestino(requiere);
    }
    
    @Transactional
    public TipoTransaccion save(TipoTransaccion tipoTransaccion) {
        if (tipoTransaccionRepository.existsByNombre(tipoTransaccion.getNombre())) {
            throw new RuntimeException("El nombre del tipo de transacción ya existe");
        }
        return tipoTransaccionRepository.save(tipoTransaccion);
    }
    
    @Transactional
    public TipoTransaccion update(Integer id, TipoTransaccion tipoTransaccion) {
        if (!tipoTransaccionRepository.existsById(id)) {
            throw new RuntimeException("Tipo de transacción no encontrado");
        }
        tipoTransaccion.setId(id);
        return tipoTransaccionRepository.save(tipoTransaccion);
    }
    
    @Transactional
    public void delete(Integer id) {
        if (!tipoTransaccionRepository.existsById(id)) {
            throw new RuntimeException("Tipo de transacción no encontrado");
        }
        tipoTransaccionRepository.deleteById(id);
    }
}
