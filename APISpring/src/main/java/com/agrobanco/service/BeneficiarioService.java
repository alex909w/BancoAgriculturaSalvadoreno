package com.agrobanco.service;

import com.agrobanco.model.Beneficiario;
import com.agrobanco.repository.BeneficiarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class BeneficiarioService {
    
    @Autowired
    private BeneficiarioRepository beneficiarioRepository;
    
    @Transactional(readOnly = true)
    public List<Beneficiario> findAll() {
        return beneficiarioRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Optional<Beneficiario> findById(Integer id) {
        return beneficiarioRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public List<Beneficiario> findByCuentaId(Integer cuentaId) {
        return beneficiarioRepository.findByCuentaId(cuentaId);
    }
      @Transactional(readOnly = true)
    public List<Beneficiario> findByDui(String dui) {
        return beneficiarioRepository.findByDui(dui);
    }
    
    @Transactional(readOnly = true)
    public List<Beneficiario> findByNombreContaining(String nombre) {
        return beneficiarioRepository.findByNombreContaining(nombre);
    }
    
    @Transactional
    public Beneficiario save(Beneficiario beneficiario) {
        return beneficiarioRepository.save(beneficiario);
    }
    
    @Transactional
    public void deleteById(Integer id) {
        beneficiarioRepository.deleteById(id);
    }
    
    @Transactional(readOnly = true)
    public boolean existsById(Integer id) {
        return beneficiarioRepository.existsById(id);
    }
    
    @Transactional(readOnly = true)
    public long count() {
        return beneficiarioRepository.count();
    }
}
