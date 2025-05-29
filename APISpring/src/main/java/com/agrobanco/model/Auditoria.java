package com.agrobanco.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "auditoria")
public class Auditoria {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @NotBlank(message = "La tabla afectada es requerida")
    @Size(max = 50, message = "La tabla afectada no puede exceder 50 caracteres")
    @Column(name = "tabla_afectada", nullable = false)
    private String tablaAfectada;
    
    @Column(name = "registro_id", nullable = false)
    private Integer registroId;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccionAuditoria accion;
    
    @Column(name = "datos_anteriores", columnDefinition = "JSON")
    private String datosAnteriores;
    
    @Column(name = "datos_nuevos", columnDefinition = "JSON")
    private String datosNuevos;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
    
    @Size(max = 45, message = "La dirección IP no puede exceder 45 caracteres")
    @Column(name = "ip_address")
    private String ipAddress;
    
    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Enum
    public enum AccionAuditoria {
        INSERT, UPDATE, DELETE
    }
    
    // Constructor
    public Auditoria() {}
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getTablaAfectada() { return tablaAfectada; }
    public void setTablaAfectada(String tablaAfectada) { this.tablaAfectada = tablaAfectada; }
    
    public Integer getRegistroId() { return registroId; }
    public void setRegistroId(Integer registroId) { this.registroId = registroId; }
    
    public AccionAuditoria getAccion() { return accion; }
    public void setAccion(AccionAuditoria accion) { this.accion = accion; }
    
    public String getDatosAnteriores() { return datosAnteriores; }
    public void setDatosAnteriores(String datosAnteriores) { this.datosAnteriores = datosAnteriores; }
    
    public String getDatosNuevos() { return datosNuevos; }
    public void setDatosNuevos(String datosNuevos) { this.datosNuevos = datosNuevos; }
    
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    
    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
