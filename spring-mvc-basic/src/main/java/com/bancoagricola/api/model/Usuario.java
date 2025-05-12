package com.bancoagricola.api.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "usuario")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(name = "usuario", unique = true)
    @NotBlank(message = "El usuario es obligatorio")
    @Size(max = 100, message = "El usuario debe tener máximo 100 caracteres")
    private String usuario;

    @Column(name = "password")
    @NotBlank(message = "La contraseña es obligatoria")
    @Size(max = 100, message = "La contraseña debe tener máximo 100 caracteres")
    private String password;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    private List<Cliente> clientes = new ArrayList<>();

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    private List<Empleado> empleados = new ArrayList<>();

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    private List<Dependiente> dependientes = new ArrayList<>();

    public Usuario() {
    }

    public Usuario(String usuario, String password) {
        this.usuario = usuario;
        this.password = password;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<Cliente> getClientes() {
        return clientes;
    }

    public void setClientes(List<Cliente> clientes) {
        this.clientes = clientes;
    }

    public List<Empleado> getEmpleados() {
        return empleados;
    }

    public void setEmpleados(List<Empleado> empleados) {
        this.empleados = empleados;
    }

    public List<Dependiente> getDependientes() {
        return dependientes;
    }

    public void setDependientes(List<Dependiente> dependientes) {
        this.dependientes = dependientes;
    }
}
