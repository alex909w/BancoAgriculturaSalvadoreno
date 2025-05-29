package com.agrobanco.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;

@Configuration
public class SwaggerConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        Server server = new Server();
        server.setUrl("http://localhost:8080/api");
        server.setDescription("Servidor de desarrollo");
        return new OpenAPI()
                .servers(Arrays.asList(server))
                .info(new Info()
                        .title("AgroBanco Salvadoreño API")
                        .description("API REST para el sistema bancario de AgroBanco Salvadoreño. " +
                                   "Esta API permite gestionar usuarios, cuentas, transacciones y préstamos.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Equipo de Desarrollo")
                                .email("desarrollo@agrobanco.com.sv")
                                .url("https://agrobanco.com.sv"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")));
    }
}
