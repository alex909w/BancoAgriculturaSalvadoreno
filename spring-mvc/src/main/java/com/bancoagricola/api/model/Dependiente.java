package com.bancoagricola.api.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import javax.persistence.*;
import javax.validation.constraints.Size;
import java.math.BigDecimal;

@Entity
@Table(name = "dependiente")
public class Dependiente {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_dependiente")
    private Integer idDependiente;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario")
    @JsonBackReference(value="usuario-dependiente")
    private Usuario usuario;
    
    @Column(name = "dui")
    @Size(max = 10, message = "El DUI debe tener máximo 10 caracteres")
    private String dui;
    
    @Column(name = "nombre_comercio")
    @Size(max = 100, message = "El nombre del comercio debe tener máximo 100 caracteres")
    private String nombreComercio;
    
    @Column(name = "comision")
    private BigDecimal comision;
    
    public Dependiente() {
    }
    
    public Dependiente(Usuario usuario, String dui, String nombreComercio, BigDecimal comision) {
        this.usuario = usuario;
        this.dui = dui;
        this.nombreComercio = nombreComercio;
        this.comision = comision;
    }
    
    public Integer getIdDependiente() {
        return idDependiente;
    }
    
    public void setIdDependiente(Integer idDependiente) {
        this.idDependiente = idDependiente;
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
    
    public String getNombreComercio() {
        return nombreComercio;
    }
    
    public void setNombreComercio(String nombreComercio) {
        this.nombreComercio = nombreComercio;
    }
    
    public BigDecimal getComision() {
        return comision;
    }
    
    public void setComision(BigDecimal comision) {
        this.comision = comision;
    }
}
