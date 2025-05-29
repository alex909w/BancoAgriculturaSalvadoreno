package com.agrobanco.service;

import com.agrobanco.model.Auditoria;
import com.agrobanco.repository.AuditoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AuditoriaService {
    
    @Autowired
    private AuditoriaRepository auditoriaRepository;
    
    @Transactional(readOnly = true)
    public List<Auditoria> findAll() {
        return auditoriaRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Optional<Auditoria> findById(Integer id) {
        return auditoriaRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public List<Auditoria> findByTablaAfectada(String tablaAfectada) {
        return auditoriaRepository.findByTablaAfectada(tablaAfectada);
    }
    
    @Transactional(readOnly = true)
    public List<Auditoria> findByAccion(Auditoria.AccionAuditoria accion) {
        return auditoriaRepository.findByAccion(accion);
    }
    
    @Transactional(readOnly = true)
    public List<Auditoria> findByUsuarioId(Integer usuarioId) {
        return auditoriaRepository.findByUsuarioId(usuarioId);
    }
    
    @Transactional(readOnly = true)
    public List<Auditoria> findByFechaRange(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        return auditoriaRepository.findByCreatedAtBetween(fechaInicio, fechaFin);
    }
    
    @Transactional(readOnly = true)
    public List<Auditoria> findByTablaAndRegistro(String tablaAfectada, Integer registroId) {
        return auditoriaRepository.findByTablaAfectadaAndRegistroId(tablaAfectada, registroId);
    }
    
    @Transactional
    public Auditoria save(Auditoria auditoria) {
        return auditoriaRepository.save(auditoria);
    }
    
    @Transactional
    public void deleteById(Integer id) {
        auditoriaRepository.deleteById(id);
    }
    
    @Transactional(readOnly = true)
    public boolean existsById(Integer id) {
        return auditoriaRepository.existsById(id);
    }
      @Transactional(readOnly = true)
    public long count() {
        return auditoriaRepository.count();
    }
    
    @Transactional(readOnly = true)
    public List<Auditoria> findByRegistroId(Integer registroId) {
        return auditoriaRepository.findByRegistroId(registroId);
    }
      @Transactional(readOnly = true)
    public List<Auditoria> findRecientes(Integer limite) {
        Pageable pageable = PageRequest.of(0, limite);
        return auditoriaRepository.findRecentAuditorias(pageable);
    }
    
    @Transactional
    public Auditoria registrarAccion(String tablaAfectada, Auditoria.AccionAuditoria accion, 
                                    Integer registroId, Integer usuarioId, 
                                    String datosAnteriores, String datosNuevos, 
                                    String direccionIp, String userAgent) {
        Auditoria auditoria = new Auditoria();
        auditoria.setTablaAfectada(tablaAfectada);
        auditoria.setAccion(accion);
        auditoria.setRegistroId(registroId);
        auditoria.setDatosAnteriores(datosAnteriores);
        auditoria.setDatosNuevos(datosNuevos);
        auditoria.setIpAddress(direccionIp);
        auditoria.setUserAgent(userAgent);
        
        return auditoriaRepository.save(auditoria);
    }
    
    @Transactional(readOnly = true)
    public long contarPorAccion(Auditoria.AccionAuditoria accion) {
        return auditoriaRepository.countByAccion(accion);
    }
    
    @Transactional(readOnly = true)
    public List<Object[]> contarPorTabla() {
        return auditoriaRepository.countByTablaAfectada();
    }
    
    @Transactional
    public void delete(Integer id) {
        auditoriaRepository.deleteById(id);
    }
    
    @Transactional
    public void limpiarRegistrosAntiguos(Integer diasAntiguedad) {
        LocalDateTime fechaLimite = LocalDateTime.now().minusDays(diasAntiguedad);
        auditoriaRepository.deleteByCreatedAtBefore(fechaLimite);
    }
}
