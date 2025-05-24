package com.bancoagricola.api.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.DecimalMin;

import java.math.BigDecimal;

@Entity
@Table(name = "prestamo")
public class Prestamo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_prestamo")
    private Integer idPrestamo;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_cajero")
    private Empleado cajero;
    
    @NotNull(message = "El monto del préstamo es requerido")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor que 0")
    @Column(name = "monto_prestamo", precision = 10, scale = 2)
    private BigDecimal montoPrestamo;
    
    @NotNull(message = "La tasa de interés es requerida")
    @DecimalMin(value = "0.01", message = "La tasa de interés debe ser mayor que 0")
    @Column(name = "tasa_interes", precision = 10, scale = 2)
    private BigDecimal tasaInteres;
    
    @NotNull(message = "El plazo en meses es requerido")
    @Column(name = "plazo_meses")
    private Integer plazoMeses;
    
    @Column(name = "cuota_mensual", precision = 10, scale = 2)
    private BigDecimal cuotaMensual;
    
    @Column(name = "estado_prestamo")
    private String estadoPrestamo = "SOLICITADO";
    
    // Constructores
    public Prestamo() {}
    
    // Getters y Setters
    public Integer getIdPrestamo() { return idPrestamo; }
    public void setIdPrestamo(Integer idPrestamo) { this.idPrestamo = idPrestamo; }
    
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
    
    public Empleado getCajero() { return cajero; }
    public void setCajero(Empleado cajero) { this.cajero = cajero; }
    
    public BigDecimal getMontoPrestamo() { return montoPrestamo; }
    public void setMontoPrestamo(BigDecimal montoPrestamo) { this.montoPrestamo = montoPrestamo; }
    
    public BigDecimal getTasaInteres() { return tasaInteres; }
    public void setTasaInteres(BigDecimal tasaInteres) { this.tasaInteres = tasaInteres; }
    
    public Integer getPlazoMeses() { return plazoMeses; }
    public void setPlazoMeses(Integer plazoMeses) { this.plazoMeses = plazoMeses; }
    
    public BigDecimal getCuotaMensual() { return cuotaMensual; }
    public void setCuotaMensual(BigDecimal cuotaMensual) { this.cuotaMensual = cuotaMensual; }
    
    public String getEstadoPrestamo() { return estadoPrestamo; }
    public void setEstadoPrestamo(String estadoPrestamo) { this.estadoPrestamo = estadoPrestamo; }
}
