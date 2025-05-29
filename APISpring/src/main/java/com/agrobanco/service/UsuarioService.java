package com.agrobanco.service;

import com.agrobanco.model.Usuario;
import com.agrobanco.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Transactional(readOnly = true)
    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Optional<Usuario> findById(Integer id) {
        return usuarioRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public Optional<Usuario> findByUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }
    
    @Transactional(readOnly = true)
    public Optional<Usuario> findByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }
    
    @Transactional(readOnly = true)
    public Optional<Usuario> findByDui(String dui) {
        return usuarioRepository.findByDui(dui);
    }
    
    @Transactional(readOnly = true)
    public List<Usuario> findByRolNombre(String rolNombre) {
        return usuarioRepository.findByRolNombre(rolNombre);
    }
    
    @Transactional(readOnly = true)
    public List<Usuario> findBySucursalId(Integer sucursalId) {
        return usuarioRepository.findBySucursalId(sucursalId);
    }
    
    @Transactional(readOnly = true)
    public List<Usuario> findByEstado(Usuario.EstadoUsuario estado) {
        return usuarioRepository.findByEstado(estado);
    }
    
    @Transactional
    public Usuario save(Usuario usuario) {
        // Validaciones
        if (usuarioRepository.existsByUsername(usuario.getUsername())) {
            throw new RuntimeException("El username ya existe");
        }
        
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("El email ya existe");
        }
        
        if (usuario.getDui() != null && usuarioRepository.existsByDui(usuario.getDui())) {
            throw new RuntimeException("El DUI ya existe");
        }
        
        return usuarioRepository.save(usuario);
    }
    
    @Transactional
    public Usuario update(Integer id, Usuario usuario) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado");
        }
        
        // Verificar que username no exista para otro usuario
        Optional<Usuario> existingByUsername = usuarioRepository.findByUsername(usuario.getUsername());
        if (existingByUsername.isPresent() && !existingByUsername.get().getId().equals(id)) {
            throw new RuntimeException("El username ya existe");
        }
        
        // Verificar que email no exista para otro usuario
        Optional<Usuario> existingByEmail = usuarioRepository.findByEmail(usuario.getEmail());
        if (existingByEmail.isPresent() && !existingByEmail.get().getId().equals(id)) {
            throw new RuntimeException("El email ya existe");
        }
        
        usuario.setId(id);
        return usuarioRepository.save(usuario);
    }
    
    @Transactional
    public void delete(Integer id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado");
        }
        usuarioRepository.deleteById(id);
    }
    
    @Transactional
    public Usuario cambiarEstado(Integer id, Usuario.EstadoUsuario nuevoEstado) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        usuario.setEstado(nuevoEstado);
        return usuarioRepository.save(usuario);
    }
}
