package com.bancoagricola.api.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bancoagricola.api.exception.BadRequestException;
import com.bancoagricola.api.exception.ResourceNotFoundException;
import com.bancoagricola.api.model.Cliente;
import com.bancoagricola.api.model.Dependiente;
import com.bancoagricola.api.model.Empleado;
import com.bancoagricola.api.model.Usuario;
import com.bancoagricola.api.repository.ClienteRepository;
import com.bancoagricola.api.repository.DependienteRepository;
import com.bancoagricola.api.repository.EmpleadoRepository;
import com.bancoagricola.api.repository.UsuarioRepository;

@Service
public class UsuarioService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private ClienteRepository clienteRepository;
    
    @Autowired
    private EmpleadoRepository empleadoRepository;
    
    @Autowired
    private DependienteRepository dependienteRepository;
    
    @Transactional(readOnly = true)
    public Map<String, Object> authenticate(String username, String password) {
        System.out.println("=== INICIANDO AUTENTICACIÓN ===");
        System.out.println("Usuario: " + username);
        
        if (username == null || username.trim().isEmpty()) {
            throw new BadRequestException("El nombre de usuario es requerido");
        }
        
        if (password == null || password.trim().isEmpty()) {
            throw new BadRequestException("La contraseña es requerida");
        }
        
        // 1. Buscar usuario en la tabla usuario
        Usuario usuario = usuarioRepository.findByUsuario(username)
                .orElseThrow(() -> new BadRequestException("Usuario o contraseña incorrectos"));
        
        System.out.println("Usuario encontrado en BD: " + usuario.getIdUsuario());
        
        // 2. Verificar contraseña
        if (!usuario.getPassword().equals(password)) {
            throw new BadRequestException("Usuario o contraseña incorrectos");
        }
        
        System.out.println("Contraseña verificada correctamente");
        
        // 3. Buscar en qué tabla está el perfil del usuario
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Login exitoso");
        response.put("idUsuario", usuario.getIdUsuario());
        response.put("usuario", usuario.getUsuario());
        
        // 4. Determinar tipo de usuario consultando las tablas relacionadas
        String tipoUsuario = determinarTipoUsuarioDesdeDB(usuario.getIdUsuario());
        response.put("tipoUsuario", tipoUsuario);
        
        System.out.println("Tipo de usuario determinado: " + tipoUsuario);
        
        // 5. Agregar información específica y permisos
        agregarInformacionEspecificaDesdeDB(response, usuario.getIdUsuario(), tipoUsuario);
        
        System.out.println("=== AUTENTICACIÓN COMPLETADA ===");
        return response;
    }
    
    private String determinarTipoUsuarioDesdeDB(Integer idUsuario) {
        System.out.println("Determinando tipo de usuario para ID: " + idUsuario);
        
        // Buscar en tabla empleado
        Optional<Empleado> empleado = empleadoRepository.findByUsuarioIdUsuario(idUsuario);
        if (empleado.isPresent()) {
            System.out.println("Usuario encontrado como EMPLEADO");
            return "EMPLEADO";
        }
        
        // Buscar en tabla cliente
        Optional<Cliente> cliente = clienteRepository.findByUsuarioIdUsuario(idUsuario);
        if (cliente.isPresent()) {
            System.out.println("Usuario encontrado como CLIENTE");
            return "CLIENTE";
        }
        
        // Buscar en tabla dependiente
        Optional<Dependiente> dependiente = dependienteRepository.findByUsuarioIdUsuario(idUsuario);
        if (dependiente.isPresent()) {
            System.out.println("Usuario encontrado como DEPENDIENTE");
            return "DEPENDIENTE";
        }
        
        System.out.println("Usuario no encontrado en ninguna tabla específica");
        return "USUARIO"; // Usuario sin rol específico
    }
    
    private void agregarInformacionEspecificaDesdeDB(Map<String, Object> response, Integer idUsuario, String tipoUsuario) {
        System.out.println("Agregando información específica para tipo: " + tipoUsuario);
        
        switch (tipoUsuario) {
            case "EMPLEADO":
                Optional<Empleado> empleadoOpt = empleadoRepository.findByUsuarioIdUsuario(idUsuario);
                if (empleadoOpt.isPresent()) {
                    Empleado empleado = empleadoOpt.get();
                    System.out.println("Datos del empleado: " + empleado.getNombres() + " " + empleado.getApellidos());
                    
                    response.put("empleadoId", empleado.getIdEmpleado());
                    response.put("nombreCompleto", empleado.getNombres() + " " + empleado.getApellidos());
                    response.put("dui", empleado.getDui());
                    response.put("salario", empleado.getSalario());
                    response.put("activo", empleado.getActivo());
                    
                    // Información de sucursal
                    if (empleado.getSucursal() != null) {
                        response.put("sucursalId", empleado.getSucursal().getIdSucursal());
                        response.put("sucursalNombre", empleado.getSucursal().getNombre());
                        response.put("sucursalDireccion", empleado.getSucursal().getDireccion());
                        System.out.println("Sucursal: " + empleado.getSucursal().getNombre());
                    }
                    
                    // Información de rol
                    if (empleado.getRol() != null) {
                        response.put("rolId", empleado.getRol().getIdRol());
                        response.put("rolNombre", empleado.getRol().getNombre());
                        System.out.println("Rol: " + empleado.getRol().getNombre());
                        
                        // Agregar permisos basados en el rol
                        response.put("permisos", obtenerPermisosPorRol(empleado.getRol().getNombre()));
                    }
                }
                break;
                
            case "CLIENTE":
                Optional<Cliente> clienteOpt = clienteRepository.findByUsuarioIdUsuario(idUsuario);
                if (clienteOpt.isPresent()) {
                    Cliente cliente = clienteOpt.get();
                    System.out.println("Datos del cliente: " + cliente.getNombres() + " " + cliente.getApellidos());
                    
                    response.put("clienteId", cliente.getIdCliente());
                    response.put("nombreCompleto", cliente.getNombres() + " " + cliente.getApellidos());
                    response.put("dui", cliente.getDui());
                    response.put("direccion", cliente.getDireccion());
                    response.put("telefono", cliente.getTelefono());
                    response.put("lugarTrabajo", cliente.getLugarTrabajo());
                    response.put("salario", cliente.getSalario());
                    
                    // Agregar permisos de cliente
                    response.put("permisos", obtenerPermisosCliente());
                }
                break;
                
            case "DEPENDIENTE":
                Optional<Dependiente> dependienteOpt = dependienteRepository.findByUsuarioIdUsuario(idUsuario);
                if (dependienteOpt.isPresent()) {
                    Dependiente dependiente = dependienteOpt.get();
                    System.out.println("Datos del dependiente: " + dependiente.getNombreComercio());
                    
                    response.put("dependienteId", dependiente.getIdDependiente());
                    response.put("cui", dependiente.getCui());
                    response.put("nombreComercio", dependiente.getNombreComercio());
                    response.put("comision", dependiente.getComision());
                    
                    // Agregar permisos de dependiente
                    response.put("permisos", obtenerPermisosDependiente());
                }
                break;
        }
    }
    
    private Map<String, Boolean> obtenerPermisosPorRol(String rolNombre) {
        Map<String, Boolean> permisos = new HashMap<>();
        
        switch (rolNombre.toLowerCase()) {
            case "cajero":
                permisos.put("verClientes", true);
                permisos.put("crearCuentas", true);
                permisos.put("procesarTransacciones", true);
                permisos.put("verMovimientos", true);
                permisos.put("aprobarPrestamos", false);
                permisos.put("verReportes", false);
                permisos.put("administrarUsuarios", false);
                break;
                
            case "gerente":
                permisos.put("verClientes", true);
                permisos.put("crearCuentas", true);
                permisos.put("procesarTransacciones", true);
                permisos.put("verMovimientos", true);
                permisos.put("aprobarPrestamos", true);
                permisos.put("verReportes", true);
                permisos.put("administrarUsuarios", true);
                permisos.put("verEstadisticas", true);
                break;
                
            case "asesor":
                permisos.put("verClientes", true);
                permisos.put("crearCuentas", false);
                permisos.put("procesarTransacciones", false);
                permisos.put("verMovimientos", true);
                permisos.put("aprobarPrestamos", false);
                permisos.put("verReportes", true);
                permisos.put("administrarUsuarios", false);
                permisos.put("gestionarPrestamos", true);
                break;
                
            case "admin":
                permisos.put("verClientes", true);
                permisos.put("crearCuentas", true);
                permisos.put("procesarTransacciones", true);
                permisos.put("verMovimientos", true);
                permisos.put("aprobarPrestamos", true);
                permisos.put("verReportes", true);
                permisos.put("administrarUsuarios", true);
                permisos.put("verEstadisticas", true);
                permisos.put("configurarSistema", true);
                break;
                
            default:
                permisos.put("verClientes", false);
                permisos.put("crearCuentas", false);
                permisos.put("procesarTransacciones", false);
                permisos.put("verMovimientos", false);
                permisos.put("aprobarPrestamos", false);
                permisos.put("verReportes", false);
                permisos.put("administrarUsuarios", false);
        }
        
        return permisos;
    }
    
    private Map<String, Boolean> obtenerPermisosCliente() {
        Map<String, Boolean> permisos = new HashMap<>();
        permisos.put("verCuentasPropias", true);
        permisos.put("realizarTransacciones", true);
        permisos.put("solicitarPrestamos", true);
        permisos.put("verHistorialPropio", true);
        permisos.put("actualizarPerfil", true);
        permisos.put("verEstadoCuentas", true);
        return permisos;
    }
    
    private Map<String, Boolean> obtenerPermisosDependiente() {
        Map<String, Boolean> permisos = new HashMap<>();
        permisos.put("procesarPagos", true);
        permisos.put("verComisiones", true);
        permisos.put("verHistorialComercio", true);
        permisos.put("actualizarDatosComercio", true);
        return permisos;
    }
    
    // Resto de métodos existentes...
    @Transactional(readOnly = true)
    public Optional<Usuario> findById(Integer id) {
        try {
            return usuarioRepository.findById(id);
        } catch (Exception e) {
            System.err.println("Error buscando usuario por ID: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @Transactional(readOnly = true)
    public Optional<Usuario> findByUsuario(String username) {
        try {
            return usuarioRepository.findByUsuario(username);
        } catch (Exception e) {
            System.err.println("Error buscando usuario por username: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @Transactional(readOnly = true)
    public boolean existsByUsername(String username) {
        try {
            return usuarioRepository.existsByUsuario(username);
        } catch (Exception e) {
            System.err.println("Error verificando existencia de usuario: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @Transactional
    public void changePassword(Integer id, String currentPassword, String newPassword) {
        Usuario usuario = findById(id).orElse(null);

        if (usuario == null) {
            throw new ResourceNotFoundException("Usuario", "id", id);
        }
        
        if (!usuario.getPassword().equals(currentPassword)) {
            throw new BadRequestException("La contraseña actual es incorrecta");
        }
        
        if (newPassword == null || newPassword.trim().length() < 4) {
            throw new BadRequestException("La nueva contraseña debe tener al menos 4 caracteres");
        }
        
        usuario.setPassword(newPassword);
        usuarioRepository.save(usuario);
    }

    @Transactional(readOnly = true)
    public List<Usuario> findAll() {
        try {
            System.out.println("Obteniendo todos los usuarios...");
            List<Usuario> usuarios = usuarioRepository.findAll();
            System.out.println("Usuarios encontrados: " + usuarios.size());
            return usuarios;
        } catch (Exception e) {
            System.err.println("Error obteniendo todos los usuarios: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Transactional
    public Usuario save(Usuario usuario) {
        if (usuarioRepository.existsByUsuario(usuario.getUsuario())) {
            throw new BadRequestException("El nombre de usuario ya existe");
        }
        return usuarioRepository.save(usuario);
    }

    @Transactional
    public Usuario update(Integer id, Usuario usuario) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuario", "id", id);
        }

        // Verificar si el username ya existe para otro usuario
        Usuario existingUser = usuarioRepository.findByUsuario(usuario.getUsuario()).orElse(null);
        if (existingUser != null && !existingUser.getIdUsuario().equals(id)) {
            throw new BadRequestException("El nombre de usuario ya existe");
        }

        usuario.setIdUsuario(id);
        return usuarioRepository.save(usuario);
    }

    @Transactional
    public void delete(Integer id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuario", "id", id);
        }
        usuarioRepository.deleteById(id);
    }

    public Optional<Usuario> login(String usuario, String password) {
        try {
            System.out.println("Buscando usuario: " + usuario);
            return usuarioRepository.findByUsuarioAndPassword(usuario, password);
        } catch (Exception e) {
            System.err.println("Error en login: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
