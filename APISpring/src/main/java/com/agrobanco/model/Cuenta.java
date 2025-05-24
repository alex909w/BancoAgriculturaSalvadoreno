package com.agrobanco.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "cuentas")
public class Cuenta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @NotBlank(message = "El número de cuenta es requerido")
    @Size(max = 20, message = "El número de cuenta no puede exceder 20 caracteres")
    @Column(name = "numero_cuenta", nullable = false, unique = true)
    private String numeroCuenta;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Usuario cliente;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tipo_cuenta_id", nullable = false)
    private TipoCuenta tipoCuenta;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sucursal_id", nullable = false)
    private Sucursal sucursal;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal saldo = BigDecimal.ZERO;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoCuenta estado = EstadoCuenta.activa;
    
    @Column(name = "tiene_seguro")
    private Boolean tieneSeguro = false;
    
    @Column(name = "fecha_apertura", nullable = false)
    private LocalDate fechaApertura;
    
    @Column(name = "fecha_cierre")
    private LocalDate fechaCierre;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "cuenta", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Beneficiario> beneficiarios;
    
    @OneToMany(mappedBy = "cuentaOrigen", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Transaccion> transaccionesOrigen;
    
    @OneToMany(mappedBy = "cuentaDestino", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Transaccion> transaccionesDestino;
    
    // Enums
    public enum EstadoCuenta {
        activa, inactiva, bloqueada, cerrada
    }
    
    // Constructores
    public Cuenta() {}
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (fechaApertura == null) {
            fechaApertura = LocalDate.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getNumeroCuenta() { return numeroCuenta; }
    public void setNumeroCuenta(String numeroCuenta) { this.numeroCuenta = numeroCuenta; }
    
    public Usuario getCliente() { return cliente; }
    public void setCliente(Usuario cliente) { this.cliente = cliente; }
    
    public TipoCuenta getTipoCuenta() { return tipoCuenta; }
    public void setTipoCuenta(TipoCuenta tipoCuenta) { this.tipoCuenta = tipoCuenta; }
    
    public Sucursal getSucursal() { return sucursal; }
    public void setSucursal(Sucursal sucursal) { this.sucursal = sucursal; }
    
    public BigDecimal getSaldo() { return saldo; }
    public void setSaldo(BigDecimal saldo) { this.saldo = saldo; }
    
    public EstadoCuenta getEstado() { return estado; }
    public void setEstado(EstadoCuenta estado) { this.estado = estado; }
    
    public Boolean getTieneSeguro() { return tieneSeguro; }
    public void setTieneSeguro(Boolean tieneSeguro) { this.tieneSeguro = tieneSeguro; }
    
    public LocalDate getFechaApertura() { return fechaApertura; }
    public void setFechaApertura(LocalDate fechaApertura) { this.fechaApertura = fechaApertura; }
    
    public LocalDate getFechaCierre() { return fechaCierre; }
    public void setFechaCierre(LocalDate fechaCierre) { this.fechaCierre = fechaCierre; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public List<Beneficiario> getBeneficiarios() { return beneficiarios; }
    public void setBeneficiarios(List<Beneficiario> beneficiarios) { this.beneficiarios = beneficiarios; }
    
    public List<Transaccion> getTransaccionesOrigen() { return transaccionesOrigen; }
    public void setTransaccionesOrigen(List<Transaccion> transaccionesOrigen) { this.transaccionesOrigen = transaccionesOrigen; }
    
    public List<Transaccion> getTransaccionesDestino() { return transaccionesDestino; }
    public void setTransaccionesDestino(List<Transaccion> transaccionesDestino) { this.transaccionesDestino = transaccionesDestino; }
}
