package com.agrobanco.service;

import com.agrobanco.model.TipoCuenta;
import com.agrobanco.repository.TipoCuentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TipoCuentaService {
    
    @Autowired
    private TipoCuentaRepository tipoCuentaRepository;
    
    @Transactional(readOnly = true)
    public List<TipoCuenta> findAll() {
        return tipoCuentaRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Optional<TipoCuenta> findById(Integer id) {
        return tipoCuentaRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public Optional<TipoCuenta> findByNombre(String nombre) {
        return tipoCuentaRepository.findByNombre(nombre);
    }
    
    @Transactional
    public TipoCuenta save(TipoCuenta tipoCuenta) {
        if (tipoCuentaRepository.existsByNombre(tipoCuenta.getNombre())) {
            throw new RuntimeException("El nombre del tipo de cuenta ya existe");
        }
        return tipoCuentaRepository.save(tipoCuenta);
    }
    
    @Transactional
    public TipoCuenta update(Integer id, TipoCuenta tipoCuenta) {
        if (!tipoCuentaRepository.existsById(id)) {
            throw new RuntimeException("Tipo de cuenta no encontrado");
        }
        tipoCuenta.setId(id);
        return tipoCuentaRepository.save(tipoCuenta);
    }
    
    @Transactional
    public void delete(Integer id) {
        if (!tipoCuentaRepository.existsById(id)) {
            throw new RuntimeException("Tipo de cuenta no encontrado");
        }
        tipoCuentaRepository.deleteById(id);
    }
}
