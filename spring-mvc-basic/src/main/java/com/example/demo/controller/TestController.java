package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/test")
    public String test() {
        return "La API está funcionando correctamente. Hora actual: " + new java.util.Date();
    }

    @GetMapping("/")
    public String home() {
        return "Bienvenido a la API RESTful. Accede a /api/usuarios para ver los recursos disponibles.";
    }
}
