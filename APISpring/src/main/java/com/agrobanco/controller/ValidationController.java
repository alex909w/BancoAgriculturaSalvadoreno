package com.agrobanco.controller;

import com.agrobanco.util.ValidationUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/validation")
@CrossOrigin(origins = "*")
public class ValidationController {
    
    @GetMapping("/check-integer/{value}")
    public ResponseEntity<Map<String, Object>> checkInteger(@PathVariable String value) {
        Map<String, Object> response = new HashMap<>();
        
        boolean isValid = ValidationUtil.isValidInteger(value);
        response.put("value", value);
        response.put("isValid", isValid);
        
        if (isValid) {
            response.put("parsedValue", ValidationUtil.parseIntegerSafe(value));
            response.put("message", "El valor es un entero válido");
        } else {
            response.put("message", "El valor no es un entero válido");
            if ("undefined".equalsIgnoreCase(value)) {
                response.put("hint", "El valor 'undefined' no es válido. Asegúrese de enviar un número entero");
            }
        }
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/check-decimal/{value}")
    public ResponseEntity<Map<String, Object>> checkDecimal(@PathVariable String value) {
        Map<String, Object> response = new HashMap<>();
        
        boolean isValid = ValidationUtil.isValidDecimal(value);
        response.put("value", value);
        response.put("isValid", isValid);
        
        if (isValid) {
            response.put("parsedValue", ValidationUtil.parseDoubleSafe(value));
            response.put("message", "El valor es un decimal válido");
        } else {
            response.put("message", "El valor no es un decimal válido");
            if ("undefined".equalsIgnoreCase(value)) {
                response.put("hint", "El valor 'undefined' no es válido. Asegúrese de enviar un número decimal");
            }
        }
        
        return ResponseEntity.ok(response);
    }
}
