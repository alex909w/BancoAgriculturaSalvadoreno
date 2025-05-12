package com.bancoagricola.api.controller;

import com.bancoagricola.api.model.Prestamo;
import com.bancoagricola.api.service.PrestamoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prestamos")
public class PrestamoController {

    private final PrestamoService prestamoService;

    @Autowired
    public PrestamoController(PrestamoService prestamoService) {
        this.prestamoService = prestamoService;
    }

    @GetMapping
    public ResponseEntity<List<Prestamo>> getAllPrestamos() {
        List<Prestamo> prestamos = prestamoService.findAll();
        return new ResponseEntity<>(prestamos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prestamo> getPrestamoById(@PathVariable Integer id) {
        Prestamo prestamo = prestamoService.findById(id);
        return new ResponseEntity<>(prestamo, HttpStatus.OK);
    }

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<List<Prestamo>> getPrestamosByClienteId(@PathVariable Integer idCliente) {
        List<Prestamo> prestamos = prestamoService.findByClienteId(idCliente);
        return new ResponseEntity<>(prestamos, HttpStatus.OK);
    }

    @GetMapping("/cajero/{idCajero}")
    public ResponseEntity<List<Prestamo>> getPrestamosByCajeroId(@PathVariable Integer idCajero) {
        List<Prestamo> prestamos = prestamoService.findByCajeroId(idCajero);
        return new ResponseEntity<>(prestamos, HttpStatus.OK);
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Prestamo>> getPrestamosByEstado(@PathVariable String estado) {
        List<Prestamo> prestamos = prestamoService.findByEstado(estado);
        return new ResponseEntity<>(prestamos, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Prestamo> createPrestamo(@Valid @RequestBody Prestamo prestamo) {
        Prestamo nuevoPrestamo = prestamoService.save(prestamo);
        return new ResponseEntity<>(nuevoPrestamo, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Prestamo> updatePrestamo(@PathVariable Integer id, @Valid @RequestBody Prestamo prestamo) {
        Prestamo prestamoActualizado = prestamoService.update(id, prestamo);
        return new ResponseEntity<>(prestamoActualizado, HttpStatus.OK);
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Prestamo> cambiarEstadoPrestamo(@PathVariable Integer id, @RequestBody Map<String, String> request) {
        String nuevoEstado = request.get("estado");
        Prestamo prestamo = prestamoService.cambiarEstado(id, nuevoEstado);
        return new ResponseEntity<>(prestamo, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrestamo(@PathVariable Integer id) {
        prestamoService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
