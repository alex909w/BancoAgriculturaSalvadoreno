package com.bancoagricola.api.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "transacciones")
public class Transaccion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "tipo_transaccion")
    @NotBlank(message = "El tipo de transacción es obligatorio")
    @Size(max = 20, message = "El tipo de transacción debe tener máximo 20 caracteres")
    private String tipoTransaccion;
    
    @Column(name = "monto")
    @NotNull(message = "El monto es obligatorio")
    private BigDecimal monto;
    
    @Column(name = "saldo_anterior")
    @NotNull(message = "El saldo anterior es obligatorio")
    private BigDecimal saldoAnterior;
    
    @Column(name = "saldo_nuevo")
    @NotNull(message = "El saldo nuevo es obligatorio")
    private BigDecimal saldoNuevo;
    
    @Column(name = "fecha_transaccion")
    @Temporal(TemporalType.TIMESTAMP)
    @NotNull(message = "La fecha de transacción es obligatoria")
    private Date fechaTransaccion;
    
    @Column(name = "numero_cuenta")
    @NotBlank(message = "El número de cuenta es obligatorio")
    @Size(max = 20, message = "El número de cuenta debe tener máximo 20 caracteres")
    private String numeroCuenta;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "numero_cuenta", referencedColumnName = "numero_cuenta", insertable = false, updatable = false)
    private Cuenta cuenta;
    
    public Transaccion() {
    }
    
    public Transaccion(String tipoTransaccion, BigDecimal monto, BigDecimal saldoAnterior, BigDecimal saldoNuevo, Date fechaTransaccion, String numeroCuenta) {
        this.tipoTransaccion = tipoTransaccion;
        this.monto = monto;
        this.saldoAnterior = saldoAnterior;
        this.saldoNuevo = saldoNuevo;
        this.fechaTransaccion = fechaTransaccion;
        this.numeroCuenta = numeroCuenta;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTipoTransaccion() {
        return tipoTransaccion;
    }
    
    public void setTipoTransaccion(String tipoTransaccion) {
        this.tipoTransaccion = tipoTransaccion;
    }
    
    public BigDecimal getMonto() {
        return monto;
    }
    
    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }
    
    public BigDecimal getSaldoAnterior() {
        return saldoAnterior;
    }
    
    public void setSaldoAnterior(BigDecimal saldoAnterior) {
        this.saldoAnterior = saldoAnterior;
    }
    
    public BigDecimal getSaldoNuevo() {
        return saldoNuevo;
    }
    
    public void setSaldoNuevo(BigDecimal saldoNuevo) {
        this.saldoNuevo = saldoNuevo;
    }
    
    public Date getFechaTransaccion() {
        return fechaTransaccion;
    }
    
    public void setFechaTransaccion(Date fechaTransaccion) {
        this.fechaTransaccion = fechaTransaccion;
    }
    
    public String getNumeroCuenta() {
        return numeroCuenta;
    }
    
    public void setNumeroCuenta(String numeroCuenta) {
        this.numeroCuenta = numeroCuenta;
    }
    
    public Cuenta getCuenta() {
        return cuenta;
    }
    
    public void setCuenta(Cuenta cuenta) {
        this.cuenta = cuenta;
    }
}
