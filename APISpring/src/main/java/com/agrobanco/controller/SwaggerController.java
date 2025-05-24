package com.agrobanco.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SwaggerController {
    
    @GetMapping("/docs")
    public String redirectToSwagger() {
        return "redirect:/swagger-ui.html";
    }
    
    @GetMapping("/swagger")
    public String redirectToSwaggerAlternative() {
        return "redirect:/swagger-ui.html";
    }
}
