package com.bancoagricola.api.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rol")
public class Rol {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol")
    private Integer idRol;
    
    @Column(name = "nombre")
    @NotBlank(message = "El nombre del rol es obligatorio")
    @Size(max = 100, message = "El nombre del rol debe tener máximo 100 caracteres")
    private String nombre;
    
    @OneToMany(mappedBy = "rol", cascade = CascadeType.ALL)
    private List<Empleado> empleados = new ArrayList<>();
    
    public Rol() {
    }
    
    public Rol(String nombre) {
        this.nombre = nombre;
    }
    
    public Integer getIdRol() {
        return idRol;
    }
    
    public void setIdRol(Integer idRol) {
        this.idRol = idRol;
    }
    
    public String getNombre() {
        return nombre;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public List<Empleado> getEmpleados() {
        return empleados;
    }
    
    public void setEmpleados(List<Empleado> empleados) {
        this.empleados = empleados;
    }
}
