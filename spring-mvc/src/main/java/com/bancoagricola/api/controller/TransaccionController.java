package com.bancoagricola.api.controller;

import com.bancoagricola.api.model.Movimiento;
import com.bancoagricola.api.service.TransaccionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transacciones")
public class TransaccionController {

    private final TransaccionService transaccionService;

    @Autowired
    public TransaccionController(TransaccionService transaccionService) {
        this.transaccionService = transaccionService;
    }

    @GetMapping
    public ResponseEntity<List<Movimiento>> getAllTransacciones() {
        List<Movimiento> transacciones = transaccionService.findAll();
        return new ResponseEntity<>(transacciones, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Movimiento> getTransaccionById(@PathVariable Integer id) {
        Movimiento transaccion = transaccionService.findById(id);
        return new ResponseEntity<>(transaccion, HttpStatus.OK);
    }

    @GetMapping("/cuenta/{numeroCuenta}")
    public ResponseEntity<List<Movimiento>> getTransaccionesByNumeroCuenta(@PathVariable String numeroCuenta) {
        List<Movimiento> transacciones = transaccionService.findByNumeroCuenta(numeroCuenta);
        return new ResponseEntity<>(transacciones, HttpStatus.OK);
    }

    @PostMapping("/deposito")
    public ResponseEntity<Movimiento> realizarDeposito(@RequestBody Map<String, Object> request) {
        String numeroCuenta = (String) request.get("numeroCuenta");
        BigDecimal monto = new BigDecimal(request.get("monto").toString());
        
        Movimiento transaccion = transaccionService.realizarDeposito(numeroCuenta, monto);
        return new ResponseEntity<>(transaccion, HttpStatus.CREATED);
    }

    @PostMapping("/retiro")
    public ResponseEntity<Movimiento> realizarRetiro(@RequestBody Map<String, Object> request) {
        String numeroCuenta = (String) request.get("numeroCuenta");
        BigDecimal monto = new BigDecimal(request.get("monto").toString());
        
        Movimiento transaccion = transaccionService.realizarRetiro(numeroCuenta, monto);
        return new ResponseEntity<>(transaccion, HttpStatus.CREATED);
    }
    
    @PostMapping("/transferencia")
    public ResponseEntity<Movimiento> realizarTransferencia(@RequestBody Map<String, Object> request) {
        String numeroCuentaOrigen = (String) request.get("numeroCuentaOrigen");
        String numeroCuentaDestino = (String) request.get("numeroCuentaDestino");
        BigDecimal monto = new BigDecimal(request.get("monto").toString());
        
        Movimiento transaccion = transaccionService.realizarTransferencia(numeroCuentaOrigen, numeroCuentaDestino, monto);
        return new ResponseEntity<>(transaccion, HttpStatus.CREATED);
    }
}
