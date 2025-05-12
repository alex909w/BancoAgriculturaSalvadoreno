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
public class MovimientoService {
    
    private final MovimientoRepository movimientoRepository;
    private final CuentaRepository cuentaRepository;
    
    @Autowired
    public MovimientoService(MovimientoRepository movimientoRepository, CuentaRepository cuentaRepository) {
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
    public List<Movimiento> findByCuentaId(Integer idCuenta) {
        return movimientoRepository.findByCuentaIdCuenta(idCuenta);
    }
    
    @Transactional(readOnly = true)
    public List<Movimiento> findByFechas(Date fechaInicio, Date fechaFin) {
        return movimientoRepository.findByFechaHoraBetween(fechaInicio, fechaFin);
    }
    
    @Transactional(readOnly = true)
    public List<Movimiento> findByTipoMovimiento(String tipoMovimiento) {
        return movimientoRepository.findByTipoMovimiento(tipoMovimiento);
    }
    
    @Transactional
    public Movimiento realizarDeposito(Integer idCuenta, BigDecimal monto) {
        if (monto.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("El monto debe ser mayor que cero");
        }
        
        Cuenta cuenta = cuentaRepository.findById(idCuenta)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta", "id", idCuenta));
        
        BigDecimal saldoAnterior = cuenta.getSaldo();
        BigDecimal saldoNuevo = saldoAnterior.add(monto);
        
        cuenta.setSaldo(saldoNuevo);
        cuentaRepository.save(cuenta);
        
        Movimiento movimiento = new Movimiento();
        movimiento.setCuenta(cuenta);
        movimiento.setTipoMovimiento("DEPOSITO");
        movimiento.setMonto(monto);
        movimiento.setFechaHora(new Date());
        movimiento.setCuentaDestino(idCuenta);
        
        return movimientoRepository.save(movimiento);
    }
    
    @Transactional
    public Movimiento realizarRetiro(Integer idCuenta, BigDecimal monto) {
        if (monto.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("El monto debe ser mayor que cero");
        }
        
        Cuenta cuenta = cuentaRepository.findById(idCuenta)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta", "id", idCuenta));
        
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
        movimiento.setCuentaOrigen(idCuenta);
        
        return movimientoRepository.save(movimiento);
    }
    
    @Transactional
    public Movimiento realizarTransferencia(Integer idCuentaOrigen, Integer idCuentaDestino, BigDecimal monto) {
        if (monto.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("El monto debe ser mayor que cero");
        }
        
        if (idCuentaOrigen.equals(idCuentaDestino)) {
            throw new BadRequestException("Las cuentas de origen y destino no pueden ser iguales");
        }
        
        Cuenta cuentaOrigen = cuentaRepository.findById(idCuentaOrigen)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta", "id", idCuentaOrigen));
        
        Cuenta cuentaDestino = cuentaRepository.findById(idCuentaDestino)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta", "id", idCuentaDestino));
        
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
        movimiento.setCuentaOrigen(idCuentaOrigen);
        movimiento.setCuentaDestino(idCuentaDestino);
        
        return movimientoRepository.save(movimiento);
    }
}
