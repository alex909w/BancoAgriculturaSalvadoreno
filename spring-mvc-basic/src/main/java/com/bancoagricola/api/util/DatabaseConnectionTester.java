package com.bancoagricola.api.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseConnectionTester implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public DatabaseConnectionTester(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            System.out.println("======= PROBANDO CONEXIÓN A LA BASE DE DATOS =======");
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            System.out.println("Conexión exitosa a la base de datos. Resultado: " + result);
            
            // Intentar obtener un usuario para verificar acceso a las tablas
            System.out.println("Intentando obtener un usuario...");
            jdbcTemplate.query("SELECT * FROM usuario LIMIT 1", 
                (rs, rowNum) -> "Usuario encontrado: " + rs.getString("usuario"))
                .forEach(System.out::println);
            
            System.out.println("======= PRUEBA DE CONEXIÓN COMPLETADA =======");
        } catch (Exception e) {
            System.err.println("======= ERROR DE CONEXIÓN A LA BASE DE DATOS =======");
            System.err.println("Mensaje de error: " + e.getMessage());
            e.printStackTrace();
            System.err.println("======= FIN DEL ERROR =======");
        }
    }
}
