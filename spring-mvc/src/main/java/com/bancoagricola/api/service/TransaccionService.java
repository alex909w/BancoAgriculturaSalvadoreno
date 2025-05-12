package com.bancoagricola.api.service;

import com.bancoagricola.api.exception.BadRequestException;
import com.bancoagricola.api.exception.ResourceNotFoundException;
import com.bancoagricola.api.model.Cuenta;
import com.bancoagricola.api.model.Movimiento;
import com.bancoagricola.api.repository.CuentaRepository;
import com.bancoagricola.api.repository.MovimientoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Service
public class TransaccionService {
    
    private final MovimientoRepository movimientoRepository;
    private final CuentaRepository cuentaRepository;
    
    @Autowired
    public TransaccionService(MovimientoRepository movimientoRepository, CuentaRepository cuentaRepository) {
        this.movimientoRepository = movimientoRepository;
        this.cuentaRepository = cuentaRepository;
    }
    
    @Transactional(readOnly = true)
    public List<Movimiento> findAll() {
        return movimientoRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Movimiento findById(Integer id) {
        return movimientoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movimiento", "id", id));
    }
    
    @Transactional(readOnly = true)
    public List<Movimiento> findByNumeroCuenta(String numeroCuenta) {
        Cuenta cuenta = cuentaRepository.findByNumeroCuenta(numeroCuenta)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta", "numeroCuenta", numeroCuenta));
        return movimientoRepository.findByCuentaIdCuenta(cuenta.getIdCuenta());
    }
    
    @Transactional
    public Movimiento realizarDeposito(String numeroCuenta, BigDecimal monto) {
        if (monto.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("El monto debe ser mayor que cero");
        }
        
        Cuenta cuenta = cuentaRepository.findByNumeroCuenta(numeroCuenta)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta", "numeroCuenta", numeroCuenta));
        
        // Ya no verificamos si la cuenta está activa porque no tenemos ese campo en el nuevo esquema
        
        BigDecimal saldoAnterior = cuenta.getSaldo();
        BigDecimal saldoNuevo = saldoAnterior.add(monto);
        
        cuenta.setSaldo(saldoNuevo);
        cuentaRepository.save(cuenta);
        
        Movimiento movimiento = new Movimiento();
        movimiento.setCuenta(cuenta);
        movimiento.setTipoMovimiento("DEPOSITO");
        movimiento.setMonto(monto);
        movimiento.setFechaHora(new Date());
        movimiento.setCuentaDestino(cuenta.getIdCuenta());
        
        return movimientoRepository.save(movimiento);
    }
    
    @Transactional
    public Movimiento realizarRetiro(String numeroCuenta, BigDecimal monto) {
        if (monto.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("El monto debe ser mayor que cero");
        }
        
        Cuenta cuenta = cuentaRepository.findByNumeroCuenta(numeroCuenta)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta", "numeroCuenta", numeroCuenta));
        
        // Ya no verificamos si la cuenta está activa porque no tenemos ese campo en el nuevo esquema
        
        BigDecimal saldoAnterior = cuenta.getSaldo();
        
        if (saldoAnterior.compareTo(monto) < 0) {
            throw new BadRequestException("Saldo insuficiente");
        }
        
        BigDecimal saldoNuevo = saldoAnterior.subtract(monto);
        
        cuenta.setSaldo(saldoNuevo);
        cuentaRepository.save(cuenta);
        
        Movimiento movimiento = new Movimiento();
        movimiento.setCuenta(cuenta);
        movimiento.setTipoMovimiento("RETIRO");
        movimiento.setMonto(monto);
        movimiento.setFechaHora(new Date());
        movimiento.setCuentaOrigen(cuenta.getIdCuenta());
        
        return movimientoRepository.save(movimiento);
    }
    
    @Transactional
    public Movimiento realizarTransferencia(String numeroCuentaOrigen, String numeroCuentaDestino, BigDecimal monto) {
        if (monto.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("El monto debe ser mayor que cero");
        }
        
        if (numeroCuentaOrigen.equals(numeroCuentaDestino)) {
            throw new BadRequestException("Las cuentas de origen y destino no pueden ser iguales");
        }
        
        Cuenta cuentaOrigen = cuentaRepository.findByNumeroCuenta(numeroCuentaOrigen)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta", "numeroCuenta", numeroCuentaOrigen));
        
        Cuenta cuentaDestino = cuentaRepository.findByNumeroCuenta(numeroCuentaDestino)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta", "numeroCuenta", numeroCuentaDestino));
        
        // Ya no verificamos si las cuentas están activas porque no tenemos ese campo en el nuevo esquema
        
        BigDecimal saldoOrigen = cuentaOrigen.getSaldo();
        
        if (saldoOrigen.compareTo(monto) < 0) {
            throw new BadRequestException("Saldo insuficiente en la cuenta de origen");
        }
        
        // Actualizar saldos
        cuentaOrigen.setSaldo(saldoOrigen.subtract(monto));
        cuentaDestino.setSaldo(cuentaDestino.getSaldo().add(monto));
        
        cuentaRepository.save(cuentaOrigen);
        cuentaRepository.save(cuentaDestino);
        
        // Registrar movimiento
        Movimiento movimiento = new Movimiento();
        movimiento.setCuenta(cuentaOrigen);
        movimiento.setTipoMovimiento("TRANSFER");
        movimiento.setMonto(monto);
        movimiento.setFechaHora(new Date());
        movimiento.setCuentaOrigen(cuentaOrigen.getIdCuenta());
        movimiento.setCuentaDestino(cuentaDestino.getIdCuenta());
        
        return movimientoRepository.save(movimiento);
    }
}
