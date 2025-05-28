package com.agrobanco.test;

import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import java.util.Map;

/**
 * Cliente de prueba para verificar las correcciones del problema de sucursal_id = 0
 */
public class TestDataFixClient {
    
    private static final String BASE_URL = "http://localhost:8081/api";
    private RestTemplate restTemplate = new RestTemplate();
    
    public void testDiagnostico() {
        try {
            String url = BASE_URL + "/data-fix/diagnostico-transacciones";
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            
            System.out.println("=== DIAGNÓSTICO DE TRANSACCIONES ===");
            System.out.println("Status: " + response.getStatusCode());
            System.out.println("Response: " + response.getBody());
            
        } catch (Exception e) {
            System.err.println("Error en diagnóstico: " + e.getMessage());
        }
    }
    
    public void testCorreccion() {
        try {
            String url = BASE_URL + "/data-fix/corregir-sucursales";
            ResponseEntity<Map> response = restTemplate.postForEntity(url, null, Map.class);
            
            System.out.println("=== CORRECCIÓN DE SUCURSALES ===");
            System.out.println("Status: " + response.getStatusCode());
            System.out.println("Response: " + response.getBody());
            
        } catch (Exception e) {
            System.err.println("Error en corrección: " + e.getMessage());
        }
    }
    
    public void testTransacciones() {
        try {
            String url = BASE_URL + "/transacciones";
            ResponseEntity<Object> response = restTemplate.getForEntity(url, Object.class);
            
            System.out.println("=== PRUEBA DE ENDPOINT TRANSACCIONES ===");
            System.out.println("Status: " + response.getStatusCode());
            System.out.println("Response type: " + response.getBody().getClass().getSimpleName());
            
            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("✓ El endpoint funciona correctamente");
            } else {
                System.out.println("✗ El endpoint tiene problemas");
            }
            
        } catch (Exception e) {
            System.err.println("Error al obtener transacciones: " + e.getMessage());
            System.err.println("Esto indica que el problema aún existe.");
        }
    }
    
    public static void main(String[] args) {
        TestDataFixClient client = new TestDataFixClient();
        
        System.out.println("Iniciando pruebas de corrección...\n");
        
        // Paso 1: Diagnóstico
        client.testDiagnostico();
        System.out.println();
        
        // Paso 2: Corrección
        client.testCorreccion();
        System.out.println();
        
        // Paso 3: Verificación
        client.testTransacciones();
        System.out.println();
        
        System.out.println("Pruebas completadas.");
    }
}
