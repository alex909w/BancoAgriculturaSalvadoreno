package com.bancoagricola.api.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import javax.persistence.*;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cliente")
public class Cliente {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
    private Integer idCliente;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario")
    @JsonManagedReference
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Usuario usuario;
    
    @Column(name = "dui")
    @Size(max = 10, message = "El DUI debe tener máximo 10 caracteres")
    private String dui;
    
    @Column(name = "nombres")
    @Size(max = 100, message = "Los nombres deben tener máximo 100 caracteres")
    private String nombres;
    
    @Column(name = "apellidos")
    @Size(max = 100, message = "Los apellidos deben tener máximo 100 caracteres")
    private String apellidos;
    
    @Column(name = "direccion")
    @Size(max = 200, message = "La dirección debe tener máximo 200 caracteres")
    private String direccion;
    
    @Column(name = "telefono")
    @Size(max = 9, message = "El teléfono debe tener máximo 9 caracteres")
    private String telefono;
    
    @Column(name = "lugar_trabajo")
    @Size(max = 200, message = "El lugar de trabajo debe tener máximo 200 caracteres")
    private String lugarTrabajo;
    
    @Column(name = "salario")
    private BigDecimal salario;
    
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"cliente", "hibernateLazyInitializer", "handler"})
    private List<Cuenta> cuentas = new ArrayList<>();
    
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"cliente", "hibernateLazyInitializer", "handler"})
    private List<Prestamo> prestamos = new ArrayList<>();
    
    public Cliente() {
    }
    
    public Cliente(Usuario usuario, String dui, String nombres, String apellidos, String direccion, String telefono, String lugarTrabajo, BigDecimal salario) {
        this.usuario = usuario;
        this.dui = dui;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.direccion = direccion;
        this.telefono = telefono;
        this.lugarTrabajo = lugarTrabajo;
        this.salario = salario;
    }
    
    public Integer getIdCliente() {
        return idCliente;
    }
    
    public void setIdCliente(Integer idCliente) {
        this.idCliente = idCliente;
    }
    
    public Usuario getUsuario() {
        return usuario;
    }
    
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
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
    
    public String getDireccion() {
        return direccion;
    }
    
    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
    
    public String getTelefono() {
        return telefono;
    }
    
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
    
    public String getLugarTrabajo() {
        return lugarTrabajo;
    }
    
    public void setLugarTrabajo(String lugarTrabajo) {
        this.lugarTrabajo = lugarTrabajo;
    }
    
    public BigDecimal getSalario() {
        return salario;
    }
    
    public void setSalario(BigDecimal salario) {
        this.salario = salario;
    }
    
    public List<Cuenta> getCuentas() {
        return cuentas;
    }
    
    public void setCuentas(List<Cuenta> cuentas) {
        this.cuentas = cuentas;
    }
    
    public List<Prestamo> getPrestamos() {
        return prestamos;
    }
    
    public void setPrestamos(List<Prestamo> prestamos) {
        this.prestamos = prestamos;
    }
}
