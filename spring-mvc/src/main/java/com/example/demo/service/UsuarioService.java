package com.example.demo.service;

import com.example.demo.model.Usuario;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class UsuarioService {
    
    private final Map<Long, Usuario> usuarios = new HashMap<>();
    private final AtomicLong idCounter = new AtomicLong(1);
    
    public List<Usuario> findAll() {
        return new ArrayList<>(usuarios.values());
    }
    
    public Usuario findById(Long id) {
        return usuarios.get(id);
    }
    
    public Usuario save(Usuario usuario) {
        if (usuario.getId() == null) {
            usuario.setId(idCounter.getAndIncrement());
        }
        usuarios.put(usuario.getId(), usuario);
        return usuario;
    }
    
    public boolean delete(Long id) {
        return usuarios.remove(id) != null;
    }
    
    public Usuario update(Long id, Usuario usuario) {
        if (!usuarios.containsKey(id)) {
            return null;
        }
        usuario.setId(id);
        usuarios.put(id, usuario);
        return usuario;
    }
}
