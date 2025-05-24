package com.agrobanco.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Min;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tipos_prestamo")
public class TipoPrestamo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @NotBlank(message = "El nombre es requerido")
    @Size(max = 50, message = "El nombre no puede exceder 50 caracteres")
    @Column(nullable = false, unique = true)
    private String nombre;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
    @DecimalMin(value = "0.0001", message = "La tasa de interés debe ser mayor que 0")
    @Column(name = "tasa_interes", nullable = false, precision = 5, scale = 4)
    private BigDecimal tasaInteres;
    
    @Min(value = 1, message = "El plazo máximo debe ser al menos 1 mes")
    @Column(name = "plazo_maximo_meses", nullable = false)
    private Integer plazoMaximoMeses;
    
    @DecimalMin(value = "0.01", message = "El monto mínimo debe ser mayor que 0")
    @Column(name = "monto_minimo", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoMinimo;
    
    @DecimalMin(value = "0.01", message = "El monto máximo debe ser mayor que 0")
    @Column(name = "monto_maximo", nullable = false, precision = 12, scale = 2)
    private BigDecimal montoMaximo;
    
    @Column(name = "requiere_garantia")
    private Boolean requiereGarantia = false;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "tipoPrestamo", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Prestamo> prestamos;
    
    // Constructores
    public TipoPrestamo() {}
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    
    public BigDecimal getTasaInteres() { return tasaInteres; }
    public void setTasaInteres(BigDecimal tasaInteres) { this.tasaInteres = tasaInteres; }
    
    public Integer getPlazoMaximoMeses() { return plazoMaximoMeses; }
    public void setPlazoMaximoMeses(Integer plazoMaximoMeses) { this.plazoMaximoMeses = plazoMaximoMeses; }
    
    public BigDecimal getMontoMinimo() { return montoMinimo; }
    public void setMontoMinimo(BigDecimal montoMinimo) { this.montoMinimo = montoMinimo; }
    
    public BigDecimal getMontoMaximo() { return montoMaximo; }
    public void setMontoMaximo(BigDecimal montoMaximo) { this.montoMaximo = montoMaximo; }
    
    public Boolean getRequiereGarantia() { return requiereGarantia; }
    public void setRequiereGarantia(Boolean requiereGarantia) { this.requiereGarantia = requiereGarantia; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public List<Prestamo> getPrestamos() { return prestamos; }
    public void setPrestamos(List<Prestamo> prestamos) { this.prestamos = prestamos; }
}
