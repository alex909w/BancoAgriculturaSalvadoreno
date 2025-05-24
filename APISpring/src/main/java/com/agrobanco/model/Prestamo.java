package com.agrobanco.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Min;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "prestamos")
public class Prestamo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @NotBlank(message = "El número de préstamo es requerido")
    @Size(max = 20, message = "El número de préstamo no puede exceder 20 caracteres")
    @Column(name = "numero_prestamo", nullable = false, unique = true)
    private String numeroPrestamo;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Usuario cliente;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tipo_prestamo_id", nullable = false)
    private TipoPrestamo tipoPrestamo;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cuenta_vinculada_id", nullable = false)
    private Cuenta cuentaVinculada;
    
    @DecimalMin(value = "0.01", message = "El monto solicitado debe ser mayor que 0")
    @Column(name = "monto_solicitado", nullable = false, precision = 12, scale = 2)
    private BigDecimal montoSolicitado;
    
    @Column(name = "monto_aprobado", precision = 12, scale = 2)
    private BigDecimal montoAprobado;
    
    @DecimalMin(value = "0.0001", message = "La tasa de interés debe ser mayor que 0")
    @Column(name = "tasa_interes", nullable = false, precision = 5, scale = 4)
    private BigDecimal tasaInteres;
    
    @Min(value = 1, message = "El plazo debe ser al menos 1 mes")
    @Column(name = "plazo_meses", nullable = false)
    private Integer plazoMeses;
    
    @Column(name = "cuota_mensual", precision = 10, scale = 2)
    private BigDecimal cuotaMensual;
    
    @Column(name = "saldo_pendiente", precision = 12, scale = 2)
    private BigDecimal saldoPendiente;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPrestamo estado = EstadoPrestamo.solicitado;
    
    @Column(name = "tiene_seguro_vida")
    private Boolean tieneSeguroVida = false;
    
    @Column(name = "cobros_automaticos")
    private Boolean cobrosAutomaticos = false;
    
    @Column(name = "fecha_solicitud", nullable = false)
    private LocalDate fechaSolicitud;
    
    @Column(name = "fecha_aprobacion")
    private LocalDate fechaAprobacion;
    
    @Column(name = "fecha_desembolso")
    private LocalDate fechaDesembolso;
    
    @Column(name = "fecha_vencimiento")
    private LocalDate fechaVencimiento;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cajero_id")
    private Usuario cajero;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gerente_aprobador_id")
    private Usuario gerenteAprobador;
    
    @Column(columnDefinition = "TEXT")
    private String observaciones;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Enums
    public enum EstadoPrestamo {
        solicitado, en_revision, aprobado, rechazado, desembolsado, pagado, vencido
    }
    
    // Constructores
    public Prestamo() {}
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (fechaSolicitud == null) {
            fechaSolicitud = LocalDate.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getNumeroPrestamo() { return numeroPrestamo; }
    public void setNumeroPrestamo(String numeroPrestamo) { this.numeroPrestamo = numeroPrestamo; }
    
    public Usuario getCliente() { return cliente; }
    public void setCliente(Usuario cliente) { this.cliente = cliente; }
    
    public TipoPrestamo getTipoPrestamo() { return tipoPrestamo; }
    public void setTipoPrestamo(TipoPrestamo tipoPrestamo) { this.tipoPrestamo = tipoPrestamo; }
    
    public Cuenta getCuentaVinculada() { return cuentaVinculada; }
    public void setCuentaVinculada(Cuenta cuentaVinculada) { this.cuentaVinculada = cuentaVinculada; }
    
    public BigDecimal getMontoSolicitado() { return montoSolicitado; }
    public void setMontoSolicitado(BigDecimal montoSolicitado) { this.montoSolicitado = montoSolicitado; }
    
    public BigDecimal getMontoAprobado() { return montoAprobado; }
    public void setMontoAprobado(BigDecimal montoAprobado) { this.montoAprobado = montoAprobado; }
    
    public BigDecimal getTasaInteres() { return tasaInteres; }
    public void setTasaInteres(BigDecimal tasaInteres) { this.tasaInteres = tasaInteres; }
    
    public Integer getPlazoMeses() { return plazoMeses; }
    public void setPlazoMeses(Integer plazoMeses) { this.plazoMeses = plazoMeses; }
    
    public BigDecimal getCuotaMensual() { return cuotaMensual; }
    public void setCuotaMensual(BigDecimal cuotaMensual) { this.cuotaMensual = cuotaMensual; }
    
    public BigDecimal getSaldoPendiente() { return saldoPendiente; }
    public void setSaldoPendiente(BigDecimal saldoPendiente) { this.saldoPendiente = saldoPendiente; }
    
    public EstadoPrestamo getEstado() { return estado; }
    public void setEstado(EstadoPrestamo estado) { this.estado = estado; }
    
    public Boolean getTieneSeguroVida() { return tieneSeguroVida; }
    public void setTieneSeguroVida(Boolean tieneSeguroVida) { this.tieneSeguroVida = tieneSeguroVida; }
    
    public Boolean getCobrosAutomaticos() { return cobrosAutomaticos; }
    public void setCobrosAutomaticos(Boolean cobrosAutomaticos) { this.cobrosAutomaticos = cobrosAutomaticos; }
    
    public LocalDate getFechaSolicitud() { return fechaSolicitud; }
    public void setFechaSolicitud(LocalDate fechaSolicitud) { this.fechaSolicitud = fechaSolicitud; }
    
    public LocalDate getFechaAprobacion() { return fechaAprobacion; }
    public void setFechaAprobacion(LocalDate fechaAprobacion) { this.fechaAprobacion = fechaAprobacion; }
    
    public LocalDate getFechaDesembolso() { return fechaDesembolso; }
    public void setFechaDesembolso(LocalDate fechaDesembolso) { this.fechaDesembolso = fechaDesembolso; }
    
    public LocalDate getFechaVencimiento() { return fechaVencimiento; }
    public void setFechaVencimiento(LocalDate fechaVencimiento) { this.fechaVencimiento = fechaVencimiento; }
    
    public Usuario getCajero() { return cajero; }
    public void setCajero(Usuario cajero) { this.cajero = cajero; }
    
    public Usuario getGerenteAprobador() { return gerenteAprobador; }
    public void setGerenteAprobador(Usuario gerenteAprobador) { this.gerenteAprobador = gerenteAprobador; }
    
    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
