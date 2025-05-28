package com.agrobanco.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "configuracion_sistema")
public class ConfiguracionSistema {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @NotBlank(message = "La clave es requerida")
    @Size(max = 100, message = "La clave no puede exceder 100 caracteres")
    @Column(nullable = false, unique = true)
    private String clave;
    
    @NotBlank(message = "El valor es requerido")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String valor;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoConfiguracion tipo = TipoConfiguracion.string;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by")
    private Usuario updatedBy;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Enum
    public enum TipoConfiguracion {
        string, number, bool, json
    }
    
    // Constructor
    public ConfiguracionSistema() {}
    
    public ConfiguracionSistema(String clave, String valor, String descripcion, TipoConfiguracion tipo) {
        this.clave = clave;
        this.valor = valor;
        this.descripcion = descripcion;
        this.tipo = tipo;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getClave() { return clave; }
    public void setClave(String clave) { this.clave = clave; }
    
    public String getValor() { return valor; }
    public void setValor(String valor) { this.valor = valor; }
    
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    
    public TipoConfiguracion getTipo() { return tipo; }
    public void setTipo(TipoConfiguracion tipo) { this.tipo = tipo; }
    
    public Usuario getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(Usuario updatedBy) { this.updatedBy = updatedBy; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
