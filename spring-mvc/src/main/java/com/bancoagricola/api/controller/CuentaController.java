package com.bancoagricola.api.controller;

import com.bancoagricola.api.model.Cuenta;
import com.bancoagricola.api.service.CuentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/cuentas")
public class CuentaController {

    private final CuentaService cuentaService;

    @Autowired
    public CuentaController(CuentaService cuentaService) {
        this.cuentaService = cuentaService;
    }

    @GetMapping
    public ResponseEntity<List<Cuenta>> getAllCuentas() {
        List<Cuenta> cuentas = cuentaService.findAll();
        return new ResponseEntity<>(cuentas, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cuenta> getCuentaById(@PathVariable Integer id) {
        Cuenta cuenta = cuentaService.findById(id);
        return new ResponseEntity<>(cuenta, HttpStatus.OK);
    }
    
    @GetMapping("/numero/{numeroCuenta}")
    public ResponseEntity<Cuenta> getCuentaByNumeroCuenta(@PathVariable String numeroCuenta) {
        Cuenta cuenta = cuentaService.findByNumeroCuenta(numeroCuenta);
        return new ResponseEntity<>(cuenta, HttpStatus.OK);
    }

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<List<Cuenta>> getCuentasByClienteId(@PathVariable Integer idCliente) {
        List<Cuenta> cuentas = cuentaService.findByClienteId(idCliente);
        return new ResponseEntity<>(cuentas, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Cuenta> createCuenta(@Valid @RequestBody Cuenta cuenta) {
        Cuenta nuevaCuenta = cuentaService.save(cuenta);
        return new ResponseEntity<>(nuevaCuenta, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cuenta> updateCuenta(@PathVariable Integer id, @Valid @RequestBody Cuenta cuenta) {
        Cuenta cuentaActualizada = cuentaService.update(id, cuenta);
        return new ResponseEntity<>(cuentaActualizada, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCuenta(@PathVariable Integer id) {
        cuentaService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
