package com.agrobanco.service;

import com.agrobanco.model.Usuario;
import com.agrobanco.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Transactional
    public Map<String, Object> authenticate(String username, String password) {
        System.out.println("=== INICIANDO AUTENTICACIÓN ===");
        System.out.println("Usuario: " + username);
        
        if (username == null || username.trim().isEmpty()) {
            throw new RuntimeException("El nombre de usuario es requerido");
        }
        
        if (password == null || password.trim().isEmpty()) {
            throw new RuntimeException("La contraseña es requerida");
        }
        
        // Buscar usuario por username o email
        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsername(username);
        if (!usuarioOpt.isPresent()) {
            usuarioOpt = usuarioRepository.findByEmail(username);
        }
        
        if (!usuarioOpt.isPresent()) {
            throw new RuntimeException("Usuario o contraseña incorrectos");
        }
        
        Usuario usuario = usuarioOpt.get();
        System.out.println("Usuario encontrado: " + usuario.getNombreCompleto());
        
        // Verificar contraseña (en producción usar BCrypt)
        if (!usuario.getPasswordHash().equals(password)) {
            throw new RuntimeException("Usuario o contraseña incorrectos");
        }
        
        // Verificar estado del usuario
        if (usuario.getEstado() != Usuario.EstadoUsuario.activo) {
            throw new RuntimeException("Usuario inactivo o suspendido");
        }
        
        // Actualizar último login
        usuario.setUltimoLogin(LocalDateTime.now());
        usuarioRepository.save(usuario);
        
        // Preparar respuesta
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Login exitoso");
        response.put("usuario", prepararDatosUsuario(usuario));
        
        System.out.println("=== AUTENTICACIÓN EXITOSA ===");
        return response;
    }
    
    private Map<String, Object> prepararDatosUsuario(Usuario usuario) {
        Map<String, Object> datosUsuario = new HashMap<>();
        
        // Datos básicos
        datosUsuario.put("id", usuario.getId());
        datosUsuario.put("username", usuario.getUsername());
        datosUsuario.put("email", usuario.getEmail());
        datosUsuario.put("nombreCompleto", usuario.getNombreCompleto());
        datosUsuario.put("dui", usuario.getDui());
        datosUsuario.put("telefono", usuario.getTelefono());
        datosUsuario.put("direccion", usuario.getDireccion());
        datosUsuario.put("fechaNacimiento", usuario.getFechaNacimiento());
        datosUsuario.put("genero", usuario.getGenero());
        datosUsuario.put("profesion", usuario.getProfesion());
        datosUsuario.put("salario", usuario.getSalario());
        datosUsuario.put("estado", usuario.getEstado());
        datosUsuario.put("ultimoLogin", usuario.getUltimoLogin());
        
        // Datos del rol
        if (usuario.getRol() != null) {
            Map<String, Object> rol = new HashMap<>();
            rol.put("id", usuario.getRol().getId());
            rol.put("nombre", usuario.getRol().getNombre());
            rol.put("descripcion", usuario.getRol().getDescripcion());
            datosUsuario.put("rol", rol);
            datosUsuario.put("tipoUsuario", usuario.getRol().getNombre().toUpperCase());
        }
        
        // Datos de la sucursal
        if (usuario.getSucursal() != null) {
            Map<String, Object> sucursal = new HashMap<>();
            sucursal.put("id", usuario.getSucursal().getId());
            sucursal.put("nombre", usuario.getSucursal().getNombre());
            sucursal.put("codigo", usuario.getSucursal().getCodigo());
            sucursal.put("departamento", usuario.getSucursal().getDepartamento());
            sucursal.put("municipio", usuario.getSucursal().getMunicipio());
            sucursal.put("direccion", usuario.getSucursal().getDireccion());
            sucursal.put("tipo", usuario.getSucursal().getTipo());
            datosUsuario.put("sucursal", sucursal);
        }
        
        // Permisos basados en el rol
        datosUsuario.put("permisos", obtenerPermisosPorRol(usuario.getRol().getNombre()));
        
        return datosUsuario;
    }
    
    private Map<String, Boolean> obtenerPermisosPorRol(String rolNombre) {
        Map<String, Boolean> permisos = new HashMap<>();
        
        switch (rolNombre.toLowerCase()) {
            case "admin":
                permisos.put("gestionarUsuarios", true);
                permisos.put("gestionarSucursales", true);
                permisos.put("verReportes", true);
                permisos.put("configurarSistema", true);
                permisos.put("gestionarCuentas", true);
                permisos.put("procesarTransacciones", true);
                permisos.put("aprobarPrestamos", true);
                break;
                
            case "gerente":
                permisos.put("gestionarUsuarios", false);
                permisos.put("gestionarSucursales", false);
                permisos.put("verReportes", true);
                permisos.put("configurarSistema", false);
                permisos.put("gestionarCuentas", true);
                permisos.put("procesarTransacciones", true);
                permisos.put("aprobarPrestamos", true);
                permisos.put("supervisarCajeros", true);
                break;
                
            case "cajero":
                permisos.put("gestionarUsuarios", false);
                permisos.put("gestionarSucursales", false);
                permisos.put("verReportes", false);
                permisos.put("configurarSistema", false);
                permisos.put("gestionarCuentas", true);
                permisos.put("procesarTransacciones", true);
                permisos.put("aprobarPrestamos", false);
                permisos.put("atenderClientes", true);
                break;
                
            case "cliente":
                permisos.put("verCuentasPropias", true);
                permisos.put("realizarTransferencias", true);
                permisos.put("solicitarPrestamos", true);
                permisos.put("verHistorial", true);
                permisos.put("actualizarPerfil", true);
                break;
                
            default:
                // Sin permisos por defecto
                break;
        }
        
        return permisos;
    }
}
