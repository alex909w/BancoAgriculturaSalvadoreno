package com.agrobanco.service;

import com.agrobanco.model.Cuenta;
import com.agrobanco.repository.CuentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class CuentaService {
    
    @Autowired
    private CuentaRepository cuentaRepository;
    
    @Transactional(readOnly = true)
    public List<Cuenta> findAll() {
        return cuentaRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Optional<Cuenta> findById(Integer id) {
        return cuentaRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public Optional<Cuenta> findByNumeroCuenta(String numeroCuenta) {
        return cuentaRepository.findByNumeroCuenta(numeroCuenta);
    }
    
    @Transactional(readOnly = true)
    public List<Cuenta> findByClienteId(Integer clienteId) {
        return cuentaRepository.findByClienteId(clienteId);
    }
    
    @Transactional(readOnly = true)
    public List<Cuenta> findBySucursalId(Integer sucursalId) {
        return cuentaRepository.findBySucursalId(sucursalId);
    }
    
    @Transactional(readOnly = true)
    public List<Cuenta> findByEstado(Cuenta.EstadoCuenta estado) {
        return cuentaRepository.findByEstado(estado);
    }
    
    @Transactional(readOnly = true)
    public List<Cuenta> findByClienteIdAndEstado(Integer clienteId, Cuenta.EstadoCuenta estado) {
        return cuentaRepository.findByClienteIdAndEstado(clienteId, estado);
    }
    
    @Transactional
    public Cuenta save(Cuenta cuenta) {
        // Generar número de cuenta si no existe
        if (cuenta.getNumeroCuenta() == null || cuenta.getNumeroCuenta().isEmpty()) {
            cuenta.setNumeroCuenta(generarNumeroCuenta());
        }
        
        // Validar que el número de cuenta no exista
        if (cuentaRepository.existsByNumeroCuenta(cuenta.getNumeroCuenta())) {
            throw new RuntimeException("El número de cuenta ya existe");
        }
        
        return cuentaRepository.save(cuenta);
    }
    
    @Transactional
    public Cuenta update(Integer id, Cuenta cuenta) {
        if (!cuentaRepository.existsById(id)) {
            throw new RuntimeException("Cuenta no encontrada");
        }
        
        cuenta.setId(id);
        return cuentaRepository.save(cuenta);
    }
    
    @Transactional
    public void delete(Integer id) {
        if (!cuentaRepository.existsById(id)) {
            throw new RuntimeException("Cuenta no encontrada");
        }
        cuentaRepository.deleteById(id);
    }
    
    @Transactional
    public Cuenta cambiarEstado(Integer id, Cuenta.EstadoCuenta nuevoEstado) {
        Cuenta cuenta = cuentaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));
        
        cuenta.setEstado(nuevoEstado);
        return cuentaRepository.save(cuenta);
    }
    
    private String generarNumeroCuenta() {
        String numeroCuenta;
        do {
            // Generar número de cuenta de 10 dígitos
            Random random = new Random();
            long numero = 1000000000L + (long)(random.nextDouble() * 9000000000L);
            numeroCuenta = String.valueOf(numero);
        } while (cuentaRepository.existsByNumeroCuenta(numeroCuenta));
        
        return numeroCuenta;
    }
}
