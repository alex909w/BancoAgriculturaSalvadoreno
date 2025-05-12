package com.bancoagricola.api.model;

import java.math.BigDecimal;
import java.util.Date;

public class PrestamoAgricola {
    private Long id;
    private Long clienteId;
    private String numeroPrestamo;
    private BigDecimal monto;
    private BigDecimal tasaInteres;
    private Integer plazoMeses;
    private Date fechaAprobacion;
    private Date fechaVencimiento;
    private String estado; // SOLICITADO, APROBADO, RECHAZADO, PAGADO
    private String tipoCultivo; // MAÍZ, FRIJOL, CAFÉ, ETC.
    private BigDecimal hectareas;
    private String ubicacionTerreno;

    public PrestamoAgricola() {
    }

    public PrestamoAgricola(Long id, Long clienteId, String numeroPrestamo, BigDecimal monto, 
                           BigDecimal tasaInteres, Integer plazoMeses, Date fechaAprobacion, 
                           Date fechaVencimiento, String estado, String tipoCultivo, 
                           BigDecimal hectareas, String ubicacionTerreno) {
        this.id = id;
        this.clienteId = clienteId;
        this.numeroPrestamo = numeroPrestamo;
        this.monto = monto;
        this.tasaInteres = tasaInteres;
        this.plazoMeses = plazoMeses;
        this.fechaAprobacion = fechaAprobacion;
        this.fechaVencimiento = fechaVencimiento;
        this.estado = estado;
        this.tipoCultivo = tipoCultivo;
        this.hectareas = hectareas;
        this.ubicacionTerreno = ubicacionTerreno;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public String getNumeroPrestamo() {
        return numeroPrestamo;
    }

    public void setNumeroPrestamo(String numeroPrestamo) {
        this.numeroPrestamo = numeroPrestamo;
    }

    public BigDecimal getMonto() {
        return monto;
    }

    public void setMonto(BigDecimal monto) {
        this.monto = monto;
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

    public Date getFechaAprobacion() {
        return fechaAprobacion;
    }

    public void setFechaAprobacion(Date fechaAprobacion) {
        this.fechaAprobacion = fechaAprobacion;
    }

    public Date getFechaVencimiento() {
        return fechaVencimiento;
    }

    public void setFechaVencimiento(Date fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getTipoCultivo() {
        return tipoCultivo;
    }

    public void setTipoCultivo(String tipoCultivo) {
        this.tipoCultivo = tipoCultivo;
    }

    public BigDecimal getHectareas() {
        return hectareas;
    }

    public void setHectareas(BigDecimal hectareas) {
        this.hectareas = hectareas;
    }

    public String getUbicacionTerreno() {
        return ubicacionTerreno;
    }

    public void setUbicacionTerreno(String ubicacionTerreno) {
        this.ubicacionTerreno = ubicacionTerreno;
    }
}
