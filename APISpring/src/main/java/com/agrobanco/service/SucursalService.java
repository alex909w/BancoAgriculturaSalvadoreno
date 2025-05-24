package com.agrobanco.service;

import com.agrobanco.model.Sucursal;
import com.agrobanco.repository.SucursalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class SucursalService {
    
    @Autowired
    private SucursalRepository sucursalRepository;
    
    @Transactional(readOnly = true)
    public List<Sucursal> findAll() {
        return sucursalRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Optional<Sucursal> findById(Integer id) {
        return sucursalRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public Optional<Sucursal> findByCodigo(String codigo) {
        return sucursalRepository.findByCodigo(codigo);
    }
    
    @Transactional(readOnly = true)
    public List<Sucursal> findByEstado(Sucursal.EstadoSucursal estado) {
        return sucursalRepository.findByEstado(estado);
    }
    
    @Transactional(readOnly = true)
    public List<Sucursal> findByTipo(Sucursal.TipoSucursal tipo) {
        return sucursalRepository.findByTipo(tipo);
    }
    
    @Transactional(readOnly = true)
    public List<Sucursal> findByDepartamento(String departamento) {
        return sucursalRepository.findByDepartamento(departamento);
    }
    
    @Transactional
    public Sucursal save(Sucursal sucursal) {
        return sucursalRepository.save(sucursal);
    }
    
    @Transactional
    public Sucursal update(Integer id, Sucursal sucursal) {
        if (!sucursalRepository.existsById(id)) {
            throw new RuntimeException("Sucursal no encontrada");
        }
        sucursal.setId(id);
        return sucursalRepository.save(sucursal);
    }
    
    @Transactional
    public void delete(Integer id) {
        if (!sucursalRepository.existsById(id)) {
            throw new RuntimeException("Sucursal no encontrada");
        }
        sucursalRepository.deleteById(id);
    }
}
