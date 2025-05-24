package com.bancoagricola.api.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.DecimalMin;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "movimiento")
public class Movimiento {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_movimiento")
    private Integer idMovimiento;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_cuenta")
    private Cuenta cuenta;
    
    @NotNull(message = "El tipo de movimiento es requerido")
    @Column(name = "tipo_movimiento")
    private String tipoMovimiento;
    
    @NotNull(message = "El monto es requerido")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor que 0")
    @Column(name = "monto", precision = 10, scale = 2)
    private BigDecimal monto;
    
    @NotNull(message = "La fecha y hora son requeridas")
    @Column(name = "fecha_hora")
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaHora;
    
    @Column(name = "cuenta_origen")
    private Integer cuentaOrigen;
    
    @Column(name = "cuenta_destino")
    private Integer cuentaDestino;
    
    // Constructores
    public Movimiento() {}
    
    public Movimiento(Cuenta cuenta, String tipoMovimiento, BigDecimal monto, Date fechaHora) {
        this.cuenta = cuenta;
        this.tipoMovimiento = tipoMovimiento;
        this.monto = monto;
        this.fechaHora = fechaHora;
    }
    
    // Getters y Setters
    public Integer getIdMovimiento() { return idMovimiento; }
    public void setIdMovimiento(Integer idMovimiento) { this.idMovimiento = idMovimiento; }
    
    public Cuenta getCuenta() { return cuenta; }
    public void setCuenta(Cuenta cuenta) { this.cuenta = cuenta; }
    
    public String getTipoMovimiento() { return tipoMovimiento; }
    public void setTipoMovimiento(String tipoMovimiento) { this.tipoMovimiento = tipoMovimiento; }
    
    public BigDecimal getMonto() { return monto; }
    public void setMonto(BigDecimal monto) { this.monto = monto; }
    
    public Date getFechaHora() { return fechaHora; }
    public void setFechaHora(Date fechaHora) { this.fechaHora = fechaHora; }
    
    public Integer getCuentaOrigen() { return cuentaOrigen; }
    public void setCuentaOrigen(Integer cuentaOrigen) { this.cuentaOrigen = cuentaOrigen; }
    
    public Integer getCuentaDestino() { return cuentaDestino; }
    public void setCuentaDestino(Integer cuentaDestino) { this.cuentaDestino = cuentaDestino; }
}
