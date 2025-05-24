package com.agrobanco.service;

import com.agrobanco.model.Rol;
import com.agrobanco.repository.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class RolService {
    
    @Autowired
    private RolRepository rolRepository;
    
    @Transactional(readOnly = true)
    public List<Rol> findAll() {
        return rolRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Optional<Rol> findById(Integer id) {
        return rolRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public Optional<Rol> findByNombre(String nombre) {
        return rolRepository.findByNombre(nombre);
    }
    
    @Transactional
    public Rol save(Rol rol) {
        if (rolRepository.existsByNombre(rol.getNombre())) {
            throw new RuntimeException("El nombre del rol ya existe");
        }
        return rolRepository.save(rol);
    }
    
    @Transactional
    public Rol update(Integer id, Rol rol) {
        if (!rolRepository.existsById(id)) {
            throw new RuntimeException("Rol no encontrado");
        }
        
        // Verificar que el nombre no exista para otro rol
        Optional<Rol> existingByNombre = rolRepository.findByNombre(rol.getNombre());
        if (existingByNombre.isPresent() && !existingByNombre.get().getId().equals(id)) {
            throw new RuntimeException("El nombre del rol ya existe");
        }
        
        rol.setId(id);
        return rolRepository.save(rol);
    }
    
    @Transactional
    public void delete(Integer id) {
        if (!rolRepository.existsById(id)) {
            throw new RuntimeException("Rol no encontrado");
        }
        rolRepository.deleteById(id);
    }
}
