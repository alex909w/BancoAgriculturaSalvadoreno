package com.agrobanco.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "usuarios")
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @NotBlank(message = "El username es requerido")
    @Size(max = 50, message = "El username no puede exceder 50 caracteres")
    @Column(nullable = false, unique = true)
    private String username;
    
    @NotBlank(message = "El email es requerido")
    @Email(message = "El email debe tener un formato válido")
    @Size(max = 100, message = "El email no puede exceder 100 caracteres")
    @Column(nullable = false, unique = true)
    private String email;
    
    @NotBlank(message = "La contraseña es requerida")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;
    
    @NotBlank(message = "El nombre completo es requerido")
    @Size(max = 150, message = "El nombre completo no puede exceder 150 caracteres")
    @Column(name = "nombre_completo", nullable = false)
    private String nombreCompleto;
    
    @Size(max = 10, message = "El DUI no puede exceder 10 caracteres")
    @Column(unique = true)
    private String dui;
    
    @Size(max = 15, message = "El teléfono no puede exceder 15 caracteres")
    private String telefono;
    
    @Column(columnDefinition = "TEXT")
    private String direccion;
    
    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;
    
    @Enumerated(EnumType.STRING)
    private Genero genero;
    
    @Size(max = 100, message = "La profesión no puede exceder 100 caracteres")
    private String profesion;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal salario;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "rol_id", nullable = false)
    private Rol rol;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sucursal_id")
    private Sucursal sucursal;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoUsuario estado = EstadoUsuario.activo;
    
    @Column(name = "ultimo_login")
    private LocalDateTime ultimoLogin;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "cliente", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Cuenta> cuentas;
    
    @OneToMany(mappedBy = "cliente", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Prestamo> prestamos;
    
    // Enums
    public enum Genero {
        M, F, Otro
    }
    
    public enum EstadoUsuario {
        activo, inactivo, suspendido
    }
    
    // Constructores
    public Usuario() {}
    
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
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    
    public String getNombreCompleto() { return nombreCompleto; }
    public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }
    
    public String getDui() { return dui; }
    public void setDui(String dui) { this.dui = dui; }
    
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    
    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }
    
    public Genero getGenero() { return genero; }
    public void setGenero(Genero genero) { this.genero = genero; }
    
    public String getProfesion() { return profesion; }
    public void setProfesion(String profesion) { this.profesion = profesion; }
    
    public BigDecimal getSalario() { return salario; }
    public void setSalario(BigDecimal salario) { this.salario = salario; }
    
    public Rol getRol() { return rol; }
    public void setRol(Rol rol) { this.rol = rol; }
    
    public Sucursal getSucursal() { return sucursal; }
    public void setSucursal(Sucursal sucursal) { this.sucursal = sucursal; }
    
    public EstadoUsuario getEstado() { return estado; }
    public void setEstado(EstadoUsuario estado) { this.estado = estado; }
    
    public LocalDateTime getUltimoLogin() { return ultimoLogin; }
    public void setUltimoLogin(LocalDateTime ultimoLogin) { this.ultimoLogin = ultimoLogin; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public List<Cuenta> getCuentas() { return cuentas; }
    public void setCuentas(List<Cuenta> cuentas) { this.cuentas = cuentas; }
    
    public List<Prestamo> getPrestamos() { return prestamos; }
    public void setPrestamos(List<Prestamo> prestamos) { this.prestamos = prestamos; }
}
