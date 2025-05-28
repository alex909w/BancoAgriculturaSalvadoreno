package com.agrobanco.service;

import com.agrobanco.model.SolicitudEmpleado;
import com.agrobanco.model.Usuario;
import com.agrobanco.repository.SolicitudEmpleadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class SolicitudEmpleadoService {
    
    @Autowired
    private SolicitudEmpleadoRepository solicitudEmpleadoRepository;
    
    @Transactional(readOnly = true)
    public List<SolicitudEmpleado> findAll() {
        return solicitudEmpleadoRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Optional<SolicitudEmpleado> findById(Integer id) {
        return solicitudEmpleadoRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public List<SolicitudEmpleado> findByEstado(SolicitudEmpleado.EstadoSolicitud estado) {
        return solicitudEmpleadoRepository.findByEstado(estado);
    }
    
    @Transactional(readOnly = true)
    public List<SolicitudEmpleado> findBySucursalId(Integer sucursalId) {
        return solicitudEmpleadoRepository.findBySucursalId(sucursalId);
    }
    
    @Transactional(readOnly = true)
    public Optional<SolicitudEmpleado> findByDui(String dui) {
        return solicitudEmpleadoRepository.findByDui(dui);
    }
    
    @Transactional(readOnly = true)
    public Optional<SolicitudEmpleado> findByEmail(String email) {
        return solicitudEmpleadoRepository.findByEmail(email);
    }
    
    @Transactional(readOnly = true)
    public List<SolicitudEmpleado> findByPuestoSolicitado(String puesto) {
        return solicitudEmpleadoRepository.findByPuestoSolicitado(puesto);
    }
    
    @Transactional(readOnly = true)
    public List<SolicitudEmpleado> findByFechaSolicitudRange(LocalDate fechaInicio, LocalDate fechaFin) {
        return solicitudEmpleadoRepository.findByFechaSolicitudBetween(fechaInicio, fechaFin);
    }
    
    @Transactional(readOnly = true)
    public List<SolicitudEmpleado> findByGerenteRevisorId(Integer gerenteId) {
        return solicitudEmpleadoRepository.findByGerenteRevisorId(gerenteId);
    }
    
    @Transactional(readOnly = true)
    public boolean existsByDui(String dui) {
        return solicitudEmpleadoRepository.existsByDui(dui);
    }
    
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return solicitudEmpleadoRepository.existsByEmail(email);
    }
    
    @Transactional
    public SolicitudEmpleado save(SolicitudEmpleado solicitudEmpleado) {        // Validar que no exista una solicitud activa con el mismo DUI
        if (solicitudEmpleadoRepository.existsByDuiAndEstadoIn(
                solicitudEmpleado.getDui(), 
                Arrays.asList(SolicitudEmpleado.EstadoSolicitud.pendiente, 
                       SolicitudEmpleado.EstadoSolicitud.en_revision))) {
            throw new RuntimeException("Ya existe una solicitud activa para este DUI");
        }
          // Validar que no exista una solicitud activa con el mismo email
        if (solicitudEmpleadoRepository.existsByEmailAndEstadoIn(
                solicitudEmpleado.getEmail(), 
                Arrays.asList(SolicitudEmpleado.EstadoSolicitud.pendiente, 
                       SolicitudEmpleado.EstadoSolicitud.en_revision))) {
            throw new RuntimeException("Ya existe una solicitud activa para este email");
        }
        
        return solicitudEmpleadoRepository.save(solicitudEmpleado);
    }
    
    @Transactional
    public SolicitudEmpleado update(Integer id, SolicitudEmpleado solicitudEmpleado) {
        if (!solicitudEmpleadoRepository.existsById(id)) {
            throw new RuntimeException("Solicitud de empleado no encontrada");
        }
        solicitudEmpleado.setId(id);
        return solicitudEmpleadoRepository.save(solicitudEmpleado);
    }
    
    @Transactional
    public void delete(Integer id) {
        if (!solicitudEmpleadoRepository.existsById(id)) {
            throw new RuntimeException("Solicitud de empleado no encontrada");
        }
        solicitudEmpleadoRepository.deleteById(id);
    }
    
    @Transactional
    public SolicitudEmpleado aprobarSolicitud(Integer id, Integer gerenteRevisorId, String observaciones) {
        SolicitudEmpleado solicitud = solicitudEmpleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
        
        if (solicitud.getEstado() != SolicitudEmpleado.EstadoSolicitud.pendiente && 
            solicitud.getEstado() != SolicitudEmpleado.EstadoSolicitud.en_revision) {
            throw new RuntimeException("La solicitud no puede ser aprobada en su estado actual");
        }
        
        solicitud.setEstado(SolicitudEmpleado.EstadoSolicitud.aprobado);
        solicitud.setFechaRevision(LocalDate.now());
        solicitud.setObservaciones(observaciones);
        
        // Si se proporciona un gerente revisor, asignarlo
        if (gerenteRevisorId != null) {
            Usuario gerenteRevisor = new Usuario();
            gerenteRevisor.setId(gerenteRevisorId);
            solicitud.setGerenteRevisor(gerenteRevisor);
        }
        
        return solicitudEmpleadoRepository.save(solicitud);
    }
    
    @Transactional
    public SolicitudEmpleado rechazarSolicitud(Integer id, Integer gerenteRevisorId, String observaciones) {
        SolicitudEmpleado solicitud = solicitudEmpleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
        
        if (solicitud.getEstado() != SolicitudEmpleado.EstadoSolicitud.pendiente && 
            solicitud.getEstado() != SolicitudEmpleado.EstadoSolicitud.en_revision) {
            throw new RuntimeException("La solicitud no puede ser rechazada en su estado actual");
        }
        
        solicitud.setEstado(SolicitudEmpleado.EstadoSolicitud.rechazado);
        solicitud.setFechaRevision(LocalDate.now());
        solicitud.setObservaciones(observaciones);
        
        // Si se proporciona un gerente revisor, asignarlo
        if (gerenteRevisorId != null) {
            Usuario gerenteRevisor = new Usuario();
            gerenteRevisor.setId(gerenteRevisorId);
            solicitud.setGerenteRevisor(gerenteRevisor);
        }
        
        return solicitudEmpleadoRepository.save(solicitud);
    }
    
    @Transactional
    public SolicitudEmpleado marcarEnRevision(Integer id, Integer gerenteRevisorId) {
        SolicitudEmpleado solicitud = solicitudEmpleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
        
        if (solicitud.getEstado() != SolicitudEmpleado.EstadoSolicitud.pendiente) {
            throw new RuntimeException("Solo se pueden marcar en revisión las solicitudes pendientes");
        }
        
        solicitud.setEstado(SolicitudEmpleado.EstadoSolicitud.en_revision);
        
        // Asignar gerente revisor
        if (gerenteRevisorId != null) {
            Usuario gerenteRevisor = new Usuario();
            gerenteRevisor.setId(gerenteRevisorId);
            solicitud.setGerenteRevisor(gerenteRevisor);
        }
        
        return solicitudEmpleadoRepository.save(solicitud);
    }
    
    @Transactional(readOnly = true)
    public List<SolicitudEmpleado> findSolicitudesPendientesPorTiempo(Integer diasDesdeCreacion) {
        return solicitudEmpleadoRepository.findSolicitudesPendientesPorTiempo(diasDesdeCreacion);
    }
    
    @Transactional(readOnly = true)
    public long contarSolicitudesPorEstado(SolicitudEmpleado.EstadoSolicitud estado) {
        return solicitudEmpleadoRepository.countByEstado(estado);
    }
    
    @Transactional(readOnly = true)
    public long contarSolicitudesPorSucursal(Integer sucursalId) {
        return solicitudEmpleadoRepository.countBySucursalId(sucursalId);
    }
}
