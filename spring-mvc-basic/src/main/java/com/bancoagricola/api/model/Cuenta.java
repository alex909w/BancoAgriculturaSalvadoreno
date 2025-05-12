package com.bancoagricola.api.model;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cuenta")
public class Cuenta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cuenta")
    private Integer idCuenta;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;
    
    @Column(name = "numero_cuenta")
    @Size(max = 10, message = "El número de cuenta debe tener máximo 10 caracteres")
    private String numeroCuenta;
    
    @Column(name = "saldo")
    private BigDecimal saldo;
    
    @OneToMany(mappedBy = "cuenta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Movimiento> movimientos = new ArrayList<>();
    
    public Cuenta() {
    }
    
    public Cuenta(Cliente cliente, String numeroCuenta, BigDecimal saldo) {
        this.cliente = cliente;
        this.numeroCuenta = numeroCuenta;
        this.saldo = saldo;
    }
    
    public Integer getIdCuenta() {
        return idCuenta;
    }
    
    public void setIdCuenta(Integer idCuenta) {
        this.idCuenta = idCuenta;
    }
    
    public Cliente getCliente() {
        return cliente;
    }
    
    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }
    
    public String getNumeroCuenta() {
        return numeroCuenta;
    }
    
    public void setNumeroCuenta(String numeroCuenta) {
        this.numeroCuenta = numeroCuenta;
    }
    
    public BigDecimal getSaldo() {
        return saldo;
    }
    
    public void setSaldo(BigDecimal saldo) {
        this.saldo = saldo;
    }
    
    public List<Movimiento> getMovimientos() {
        return movimientos;
    }
    
    public void setMovimientos(List<Movimiento> movimientos) {
        this.movimientos = movimientos;
    }
}
