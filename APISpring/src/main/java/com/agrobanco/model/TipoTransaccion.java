package com.agrobanco.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tipos_transaccion")
public class TipoTransaccion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @NotBlank(message = "El nombre es requerido")
    @Size(max = 50, message = "El nombre no puede exceder 50 caracteres")
    @Column(nullable = false, unique = true)
    private String nombre;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
    @Column(name = "requiere_cuenta_destino")
    private Boolean requiereCuentaDestino = false;
    
    @Column(precision = 8, scale = 2)
    private BigDecimal comision = BigDecimal.ZERO;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "tipoTransaccion", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Transaccion> transacciones;
    
    // Constructores
    public TipoTransaccion() {}
    
    public TipoTransaccion(String nombre, String descripcion, Boolean requiereCuentaDestino, BigDecimal comision) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.requiereCuentaDestino = requiereCuentaDestino;
        this.comision = comision;
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    
    public Boolean getRequiereCuentaDestino() { return requiereCuentaDestino; }
    public void setRequiereCuentaDestino(Boolean requiereCuentaDestino) { this.requiereCuentaDestino = requiereCuentaDestino; }
    
    public BigDecimal getComision() { return comision; }
    public void setComision(BigDecimal comision) { this.comision = comision; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public List<Transaccion> getTransacciones() { return transacciones; }
    public void setTransacciones(List<Transaccion> transacciones) { this.transacciones = transacciones; }
}
