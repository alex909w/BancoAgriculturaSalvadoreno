package com.agrobanco.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "sucursales")
public class Sucursal {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @NotBlank(message = "El nombre es requerido")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    @Column(nullable = false)
    private String nombre;
    
    @NotBlank(message = "El código es requerido")
    @Size(max = 20, message = "El código no puede exceder 20 caracteres")
    @Column(nullable = false, unique = true)
    private String codigo;
    
    @NotBlank(message = "El departamento es requerido")
    @Size(max = 50, message = "El departamento no puede exceder 50 caracteres")
    @Column(nullable = false)
    private String departamento;
    
    @NotBlank(message = "El municipio es requerido")
    @Size(max = 50, message = "El municipio no puede exceder 50 caracteres")
    @Column(nullable = false)
    private String municipio;
    
    @NotBlank(message = "La dirección es requerida")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String direccion;
    
    @Size(max = 15, message = "El teléfono no puede exceder 15 caracteres")
    private String telefono;
    
    @Size(max = 100, message = "El email no puede exceder 100 caracteres")
    private String email;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoSucursal tipo;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoSucursal estado = EstadoSucursal.activa;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "sucursal", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Usuario> usuarios;
    
    @OneToMany(mappedBy = "sucursal", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Cuenta> cuentas;
    
    // Enums
    public enum TipoSucursal {
        express, standard
    }
    
    public enum EstadoSucursal {
        activa, inactiva
    }
    
    // Constructores
    public Sucursal() {}
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    
    public String getDepartamento() { return departamento; }
    public void setDepartamento(String departamento) { this.departamento = departamento; }
    
    public String getMunicipio() { return municipio; }
    public void setMunicipio(String municipio) { this.municipio = municipio; }
    
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public TipoSucursal getTipo() { return tipo; }
    public void setTipo(TipoSucursal tipo) { this.tipo = tipo; }
    
    public EstadoSucursal getEstado() { return estado; }
    public void setEstado(EstadoSucursal estado) { this.estado = estado; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public List<Usuario> getUsuarios() { return usuarios; }
    public void setUsuarios(List<Usuario> usuarios) { this.usuarios = usuarios; }
    
    public List<Cuenta> getCuentas() { return cuentas; }
    public void setCuentas(List<Cuenta> cuentas) { this.cuentas = cuentas; }
}
