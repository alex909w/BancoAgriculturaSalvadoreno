package com.agrobanco.util;

public class ValidationUtil {
    
    /**
     * Valida si un string puede ser convertido a Integer
     */
    public static boolean isValidInteger(String value) {
        return parseIntegerSafe(value) != null;
    }
    
    /**
     * Convierte un string a Integer de forma segura
     */
    public static Integer parseIntegerSafe(String value) {
        if (value == null || value.trim().isEmpty() || "undefined".equalsIgnoreCase(value) || "null".equalsIgnoreCase(value)) {
            return null;
        }
        
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }
    
    /**
     * Valida si un string puede ser convertido a Double/BigDecimal
     */
    public static boolean isValidDecimal(String value) {
        return parseDoubleSafe(value) != null;
    }
    
    /**
     * Convierte un string a Double de forma segura
     */
    public static Double parseDoubleSafe(String value) {
        if (value == null || value.trim().isEmpty() || "undefined".equalsIgnoreCase(value) || "null".equalsIgnoreCase(value)) {
            return null;
        }
        
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
