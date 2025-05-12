package com.bancoagricola.api.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import javax.persistence.*;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "movimiento")
public class Movimiento {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_movimiento")
    private Integer idMovimiento;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cuenta")
    @JsonBackReference(value="cuenta-movimiento")
    private Cuenta cuenta;
    
    @Column(name = "tipo_movimiento")
    @Size(max = 10, message = "El tipo de movimiento debe tener máximo 10 caracteres")
    private String tipoMovimiento;
    
    @Column(name = "monto")
    private BigDecimal monto;
    
    @Column(name = "fecha_hora")
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaHora;
    
    @Column(name = "cuenta_origen")
    private Integer cuentaOrigen;
    
    @Column(name = "cuenta_destino")
    private Integer cuentaDestino;
    
    public Movimiento() {
    }
    
    public Movimiento(Cuenta cuenta, String tipoMovimiento, BigDecimal monto, Date fechaHora, Integer cuentaOrigen, Integer cuentaDestino) {
        this.cuenta = cuenta;
        this.tipoMovimiento = tipoMovimiento;
        this.monto = monto;
        this.fechaHora = fechaHora;
        this.cuentaOrigen = cuentaOrigen;
        this.cuentaDestino = cuentaDestino;
    }
    
    public Integer getIdMovimiento() {
        return idMovimiento;
    }
    
    public void setIdMovimiento(Integer idMovimiento) {
        this.idMovimiento = idMovimiento;
    }
    
    public Cuenta getCuenta() {
        return cuenta;
    }
    
    public void setCuenta(Cuenta cuenta) {
        this.cuenta = cuenta;
    }
    
    public String getTipoMovimiento() {
        return tipoMovimiento;
    }
    
    public void setTipoMovimiento(String tipoMovimiento) {
        this.tipoMovimiento = tipoMovimiento;
    }
    
    public BigDecimal getMonto() {
        return monto;
    }
    
    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }
    
    public Date getFechaHora() {
        return fechaHora;
    }
    
    public void setFechaHora(Date fechaHora) {
        this.fechaHora = fechaHora;
    }
    
    public Integer getCuentaOrigen() {
        return cuentaOrigen;
    }
    
    public void setCuentaOrigen(Integer cuentaOrigen) {
        this.cuentaOrigen = cuentaOrigen;
    }
    
    public Integer getCuentaDestino() {
        return cuentaDestino;
    }
    
    public void setCuentaDestino(Integer cuentaDestino) {
        this.cuentaDestino = cuentaDestino;
    }
}
