package com.bancoagricola.api.controller;

import com.bancoagricola.api.model.Movimiento;
import com.bancoagricola.api.service.MovimientoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/movimientos")
public class MovimientoController {

    private final MovimientoService movimientoService;

    @Autowired
    public MovimientoController(MovimientoService movimientoService) {
        this.movimientoService = movimientoService;
    }

    @GetMapping
    public ResponseEntity<List<Movimiento>> getAllMovimientos() {
        List<Movimiento> movimientos = movimientoService.findAll();
        return new ResponseEntity<>(movimientos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Movimiento> getMovimientoById(@PathVariable Integer id) {
        Movimiento movimiento = movimientoService.findById(id);
        return new ResponseEntity<>(movimiento, HttpStatus.OK);
    }

    @GetMapping("/cuenta/{idCuenta}")
    public ResponseEntity<List<Movimiento>> getMovimientosByCuentaId(@PathVariable Integer idCuenta) {
        List<Movimiento> movimientos = movimientoService.findByCuentaId(idCuenta);
        return new ResponseEntity<>(movimientos, HttpStatus.OK);
    }
    
    @GetMapping("/fechas")
    public ResponseEntity<List<Movimiento>> getMovimientosByFechas(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date fechaInicio,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date fechaFin) {
        List<Movimiento> movimientos = movimientoService.findByFechas(fechaInicio, fechaFin);
        return new ResponseEntity<>(movimientos, HttpStatus.OK);
    }
    
    @GetMapping("/tipo/{tipoMovimiento}")
    public ResponseEntity<List<Movimiento>> getMovimientosByTipo(@PathVariable String tipoMovimiento) {
        List<Movimiento> movimientos = movimientoService.findByTipoMovimiento(tipoMovimiento);
        return new ResponseEntity<>(movimientos, HttpStatus.OK);
    }

    @PostMapping("/deposito")
    public ResponseEntity<Movimiento> realizarDeposito(@RequestBody Map<String, Object> request) {
        Integer idCuenta = Integer.valueOf(request.get("idCuenta").toString());
        BigDecimal monto = new BigDecimal(request.get("monto").toString());
        
        Movimiento movimiento = movimientoService.realizarDeposito(idCuenta, monto);
        return new ResponseEntity<>(movimiento, HttpStatus.CREATED);
    }

    @PostMapping("/retiro")
    public ResponseEntity<Movimiento> realizarRetiro(@RequestBody Map<String, Object> request) {
        Integer idCuenta = Integer.valueOf(request.get("idCuenta").toString());
        BigDecimal monto = new BigDecimal(request.get("monto").toString());
        
        Movimiento movimiento = movimientoService.realizarRetiro(idCuenta, monto);
        return new ResponseEntity<>(movimiento, HttpStatus.CREATED);
    }
    
    @PostMapping("/transferencia")
    public ResponseEntity<Movimiento> realizarTransferencia(@RequestBody Map<String, Object> request) {
        Integer idCuentaOrigen = Integer.valueOf(request.get("idCuentaOrigen").toString());
        Integer idCuentaDestino = Integer.valueOf(request.get("idCuentaDestino").toString());
        BigDecimal monto = new BigDecimal(request.get("monto").toString());
        
        Movimiento movimiento = movimientoService.realizarTransferencia(idCuentaOrigen, idCuentaDestino, monto);
        return new ResponseEntity<>(movimiento, HttpStatus.CREATED);
    }
}
