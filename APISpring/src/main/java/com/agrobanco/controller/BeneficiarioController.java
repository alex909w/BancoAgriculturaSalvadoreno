package com.agrobanco.controller;

import com.agrobanco.model.Beneficiario;
import com.agrobanco.service.BeneficiarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

/**
 * Controlador REST para manejar operaciones CRUD de beneficiarios
 * 
 * @author AgroBanco Salvadoreño
 * @version 1.0
 */
@RestController
@RequestMapping("/beneficiarios")
@CrossOrigin(origins = "*")
public class BeneficiarioController {

    @Autowired
    private BeneficiarioService beneficiarioService;

    /**
     * Obtiene todos los beneficiarios
     */
    @GetMapping
    public ResponseEntity<List<Beneficiario>> getAllBeneficiarios() {
        try {
            List<Beneficiario> beneficiarios = beneficiarioService.findAll();
            return ResponseEntity.ok(beneficiarios);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtiene un beneficiario por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Beneficiario> getBeneficiarioById(@PathVariable Integer id) {
        try {
            Optional<Beneficiario> beneficiario = beneficiarioService.findById(id);
            return beneficiario.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtiene beneficiarios por ID de cuenta
     */
    @GetMapping("/cuenta/{cuentaId}")
    public ResponseEntity<List<Beneficiario>> getBeneficiariosByCuentaId(@PathVariable Integer cuentaId) {
        try {
            List<Beneficiario> beneficiarios = beneficiarioService.findByCuentaId(cuentaId);
            return ResponseEntity.ok(beneficiarios);        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Busca beneficiarios por DUI
     */
    @GetMapping("/buscar/dui/{dui}")
    public ResponseEntity<List<Beneficiario>> getBeneficiariosByDui(@PathVariable String dui) {
        try {
            List<Beneficiario> beneficiarios = beneficiarioService.findByDui(dui);
            return ResponseEntity.ok(beneficiarios);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Busca beneficiarios por nombre (búsqueda parcial)
     */
    @GetMapping("/buscar/nombre")
    public ResponseEntity<List<Beneficiario>> getBeneficiariosByNombre(@RequestParam String nombre) {
        try {
            List<Beneficiario> beneficiarios = beneficiarioService.findByNombreContaining(nombre);
            return ResponseEntity.ok(beneficiarios);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Crea un nuevo beneficiario
     */
    @PostMapping
    public ResponseEntity<?> createBeneficiario(@Valid @RequestBody Beneficiario beneficiario) {
        try {
            Beneficiario nuevoBeneficiario = beneficiarioService.save(beneficiario);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoBeneficiario);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error de validación: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error interno del servidor: " + e.getMessage());
        }
    }

    /**
     * Actualiza un beneficiario existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBeneficiario(@PathVariable Integer id, 
                                               @Valid @RequestBody Beneficiario beneficiario) {
        try {
            Optional<Beneficiario> beneficiarioExistente = beneficiarioService.findById(id);
            if (beneficiarioExistente.isPresent()) {
                beneficiario.setId(id);
                Beneficiario beneficiarioActualizado = beneficiarioService.save(beneficiario);
                return ResponseEntity.ok(beneficiarioActualizado);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error de validación: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error interno del servidor: " + e.getMessage());
        }
    }

    /**
     * Elimina un beneficiario por ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBeneficiario(@PathVariable Integer id) {
        try {
            Optional<Beneficiario> beneficiario = beneficiarioService.findById(id);
            if (beneficiario.isPresent()) {
                beneficiarioService.deleteById(id);
                return ResponseEntity.ok().body("Beneficiario eliminado exitosamente");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error interno del servidor: " + e.getMessage());
        }
    }

    /**
     * Verifica si existe un beneficiario por ID
     */
    @GetMapping("/existe/{id}")
    public ResponseEntity<Boolean> existsBeneficiario(@PathVariable Integer id) {
        try {
            boolean existe = beneficiarioService.existsById(id);
            return ResponseEntity.ok(existe);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtiene el conteo total de beneficiarios
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countBeneficiarios() {
        try {
            long count = beneficiarioService.count();
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtiene el conteo de beneficiarios por cuenta
     */
    @GetMapping("/count/cuenta/{cuentaId}")
    public ResponseEntity<Long> countBeneficiariosByCuenta(@PathVariable Integer cuentaId) {
        try {
            List<Beneficiario> beneficiarios = beneficiarioService.findByCuentaId(cuentaId);
            return ResponseEntity.ok((long) beneficiarios.size());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
