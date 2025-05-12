package com.bancoagricola.api.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${server.servlet.context-path:}")
    private String contextPath;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API del Banco de Agricultura Salvadoreño")
                        .description("API RESTful para la gestión de clientes, cuentas y préstamos agrícolas")
                        .version("1.0")
                        .contact(new Contact()
                                .name("Banco de Agricultura Salvadoreño S.A. de C.V.")
                                .email("api@bancoagricola.com.sv")
                                .url("https://www.bancoagricola.com.sv"))
                        .license(new License()
                                .name("Privada")
                                .url("https://www.bancoagricola.com.sv/terminos-y-condiciones")))
                .servers(List.of(
                        new Server().url(contextPath).description("Servidor actual")
                ));
    }
}
