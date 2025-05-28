package com.agrobanco.service;

import com.agrobanco.model.Transaccion;
import com.agrobanco.model.Cuenta;
import com.agrobanco.model.TipoTransaccion;
import com.agrobanco.repository.TransaccionRepository;
import com.agrobanco.repository.CuentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class TransaccionService {
    
    @Autowired
    private TransaccionRepository transaccionRepository;
    
    @Autowired
    private CuentaRepository cuentaRepository;
    
    @Autowired
    private TipoTransaccionService tipoTransaccionService;    @Transactional(readOnly = true)
    public List<Transaccion> findAll() {
        List<Transaccion> transacciones = transaccionRepository.findAll();
        // Inicializar relaciones lazy para evitar LazyInitializationException
        for (Transaccion transaccion : transacciones) {
            if (transaccion.getTipoTransaccion() != null) {
                transaccion.getTipoTransaccion().getNombre(); // Forzar carga
            }
            if (transaccion.getCuentaOrigen() != null) {
                transaccion.getCuentaOrigen().getNumeroCuenta(); // Forzar carga
            }
            if (transaccion.getCuentaDestino() != null) {
                transaccion.getCuentaDestino().getNumeroCuenta(); // Forzar carga
            }            if (transaccion.getCajero() != null) {
                transaccion.getCajero().getNombreCompleto(); // Forzar carga
            }
            if (transaccion.getSucursal() != null) {
                transaccion.getSucursal().getNombre(); // Forzar carga
            }
        }
        return transacciones;
    }
    
    @Transactional(readOnly = true)
    public Optional<Transaccion> findById(Integer id) {
        return transaccionRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public Optional<Transaccion> findByNumeroTransaccion(String numeroTransaccion) {
        return transaccionRepository.findByNumeroTransaccion(numeroTransaccion);
    }
    
    @Transactional(readOnly = true)
    public List<Transaccion> findByCuentaId(Integer cuentaId) {
        return transaccionRepository.findByCuentaId(cuentaId);
    }
    
    @Transactional(readOnly = true)
    public List<Transaccion> findByEstado(Transaccion.EstadoTransaccion estado) {
        return transaccionRepository.findByEstado(estado);
    }
    
    @Transactional(readOnly = true)
    public List<Transaccion> findBySucursalId(Integer sucursalId) {
        return transaccionRepository.findBySucursalId(sucursalId);
    }
      @Transactional
    public Transaccion realizarDeposito(Integer cuentaId, BigDecimal monto, Integer cajeroId, Integer sucursalId, String descripcion) {
        // Validar cuenta
        Cuenta cuenta = cuentaRepository.findById(cuentaId)
                .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));
        
        if (cuenta.getEstado() != Cuenta.EstadoCuenta.activa) {
            throw new RuntimeException("La cuenta no está activa");
        }
        
        // Obtener tipo de transacción para depósito
        TipoTransaccion tipoDeposito = tipoTransaccionService.findByNombre("Depósito")
                .orElseThrow(() -> new RuntimeException("Tipo de transacción 'Depósito' no encontrado"));
        
        // Crear transacción
        Transaccion transaccion = new Transaccion();
        transaccion.setNumeroTransaccion(generarNumeroTransaccion());
        transaccion.setTipoTransaccion(tipoDeposito);
        transaccion.setCuentaOrigen(cuenta);
        transaccion.setMonto(monto);
        transaccion.setComision(BigDecimal.ZERO);
        transaccion.setDescripcion(descripcion != null ? descripcion : "Depósito en efectivo");
        transaccion.setEstado(Transaccion.EstadoTransaccion.completada);
        transaccion.setFechaTransaccion(LocalDateTime.now());
        transaccion.setFechaProcesamiento(LocalDateTime.now());
        
        // Actualizar saldo de la cuenta
        cuenta.setSaldo(cuenta.getSaldo().add(monto));
        cuentaRepository.save(cuenta);
        
        return transaccionRepository.save(transaccion);
    }
      @Transactional
    public Transaccion realizarRetiro(Integer cuentaId, BigDecimal monto, Integer cajeroId, Integer sucursalId, String descripcion) {
        // Validar cuenta
        Cuenta cuenta = cuentaRepository.findById(cuentaId)
                .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));
        
        if (cuenta.getEstado() != Cuenta.EstadoCuenta.activa) {
            throw new RuntimeException("La cuenta no está activa");
        }
        
        // Validar saldo suficiente
        if (cuenta.getSaldo().compareTo(monto) < 0) {
            throw new RuntimeException("Saldo insuficiente");
        }
        
        // Obtener tipo de transacción para retiro
        TipoTransaccion tipoRetiro = tipoTransaccionService.findByNombre("Retiro")
                .orElseThrow(() -> new RuntimeException("Tipo de transacción 'Retiro' no encontrado"));
        
        // Crear transacción
        Transaccion transaccion = new Transaccion();
        transaccion.setNumeroTransaccion(generarNumeroTransaccion());
        transaccion.setTipoTransaccion(tipoRetiro);
        transaccion.setCuentaOrigen(cuenta);
        transaccion.setMonto(monto);
        transaccion.setComision(BigDecimal.valueOf(1.00)); // Comisión por retiro
        transaccion.setDescripcion(descripcion != null ? descripcion : "Retiro en efectivo");
        transaccion.setEstado(Transaccion.EstadoTransaccion.completada);
        transaccion.setFechaTransaccion(LocalDateTime.now());
        transaccion.setFechaProcesamiento(LocalDateTime.now());
        
        // Actualizar saldo de la cuenta (monto + comisión)
        BigDecimal totalDebitado = monto.add(transaccion.getComision());
        cuenta.setSaldo(cuenta.getSaldo().subtract(totalDebitado));
        cuentaRepository.save(cuenta);
        
        return transaccionRepository.save(transaccion);
    }
      @Transactional
    public Transaccion realizarTransferencia(Integer cuentaOrigenId, Integer cuentaDestinoId, BigDecimal monto, Integer cajeroId, Integer sucursalId, String descripcion) {
        // Validar cuenta origen
        Cuenta cuentaOrigen = cuentaRepository.findById(cuentaOrigenId)
                .orElseThrow(() -> new RuntimeException("Cuenta origen no encontrada"));
        
        // Validar cuenta destino
        Cuenta cuentaDestino = cuentaRepository.findById(cuentaDestinoId)
                .orElseThrow(() -> new RuntimeException("Cuenta destino no encontrada"));
        
        if (cuentaOrigen.getEstado() != Cuenta.EstadoCuenta.activa) {
            throw new RuntimeException("La cuenta origen no está activa");
        }
        
        if (cuentaDestino.getEstado() != Cuenta.EstadoCuenta.activa) {
            throw new RuntimeException("La cuenta destino no está activa");
        }
        
        // Validar saldo suficiente
        BigDecimal comision = BigDecimal.valueOf(2.50); // Comisión por transferencia
        BigDecimal totalDebitado = monto.add(comision);
        
        if (cuentaOrigen.getSaldo().compareTo(totalDebitado) < 0) {
            throw new RuntimeException("Saldo insuficiente para realizar la transferencia");
        }
        
        // Obtener tipo de transacción para transferencia
        TipoTransaccion tipoTransferencia = tipoTransaccionService.findByNombre("Transferencia")
                .orElseThrow(() -> new RuntimeException("Tipo de transacción 'Transferencia' no encontrado"));
        
        // Crear transacción
        Transaccion transaccion = new Transaccion();
        transaccion.setNumeroTransaccion(generarNumeroTransaccion());
        transaccion.setTipoTransaccion(tipoTransferencia);
        transaccion.setCuentaOrigen(cuentaOrigen);
        transaccion.setCuentaDestino(cuentaDestino);
        transaccion.setMonto(monto);
        transaccion.setComision(comision);
        transaccion.setDescripcion(descripcion != null ? descripcion : "Transferencia entre cuentas");
        transaccion.setEstado(Transaccion.EstadoTransaccion.completada);
        transaccion.setFechaTransaccion(LocalDateTime.now());
        transaccion.setFechaProcesamiento(LocalDateTime.now());
        
        // Actualizar saldos
        cuentaOrigen.setSaldo(cuentaOrigen.getSaldo().subtract(totalDebitado));
        cuentaDestino.setSaldo(cuentaDestino.getSaldo().add(monto));
        
        cuentaRepository.save(cuentaOrigen);
        cuentaRepository.save(cuentaDestino);
        
        return transaccionRepository.save(transaccion);
    }
    
    private String generarNumeroTransaccion() {
        String numeroTransaccion;
        do {
            // Generar número de transacción: TXN + timestamp + random
            long timestamp = System.currentTimeMillis();
            Random random = new Random();
            int randomNum = random.nextInt(9999);
            numeroTransaccion = String.format("TXN%d%04d", timestamp, randomNum);
        } while (transaccionRepository.findByNumeroTransaccion(numeroTransaccion).isPresent());
        
        return numeroTransaccion;
    }
}
