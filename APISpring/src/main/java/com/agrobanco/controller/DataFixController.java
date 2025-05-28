package com.agrobanco.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/data-fix")
@CrossOrigin(origins = "*")
public class DataFixController {
    
    @Autowired
    private EntityManager entityManager;
    
    @GetMapping("/diagnostico-transacciones")
    public ResponseEntity<Map<String, Object>> diagnosticoTransacciones() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Verificar transacciones con sucursal_id = 0
            Query queryInvalidas = entityManager.createNativeQuery(
                "SELECT COUNT(*) FROM transacciones WHERE sucursal_id = 0"
            );
            Long transaccionesInvalidas = ((Number) queryInvalidas.getSingleResult()).longValue();
              // Verificar sucursales existentes
            Query querySucursales = entityManager.createNativeQuery(
                "SELECT id, nombre FROM sucursales ORDER BY id LIMIT 5"
            );
            @SuppressWarnings("unchecked")
            List<Object[]> sucursales = querySucursales.getResultList();
            
            // Verificar transacciones problemáticas
            Query queryProblematicas = entityManager.createNativeQuery(
                "SELECT id, numero_transaccion, sucursal_id FROM transacciones WHERE sucursal_id = 0 LIMIT 5"
            );
            @SuppressWarnings("unchecked")
            List<Object[]> transaccionesProblematicas = queryProblematicas.getResultList();
            
            response.put("success", true);
            response.put("transaccionesConSucursalCero", transaccionesInvalidas);
            response.put("sucursalesDisponibles", sucursales);
            response.put("transaccionesProblematicas", transaccionesProblematicas);
            response.put("mensaje", "Diagnóstico completado exitosamente");
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/corregir-sucursales")
    @Transactional
    public ResponseEntity<Map<String, Object>> corregirSucursales() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Paso 1: Verificar si existe sucursal con id = 1 (sucursal principal)
            Query verificarSucursal = entityManager.createNativeQuery(
                "SELECT COUNT(*) FROM sucursales WHERE id = 1"
            );
            Long sucursalExists = ((Number) verificarSucursal.getSingleResult()).longValue();
            
            if (sucursalExists == 0) {
                // Crear sucursal principal si no existe
                Query crearSucursal = entityManager.createNativeQuery(
                    "INSERT INTO sucursales (id, nombre, direccion, telefono, estado, created_at) " +
                    "VALUES (1, 'Sucursal Principal', 'San Salvador, El Salvador', '2222-2222', 'activa', NOW())"
                );
                crearSucursal.executeUpdate();
                response.put("sucursalCreada", true);
            }
            
            // Paso 2: Actualizar transacciones con sucursal_id = 0 a sucursal_id = 1
            Query actualizarTransacciones = entityManager.createNativeQuery(
                "UPDATE transacciones SET sucursal_id = 1 WHERE sucursal_id = 0"
            );
            int transaccionesActualizadas = actualizarTransacciones.executeUpdate();
            
            // Paso 3: Verificar el resultado
            Query verificarCorreccion = entityManager.createNativeQuery(
                "SELECT COUNT(*) FROM transacciones WHERE sucursal_id = 0"
            );
            Long transaccionesRestantes = ((Number) verificarCorreccion.getSingleResult()).longValue();
            
            response.put("success", true);
            response.put("transaccionesActualizadas", transaccionesActualizadas);
            response.put("transaccionesConSucursalCeroRestantes", transaccionesRestantes);
            response.put("mensaje", "Corrección completada exitosamente");
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/crear-sucursal-default")
    @Transactional
    public ResponseEntity<Map<String, Object>> crearSucursalDefault() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Crear sucursal con id = 0 para mantener consistencia
            Query crearSucursalCero = entityManager.createNativeQuery(
                "INSERT INTO sucursales (id, nombre, direccion, telefono, estado, created_at) " +
                "VALUES (0, 'Sucursal Virtual', 'Sistema', 'N/A', 'activa', NOW()) " +
                "ON DUPLICATE KEY UPDATE nombre = 'Sucursal Virtual'"
            );
            crearSucursalCero.executeUpdate();
            
            response.put("success", true);
            response.put("mensaje", "Sucursal con ID 0 creada exitosamente");
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }
}
