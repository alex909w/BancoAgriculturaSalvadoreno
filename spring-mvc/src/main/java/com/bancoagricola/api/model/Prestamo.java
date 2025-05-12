package com.bancoagricola.api.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import javax.persistence.*;
import javax.validation.constraints.Size;
import java.math.BigDecimal;

@Entity
@Table(name = "prestamo")
public class Prestamo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_prestamo")
    private Integer idPrestamo;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cliente")
    @JsonBackReference(value="cliente-prestamo")
    private Cliente cliente;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cajero")
    @JsonBackReference(value="empleado-prestamo")
    private Empleado cajero;
    
    @Column(name = "monto_prestamo")
    private BigDecimal montoPrestamo;
    
    @Column(name = "tasa_interes")
    private BigDecimal tasaInteres;
    
    @Column(name = "plazo_meses")
    private Integer plazoMeses;
    
    @Column(name = "cuota_mensual")
    private BigDecimal cuotaMensual;
    
    @Column(name = "estado_prestamo")
    @Size(max = 50, message = "El estado del préstamo debe tener máximo 50 caracteres")
    private String estadoPrestamo;
    
    public Prestamo() {
    }
    
    public Prestamo(Cliente cliente, Empleado cajero, BigDecimal montoPrestamo, BigDecimal tasaInteres, Integer plazoMeses, BigDecimal cuotaMensual, String estadoPrestamo) {
        this.cliente = cliente;
        this.cajero = cajero;
        this.montoPrestamo = montoPrestamo;
        this.tasaInteres = tasaInteres;
        this.plazoMeses = plazoMeses;
        this.cuotaMensual = cuotaMensual;
        this.estadoPrestamo = estadoPrestamo;
    }
    
    public Integer getIdPrestamo() {
        return idPrestamo;
    }
    
    public void setIdPrestamo(Integer idPrestamo) {
        this.idPrestamo = idPrestamo;
    }
    
    public Cliente getCliente() {
        return cliente;
    }
    
    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }
    
    public Empleado getCajero() {
        return cajero;
    }
    
    public void setCajero(Empleado cajero) {
        this.cajero = cajero;
    }
    
    public BigDecimal getMontoPrestamo() {
        return montoPrestamo;
    }
    
    public void setMontoPrestamo(BigDecimal montoPrestamo) {
        this.montoPrestamo = montoPrestamo;
    }
    
    public BigDecimal getTasaInteres() {
        return tasaInteres;
    }
    
    public void setTasaInteres(BigDecimal tasaInteres) {
        this.tasaInteres = tasaInteres;
    }
    
    public Integer getPlazoMeses() {
        return plazoMeses;
    }
    
    public void setPlazoMeses(Integer plazoMeses) {
        this.plazoMeses = plazoMeses;
    }
    
    public BigDecimal getCuotaMensual() {
        return cuotaMensual;
    }
    
    public void setCuotaMensual(BigDecimal cuotaMensual) {
        this.cuotaMensual = cuotaMensual;
    }
    
    public String getEstadoPrestamo() {
        return estadoPrestamo;
    }
    
    public void setEstadoPrestamo(String estadoPrestamo) {
        this.estadoPrestamo = estadoPrestamo;
    }
}
