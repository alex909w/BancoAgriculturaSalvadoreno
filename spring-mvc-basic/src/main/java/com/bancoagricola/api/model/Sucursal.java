package com.bancoagricola.api.model;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sucursal")
public class Sucursal {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sucursal")
    private Integer idSucursal;
    
    @Column(name = "nombre")
    @Size(max = 100, message = "El nombre debe tener máximo 100 caracteres")
    private String nombre;
    
    @Column(name = "direccion")
    @Size(max = 200, message = "La dirección debe tener máximo 200 caracteres")
    private String direccion;
    
    @Column(name = "telefono")
    @Size(max = 9, message = "El teléfono debe tener máximo 9 caracteres")
    private String telefono;
    
    @OneToMany(mappedBy = "sucursal", cascade = CascadeType.ALL)
    private List<Empleado> empleados = new ArrayList<>();
    
    public Sucursal() {
    }
    
    public Sucursal(String nombre, String direccion, String telefono) {
        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
    }
    
    public Integer getIdSucursal() {
        return idSucursal;
    }
    
    public void setIdSucursal(Integer idSucursal) {
        this.idSucursal = idSucursal;
    }
    
    public String getNombre() {
        return nombre;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
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
    
    public List<Empleado> getEmpleados() {
        return empleados;
    }
    
    public void setEmpleados(List<Empleado> empleados) {
        this.empleados = empleados;
    }
}
