package com.bancoagricola.api.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "cuenta")
public class Cuenta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cuenta")
    private Integer idCuenta;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;
    
    @NotBlank(message = "El número de cuenta es requerido")
    @Size(max = 10, message = "El número de cuenta no puede exceder 10 caracteres")
    @Column(name = "numero_cuenta", unique = true)
    private String numeroCuenta;
    
    @DecimalMin(value = "0.0", message = "El saldo no puede ser negativo")
    @Column(name = "saldo", precision = 10, scale = 2)
    private BigDecimal saldo = BigDecimal.ZERO;
    
    @OneToMany(mappedBy = "cuenta", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Movimiento> movimientos;
    
    // Constructores
    public Cuenta() {}
    
    public Cuenta(Cliente cliente, String numeroCuenta, BigDecimal saldo) {
        this.cliente = cliente;
        this.numeroCuenta = numeroCuenta;
        this.saldo = saldo;
    }
    
    // Getters y Setters
    public Integer getIdCuenta() { return idCuenta; }
    public void setIdCuenta(Integer idCuenta) { this.idCuenta = idCuenta; }
    
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
    
    public String getNumeroCuenta() { return numeroCuenta; }
    public void setNumeroCuenta(String numeroCuenta) { this.numeroCuenta = numeroCuenta; }
    
    public BigDecimal getSaldo() { return saldo; }
    public void setSaldo(BigDecimal saldo) { this.saldo = saldo; }
    
    public List<Movimiento> getMovimientos() { return movimientos; }
    public void setMovimientos(List<Movimiento> movimientos) { this.movimientos = movimientos; }
}
