package com.bancoagricola.api.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import javax.persistence.*;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "empleado")
public class Empleado {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_empleado")
    private Integer idEmpleado;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario")
    @JsonBackReference(value="usuario-empleado")
    private Usuario usuario;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sucursal")
    @JsonBackReference(value="sucursal-empleado")
    private Sucursal sucursal;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_rol")
    @JsonBackReference(value="rol-empleado")
    private Rol rol;
    
    @Column(name = "dui")
    @Size(max = 10, message = "El DUI debe tener máximo 10 caracteres")
    private String dui;
    
    @Column(name = "nombres")
    @Size(max = 100, message = "Los nombres deben tener máximo 100 caracteres")
    private String nombres;
    
    @Column(name = "apellidos")
    @Size(max = 100, message = "Los apellidos deben tener máximo 100 caracteres")
    private String apellidos;
    
    @Column(name = "salario")
    private BigDecimal salario;
    
    @Column(name = "activo")
    @Size(max = 1, message = "El estado activo debe ser un solo carácter")
    private String activo;
    
    @OneToMany(mappedBy = "cajero", cascade = CascadeType.ALL)
    @JsonManagedReference(value="empleado-prestamo")
    private List<Prestamo> prestamos = new ArrayList<>();
    
    public Empleado() {
    }
    
    public Empleado(Usuario usuario, Sucursal sucursal, Rol rol, String dui, String nombres, String apellidos, BigDecimal salario, String activo) {
        this.usuario = usuario;
        this.sucursal = sucursal;
        this.rol = rol;
        this.dui = dui;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.salario = salario;
        this.activo = activo;
    }
    
    public Integer getIdEmpleado() {
        return idEmpleado;
    }
    
    public void setIdEmpleado(Integer idEmpleado) {
        this.idEmpleado = idEmpleado;
    }
    
    public Usuario getUsuario() {
        return usuario;
    }
    
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
    
    public Sucursal getSucursal() {
        return sucursal;
    }
    
    public void setSucursal(Sucursal sucursal) {
        this.sucursal = sucursal;
    }
    
    public Rol getRol() {
        return rol;
    }
    
    public void setRol(Rol rol) {
        this.rol = rol;
    }
    
    public String getDui() {
        return dui;
    }
    
    public void setDui(String dui) {
        this.dui = dui;
    }
    
    public String getNombres() {
        return nombres;
    }
    
    public void setNombres(String nombres) {
        this.nombres = nombres;
    }
    
    public String getApellidos() {
        return apellidos;
    }
    
    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }
    
    public BigDecimal getSalario() {
        return salario;
    }
    
    public void setSalario(BigDecimal salario) {
        this.salario = salario;
    }
    
    public String getActivo() {
        return activo;
    }
    
    public void setActivo(String activo) {
        this.activo = activo;
    }
    
    public List<Prestamo> getPrestamos() {
        return prestamos;
    }
    
    public void setPrestamos(List<Prestamo> prestamos) {
        this.prestamos = prestamos;
    }
}
