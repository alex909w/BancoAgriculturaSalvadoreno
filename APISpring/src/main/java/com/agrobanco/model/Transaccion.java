package com.agrobanco.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import javax.validation.constraints.DecimalMin;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transacciones")
public class Transaccion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @NotBlank(message = "El número de transacción es requerido")
    @Size(max = 30, message = "El número de transacción no puede exceder 30 caracteres")
    @Column(name = "numero_transaccion", nullable = false, unique = true)
    private String numeroTransaccion;    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_transaccion_id", nullable = false)
    @JsonIgnoreProperties({"transacciones"})
    private TipoTransaccion tipoTransaccion;    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cuenta_origen_id", nullable = false)
    @JsonIgnoreProperties({"transaccionesOrigen", "transaccionesDestino", "beneficiarios", "cliente"})
    private Cuenta cuentaOrigen;    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cuenta_destino_id")
    @JsonIgnoreProperties({"transaccionesOrigen", "transaccionesDestino", "beneficiarios", "cliente"})
    private Cuenta cuentaDestino;
    
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor que 0")
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal monto;
    
    @Column(precision = 8, scale = 2)
    private BigDecimal comision = BigDecimal.ZERO;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoTransaccion estado = EstadoTransaccion.pendiente;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cajero_id")
    @JsonIgnoreProperties({"cuentas", "prestamos", "password"})
    private Usuario cajero;
      @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sucursal_id", nullable = false)
    @JsonIgnoreProperties({"usuarios", "cuentas"})
    private Sucursal sucursal;
    
    @Column(name = "fecha_transaccion")
    private LocalDateTime fechaTransaccion;
    
    @Column(name = "fecha_procesamiento")
    private LocalDateTime fechaProcesamiento;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Enums
    public enum EstadoTransaccion {
        pendiente, completada, fallida, cancelada
    }
    
    // Constructores
    public Transaccion() {}
      @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (fechaTransaccion == null) {
            fechaTransaccion = LocalDateTime.now();
        }
        // Validación de sucursal
        if (sucursal == null || sucursal.getId() == null || sucursal.getId() <= 0) {
            throw new IllegalArgumentException("La transacción debe tener una sucursal válida");
        }
    }
    
    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getNumeroTransaccion() { return numeroTransaccion; }
    public void setNumeroTransaccion(String numeroTransaccion) { this.numeroTransaccion = numeroTransaccion; }
    
    public TipoTransaccion getTipoTransaccion() { return tipoTransaccion; }
    public void setTipoTransaccion(TipoTransaccion tipoTransaccion) { this.tipoTransaccion = tipoTransaccion; }
    
    public Cuenta getCuentaOrigen() { return cuentaOrigen; }
    public void setCuentaOrigen(Cuenta cuentaOrigen) { this.cuentaOrigen = cuentaOrigen; }
    
    public Cuenta getCuentaDestino() { return cuentaDestino; }
    public void setCuentaDestino(Cuenta cuentaDestino) { this.cuentaDestino = cuentaDestino; }
    
    public BigDecimal getMonto() { return monto; }
    public void setMonto(BigDecimal monto) { this.monto = monto; }
    
    public BigDecimal getComision() { return comision; }
    public void setComision(BigDecimal comision) { this.comision = comision; }
    
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    
    public EstadoTransaccion getEstado() { return estado; }
    public void setEstado(EstadoTransaccion estado) { this.estado = estado; }
    
    public Usuario getCajero() { return cajero; }
    public void setCajero(Usuario cajero) { this.cajero = cajero; }
    
    public Sucursal getSucursal() { return sucursal; }
    public void setSucursal(Sucursal sucursal) { this.sucursal = sucursal; }
    
    public LocalDateTime getFechaTransaccion() { return fechaTransaccion; }
    public void setFechaTransaccion(LocalDateTime fechaTransaccion) { this.fechaTransaccion = fechaTransaccion; }
    
    public LocalDateTime getFechaProcesamiento() { return fechaProcesamiento; }
    public void setFechaProcesamiento(LocalDateTime fechaProcesamiento) { this.fechaProcesamiento = fechaProcesamiento; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
