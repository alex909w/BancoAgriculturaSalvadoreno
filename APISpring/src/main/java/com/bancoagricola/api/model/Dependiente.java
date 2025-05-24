package com.bancoagricola.api.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonIgnore;

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
    @JsonIgnore
    private Usuario usuario;
    
    @Size(max = 10, message = "El CUI no puede exceder 10 caracteres")
    @Column(name = "cui")
    private String cui;
    
    @NotBlank(message = "El nombre del comercio es requerido")
    @Size(max = 100, message = "El nombre del comercio no puede exceder 100 caracteres")
    @Column(name = "nombre_comercio")
    private String nombreComercio;
    
    @Column(name = "comision", precision = 10, scale = 2)
    private BigDecimal comision;
    
    // Constructores
    public Dependiente() {}
    
    public Dependiente(String cui, String nombreComercio, BigDecimal comision) {
        this.cui = cui;
        this.nombreComercio = nombreComercio;
        this.comision = comision;
    }
    
    // Getters y Setters
    public Integer getIdDependiente() { return idDependiente; }
    public void setIdDependiente(Integer idDependiente) { this.idDependiente = idDependiente; }
    
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    
    public String getCui() { return cui; }
    public void setCui(String cui) { this.cui = cui; }
    
    public String getNombreComercio() { return nombreComercio; }
    public void setNombreComercio(String nombreComercio) { this.nombreComercio = nombreComercio; }
    
    public BigDecimal getComision() { return comision; }
    public void setComision(BigDecimal comision) { this.comision = comision; }
}
