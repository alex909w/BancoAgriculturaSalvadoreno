package com.bancoagricola.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class BancoAgricolaApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(BancoAgricolaApplication.class);
    }

    public static void main(String[] args) {
        try {
            System.out.println("Iniciando la aplicación Banco Agrícola API...");
            SpringApplication.run(BancoAgricolaApplication.class, args);
            System.out.println("Aplicación iniciada correctamente.");
        } catch (Exception e) {
            System.err.println("Error al iniciar la aplicación: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
