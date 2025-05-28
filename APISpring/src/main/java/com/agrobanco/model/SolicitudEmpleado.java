package com.agrobanco.model;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import javax.validation.constraints.DecimalMin;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "solicitudes_empleados")
public class SolicitudEmpleado {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @NotBlank(message = "El nombre completo es requerido")
    @Size(max = 150, message = "El nombre completo no puede exceder 150 caracteres")
    @Column(name = "nombre_completo", nullable = false)
    private String nombreCompleto;
    
    @NotBlank(message = "El DUI es requerido")
    @Size(max = 10, message = "El DUI no puede exceder 10 caracteres")
    @Column(nullable = false)
    private String dui;
    
    @NotBlank(message = "El email es requerido")
    @Email(message = "El email debe tener un formato válido")
    @Size(max = 100, message = "El email no puede exceder 100 caracteres")
    @Column(nullable = false)
    private String email;
    
    @Size(max = 15, message = "El teléfono no puede exceder 15 caracteres")
    private String telefono;
    
    @Column(columnDefinition = "TEXT")
    private String direccion;
    
    @NotBlank(message = "El puesto solicitado es requerido")
    @Size(max = 100, message = "El puesto solicitado no puede exceder 100 caracteres")
    @Column(name = "puesto_solicitado", nullable = false)
    private String puestoSolicitado;
    
    @DecimalMin(value = "0.01", message = "El salario propuesto debe ser mayor que 0")
    @Column(name = "salario_propuesto", precision = 10, scale = 2)
    private BigDecimal salarioPropuesto;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sucursal_id", nullable = false)
    private Sucursal sucursal;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoSolicitud estado = EstadoSolicitud.pendiente;
    
    @Column(name = "fecha_solicitud", nullable = false)
    private LocalDate fechaSolicitud;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gerente_revisor_id")
    private Usuario gerenteRevisor;
    
    @Column(name = "fecha_revision")
    private LocalDate fechaRevision;
    
    @Column(columnDefinition = "TEXT")
    private String observaciones;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Enum
    public enum EstadoSolicitud {
        pendiente, en_revision, aprobado, rechazado
    }
    
    // Constructor
    public SolicitudEmpleado() {}
    
    public SolicitudEmpleado(String nombreCompleto, String dui, String email, String puestoSolicitado, Sucursal sucursal) {
        this.nombreCompleto = nombreCompleto;
        this.dui = dui;
        this.email = email;
        this.puestoSolicitado = puestoSolicitado;
        this.sucursal = sucursal;
        this.fechaSolicitud = LocalDate.now();
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (fechaSolicitud == null) {
            fechaSolicitud = LocalDate.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getNombreCompleto() { return nombreCompleto; }
    public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }
    
    public String getDui() { return dui; }
    public void setDui(String dui) { this.dui = dui; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    
    public String getPuestoSolicitado() { return puestoSolicitado; }
    public void setPuestoSolicitado(String puestoSolicitado) { this.puestoSolicitado = puestoSolicitado; }
    
    public BigDecimal getSalarioPropuesto() { return salarioPropuesto; }
    public void setSalarioPropuesto(BigDecimal salarioPropuesto) { this.salarioPropuesto = salarioPropuesto; }
    
    public Sucursal getSucursal() { return sucursal; }
    public void setSucursal(Sucursal sucursal) { this.sucursal = sucursal; }
    
    public EstadoSolicitud getEstado() { return estado; }
    public void setEstado(EstadoSolicitud estado) { this.estado = estado; }
    
    public LocalDate getFechaSolicitud() { return fechaSolicitud; }
    public void setFechaSolicitud(LocalDate fechaSolicitud) { this.fechaSolicitud = fechaSolicitud; }
    
    public Usuario getGerenteRevisor() { return gerenteRevisor; }
    public void setGerenteRevisor(Usuario gerenteRevisor) { this.gerenteRevisor = gerenteRevisor; }
    
    public LocalDate getFechaRevision() { return fechaRevision; }
    public void setFechaRevision(LocalDate fechaRevision) { this.fechaRevision = fechaRevision; }
    
    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
