package com.agrobanco.util;

public class ValidationUtil {
    
    /**
     * Valida si un string puede ser convertido a Integer
     */
    public static boolean isValidInteger(String value) {
        if (value == null || value.trim().isEmpty() || "undefined".equalsIgnoreCase(value) || "null".equalsIgnoreCase(value)) {
            return false;
        }
        
        try {
            Integer.parseInt(value);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }
    
    /**
     * Convierte un string a Integer de forma segura
     */
    public static Integer parseIntegerSafe(String value) {
        if (!isValidInteger(value)) {
            return null;
        }
        return Integer.parseInt(value);
    }
    
    /**
     * Valida si un string puede ser convertido a Double/BigDecimal
     */
    public static boolean isValidDecimal(String value) {
        if (value == null || value.trim().isEmpty() || "undefined".equalsIgnoreCase(value) || "null".equalsIgnoreCase(value)) {
            return false;
        }
        
        try {
            Double.parseDouble(value);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }
    
    /**
     * Convierte un string a Double de forma segura
     */
    public static Double parseDoubleSafe(String value) {
        if (!isValidDecimal(value)) {
            return null;
        }
        return Double.parseDouble(value);
    }
}
