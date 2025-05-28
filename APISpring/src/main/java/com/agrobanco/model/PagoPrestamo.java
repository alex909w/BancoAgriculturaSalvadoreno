package com.agrobanco.model;

import javax.persistence.*;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Min;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagos_prestamos")
public class PagoPrestamo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "prestamo_id", nullable = false)
    private Prestamo prestamo;
    
    @Min(value = 1, message = "El número de cuota debe ser mayor que 0")
    @Column(name = "numero_cuota", nullable = false)
    private Integer numeroCuota;
    
    @DecimalMin(value = "0.01", message = "El monto de la cuota debe ser mayor que 0")
    @Column(name = "monto_cuota", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoCuota;
    
    @DecimalMin(value = "0.00", message = "El monto del capital debe ser mayor o igual que 0")
    @Column(name = "monto_capital", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoCapital;
    
    @DecimalMin(value = "0.00", message = "El monto del interés debe ser mayor o igual que 0")
    @Column(name = "monto_interes", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoInteres;
    
    @Column(name = "fecha_vencimiento", nullable = false)
    private LocalDate fechaVencimiento;
    
    @Column(name = "fecha_pago")
    private LocalDate fechaPago;
    
    @Column(name = "monto_pagado", precision = 10, scale = 2)
    private BigDecimal montoPagado;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPago estado = EstadoPago.pendiente;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaccion_id")
    private Transaccion transaccion;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Enum
    public enum EstadoPago {
        pendiente, pagado, vencido
    }
    
    // Constructor
    public PagoPrestamo() {}
    
    public PagoPrestamo(Prestamo prestamo, Integer numeroCuota, BigDecimal montoCuota, 
                       BigDecimal montoCapital, BigDecimal montoInteres, LocalDate fechaVencimiento) {
        this.prestamo = prestamo;
        this.numeroCuota = numeroCuota;
        this.montoCuota = montoCuota;
        this.montoCapital = montoCapital;
        this.montoInteres = montoInteres;
        this.fechaVencimiento = fechaVencimiento;
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public Prestamo getPrestamo() { return prestamo; }
    public void setPrestamo(Prestamo prestamo) { this.prestamo = prestamo; }
    
    public Integer getNumeroCuota() { return numeroCuota; }
    public void setNumeroCuota(Integer numeroCuota) { this.numeroCuota = numeroCuota; }
    
    public BigDecimal getMontoCuota() { return montoCuota; }
    public void setMontoCuota(BigDecimal montoCuota) { this.montoCuota = montoCuota; }
    
    public BigDecimal getMontoCapital() { return montoCapital; }
    public void setMontoCapital(BigDecimal montoCapital) { this.montoCapital = montoCapital; }
    
    public BigDecimal getMontoInteres() { return montoInteres; }
    public void setMontoInteres(BigDecimal montoInteres) { this.montoInteres = montoInteres; }
    
    public LocalDate getFechaVencimiento() { return fechaVencimiento; }
    public void setFechaVencimiento(LocalDate fechaVencimiento) { this.fechaVencimiento = fechaVencimiento; }
    
    public LocalDate getFechaPago() { return fechaPago; }
    public void setFechaPago(LocalDate fechaPago) { this.fechaPago = fechaPago; }
    
    public BigDecimal getMontoPagado() { return montoPagado; }
    public void setMontoPagado(BigDecimal montoPagado) { this.montoPagado = montoPagado; }
    
    public EstadoPago getEstado() { return estado; }
    public void setEstado(EstadoPago estado) { this.estado = estado; }
    
    public Transaccion getTransaccion() { return transaccion; }
    public void setTransaccion(Transaccion transaccion) { this.transaccion = transaccion; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
