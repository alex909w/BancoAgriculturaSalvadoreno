package com.bancoagricola.api.service;

import com.bancoagricola.api.exception.ResourceNotFoundException;
import com.bancoagricola.api.model.Cuenta;
import com.bancoagricola.api.repository.CuentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CuentaService {
    
    private final CuentaRepository cuentaRepository;
    
    @Autowired
    public CuentaService(CuentaRepository cuentaRepository) {
        this.cuentaRepository = cuentaRepository;
    }
    
    @Transactional(readOnly = true)
    public List<Cuenta> findAll() {
        return cuentaRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Cuenta findById(Integer id) {
        return cuentaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta", "id", id));
    }
    
    @Transactional(readOnly = true)
    public Cuenta findByNumeroCuenta(String numeroCuenta) {
        return cuentaRepository.findByNumeroCuenta(numeroCuenta)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta", "numeroCuenta", numeroCuenta));
    }
    
    @Transactional(readOnly = true)
    public List<Cuenta> findByClienteId(Integer idCliente) {
        return cuentaRepository.findByClienteIdCliente(idCliente);
    }
    
    @Transactional
    public Cuenta save(Cuenta cuenta) {
        if (cuenta.getSaldo() == null) {
            cuenta.setSaldo(BigDecimal.ZERO);
        }
        return cuentaRepository.save(cuenta);
    }
    
    @Transactional
    public Cuenta update(Integer id, Cuenta cuenta) {
        if (!cuentaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cuenta", "id", id);
        }
        cuenta.setIdCuenta(id);
        return cuentaRepository.save(cuenta);
    }
    
    @Transactional
    public void delete(Integer id) {
        if (!cuentaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cuenta", "id", id);
        }
        cuentaRepository.deleteById(id);
    }
}
