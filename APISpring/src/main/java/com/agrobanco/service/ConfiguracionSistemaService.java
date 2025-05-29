package com.agrobanco.service;

import com.agrobanco.model.ConfiguracionSistema;
import com.agrobanco.repository.ConfiguracionSistemaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ConfiguracionSistemaService {
    
    @Autowired
    private ConfiguracionSistemaRepository configuracionSistemaRepository;
    
    @Transactional(readOnly = true)
    public List<ConfiguracionSistema> findAll() {
        return configuracionSistemaRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Optional<ConfiguracionSistema> findById(Integer id) {
        return configuracionSistemaRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public Optional<ConfiguracionSistema> findByClave(String clave) {
        return configuracionSistemaRepository.findByClave(clave);
    }
    
    @Transactional(readOnly = true)
    public List<ConfiguracionSistema> findByTipo(ConfiguracionSistema.TipoConfiguracion tipo) {
        return configuracionSistemaRepository.findByTipo(tipo);
    }
    
    @Transactional(readOnly = true)
    public String getValorByClave(String clave) {
        Optional<ConfiguracionSistema> config = configuracionSistemaRepository.findByClave(clave);
        return config.map(ConfiguracionSistema::getValor).orElse(null);
    }
    
    @Transactional
    public ConfiguracionSistema save(ConfiguracionSistema configuracion) {
        return configuracionSistemaRepository.save(configuracion);
    }
    
    @Transactional
    public ConfiguracionSistema updateValor(String clave, String nuevoValor) {
        Optional<ConfiguracionSistema> configOpt = configuracionSistemaRepository.findByClave(clave);
        if (configOpt.isPresent()) {
            ConfiguracionSistema config = configOpt.get();
            config.setValor(nuevoValor);
            return configuracionSistemaRepository.save(config);
        }
        throw new RuntimeException("Configuración no encontrada con clave: " + clave);
    }
    
    @Transactional
    public void deleteById(Integer id) {
        configuracionSistemaRepository.deleteById(id);
    }
    
    @Transactional
    public void deleteByClave(String clave) {
        configuracionSistemaRepository.deleteByClave(clave);
    }
    
    @Transactional(readOnly = true)
    public boolean existsById(Integer id) {
        return configuracionSistemaRepository.existsById(id);
    }
    
    @Transactional(readOnly = true)
    public boolean existsByClave(String clave) {
        return configuracionSistemaRepository.existsByClave(clave);
    }
    
    @Transactional(readOnly = true)
    public long count() {
        return configuracionSistemaRepository.count();
    }
    
    // Métodos adicionales requeridos por el controlador
    
    @Transactional
    public ConfiguracionSistema update(Integer id, ConfiguracionSistema configuracion) {
        Optional<ConfiguracionSistema> configOpt = configuracionSistemaRepository.findById(id);
        if (configOpt.isPresent()) {
            ConfiguracionSistema config = configOpt.get();
            config.setClave(configuracion.getClave());
            config.setValor(configuracion.getValor());
            config.setDescripcion(configuracion.getDescripcion());
            config.setTipo(configuracion.getTipo());
            config.setUpdatedBy(configuracion.getUpdatedBy());
            return configuracionSistemaRepository.save(config);
        }
        throw new RuntimeException("Configuración no encontrada con ID: " + id);
    }
    
    @Transactional
    public void delete(Integer id) {
        if (!configuracionSistemaRepository.existsById(id)) {
            throw new RuntimeException("Configuración no encontrada con ID: " + id);
        }
        configuracionSistemaRepository.deleteById(id);
    }
    
    @Transactional
    public ConfiguracionSistema activarConfiguracion(Integer id) {
        Optional<ConfiguracionSistema> configOpt = configuracionSistemaRepository.findById(id);
        if (configOpt.isPresent()) {
            ConfiguracionSistema config = configOpt.get();
            // Simular activación cambiando descripción o valor
            config.setDescripcion("ACTIVA - " + (config.getDescripcion() != null ? config.getDescripcion().replace("INACTIVA - ", "") : ""));
            return configuracionSistemaRepository.save(config);
        }
        throw new RuntimeException("Configuración no encontrada con ID: " + id);
    }
    
    @Transactional
    public ConfiguracionSistema desactivarConfiguracion(Integer id) {
        Optional<ConfiguracionSistema> configOpt = configuracionSistemaRepository.findById(id);
        if (configOpt.isPresent()) {
            ConfiguracionSistema config = configOpt.get();
            // Simular desactivación cambiando descripción
            config.setDescripcion("INACTIVA - " + (config.getDescripcion() != null ? config.getDescripcion().replace("ACTIVA - ", "") : ""));
            return configuracionSistemaRepository.save(config);
        }
        throw new RuntimeException("Configuración no encontrada con ID: " + id);
    }
    
    @Transactional(readOnly = true)
    public List<ConfiguracionSistema> findByCategoria(String categoria) {
        // Usar descripción como simulación de categoría
        return configuracionSistemaRepository.findByDescripcionContaining(categoria);
    }
    
    @Transactional(readOnly = true)
    public List<ConfiguracionSistema> findByActivo(boolean activo) {
        List<ConfiguracionSistema> todasLasConfiguraciones = configuracionSistemaRepository.findAll();
        if (activo) {
            // Filtrar las que no tengan "INACTIVA" en la descripción
            return todasLasConfiguraciones.stream()
                    .filter(config -> config.getDescripcion() == null || !config.getDescripcion().startsWith("INACTIVA"))
                    .collect(Collectors.toList());
        } else {
            // Filtrar las que tengan "INACTIVA" en la descripción
            return todasLasConfiguraciones.stream()
                    .filter(config -> config.getDescripcion() != null && config.getDescripcion().startsWith("INACTIVA"))
                    .collect(Collectors.toList());
        }
    }
    
    @Transactional
    public void updateMultiplesConfiguraciones(Map<String, String> configuraciones) {
        for (Map.Entry<String, String> entry : configuraciones.entrySet()) {
            String clave = entry.getKey();
            String valor = entry.getValue();
            updateValor(clave, valor);
        }
    }
    
    @Transactional(readOnly = true)
    public boolean validarConfiguracion(String clave) {
        Optional<ConfiguracionSistema> config = configuracionSistemaRepository.findByClave(clave);
        if (config.isPresent()) {
            ConfiguracionSistema configuracion = config.get();
            // Validación básica: verificar que el valor no esté vacío y que la configuración no esté "inactiva"
            String valor = configuracion.getValor();
            String descripcion = configuracion.getDescripcion();
            boolean valorValido = valor != null && !valor.trim().isEmpty();
            boolean noInactiva = descripcion == null || !descripcion.startsWith("INACTIVA");
            return valorValido && noInactiva;
        }
        return false;
    }
    
    @Transactional(readOnly = true)
    public Map<String, String> exportarConfiguraciones() {
        List<ConfiguracionSistema> configuraciones = configuracionSistemaRepository.findAll();
        Map<String, String> exportData = new HashMap<>();
        
        for (ConfiguracionSistema config : configuraciones) {
            exportData.put(config.getClave(), config.getValor());
        }
        
        return exportData;
    }
}
