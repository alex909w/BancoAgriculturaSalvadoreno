package com.bancoagricola.api.controller;

import com.bancoagricola.api.model.PrestamoAgricola;
import com.bancoagricola.api.service.PrestamoAgricolaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prestamos-agricolas")
public class PrestamoAgricolaController {

    private final PrestamoAgricolaService prestamoService;

    @Autowired
    public PrestamoAgricolaController(PrestamoAgricolaService prestamoService) {
        this.prestamoService = prestamoService;
    }

    @GetMapping
    public ResponseEntity<List<PrestamoAgricola>> getAllPrestamos() {
        List<PrestamoAgricola> prestamos = prestamoService.findAll();
        return new ResponseEntity<>(prestamos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PrestamoAgricola> getPrestamoById(@PathVariable Long id) {
        PrestamoAgricola prestamo = prestamoService.findById(id);
        if (prestamo == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(prestamo, HttpStatus.OK);
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<PrestamoAgricola>> getPrestamosByClienteId(@PathVariable Long clienteId) {
        List<PrestamoAgricola> prestamos = prestamoService.findByClienteId(clienteId);
        return new ResponseEntity<>(prestamos, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<PrestamoAgricola> createPrestamo(@RequestBody PrestamoAgricola prestamo) {
        PrestamoAgricola nuevoPrestamo = prestamoService.save(prestamo);
        return new ResponseEntity<>(nuevoPrestamo, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PrestamoAgricola> updatePrestamo(@PathVariable Long id, @RequestBody PrestamoAgricola prestamo) {
        PrestamoAgricola prestamoActualizado = prestamoService.update(id, prestamo);
        if (prestamoActualizado == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(prestamoActualizado, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrestamo(@PathVariable Long id) {
        boolean eliminado = prestamoService.delete(id);
        if (!eliminado) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{id}/aprobar")
    public ResponseEntity<PrestamoAgricola> aprobarPrestamo(@PathVariable Long id) {
        PrestamoAgricola prestamo = prestamoService.aprobarPrestamo(id);
        if (prestamo == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(prestamo, HttpStatus.OK);
    }

    @PutMapping("/{id}/rechazar")
    public ResponseEntity<PrestamoAgricola> rechazarPrestamo(@PathVariable Long id) {
        PrestamoAgricola prestamo = prestamoService.rechazarPrestamo(id);
        if (prestamo == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(prestamo, HttpStatus.OK);
    }
}
