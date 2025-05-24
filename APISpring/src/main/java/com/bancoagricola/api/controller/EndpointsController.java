package com.bancoagricola.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.web.mappings.MappingsEndpoint;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/system")
@CrossOrigin(origins = "*")
public class EndpointsController {

    @Autowired
    private RequestMappingHandlerMapping requestMappingHandlerMapping;

    @GetMapping("/endpoints")
    public ResponseEntity<Map<String, Object>> getAllEndpoints() {
        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> endpoints = new ArrayList<>();

        Map<RequestMappingInfo, HandlerMethod> handlerMethods = 
            requestMappingHandlerMapping.getHandlerMethods();

        for (Map.Entry<RequestMappingInfo, HandlerMethod> entry : handlerMethods.entrySet()) {
            RequestMappingInfo mappingInfo = entry.getKey();
            HandlerMethod handlerMethod = entry.getValue();

            Map<String, Object> endpointInfo = new HashMap<>();
            
            // Obtener patrones de URL
            Set<String> patterns = mappingInfo.getPatternsCondition().getPatterns();
            endpointInfo.put("paths", patterns);
            
            // Obtener métodos HTTP
            Set<String> methods = mappingInfo.getMethodsCondition().getMethods()
                .stream()
                .map(method -> method.name())
                .collect(Collectors.toSet());
            endpointInfo.put("methods", methods.isEmpty() ? Arrays.asList("GET", "POST", "PUT", "DELETE") : methods);
            
            // Obtener información del controlador
            endpointInfo.put("controller", handlerMethod.getBeanType().getSimpleName());
            endpointInfo.put("method", handlerMethod.getMethod().getName());
            
            // Obtener parámetros
            Class<?>[] parameterTypes = handlerMethod.getMethod().getParameterTypes();
            List<String> parameters = Arrays.stream(parameterTypes)
                .map(Class::getSimpleName)
                .collect(Collectors.toList());
            endpointInfo.put("parameters", parameters);

            endpoints.add(endpointInfo);
        }

        // Ordenar por path
        endpoints.sort((a, b) -> {
            Set<String> pathsA = (Set<String>) a.get("paths");
            Set<String> pathsB = (Set<String>) b.get("paths");
            String firstPathA = pathsA.isEmpty() ? "" : pathsA.iterator().next();
            String firstPathB = pathsB.isEmpty() ? "" : pathsB.iterator().next();
            return firstPathA.compareTo(firstPathB);
        });

        response.put("totalEndpoints", endpoints.size());
        response.put("endpoints", endpoints);
        response.put("timestamp", System.currentTimeMillis());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/endpoints/summary")
    public ResponseEntity<Map<String, Object>> getEndpointsSummary() {
        Map<String, Object> response = new HashMap<>();
        Map<String, List<String>> endpointsByController = new HashMap<>();

        Map<RequestMappingInfo, HandlerMethod> handlerMethods = 
            requestMappingHandlerMapping.getHandlerMethods();

        for (Map.Entry<RequestMappingInfo, HandlerMethod> entry : handlerMethods.entrySet()) {
            RequestMappingInfo mappingInfo = entry.getKey();
            HandlerMethod handlerMethod = entry.getValue();

            String controller = handlerMethod.getBeanType().getSimpleName();
            Set<String> patterns = mappingInfo.getPatternsCondition().getPatterns();
            Set<String> methods = mappingInfo.getMethodsCondition().getMethods()
                .stream()
                .map(method -> method.name())
                .collect(Collectors.toSet());

            for (String pattern : patterns) {
                String methodsStr = methods.isEmpty() ? "ALL" : String.join(",", methods);
                String endpoint = methodsStr + " " + pattern;
                
                endpointsByController.computeIfAbsent(controller, k -> new ArrayList<>()).add(endpoint);
            }
        }

        response.put("controllers", endpointsByController);
        response.put("totalControllers", endpointsByController.size());
        response.put("timestamp", System.currentTimeMillis());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/endpoints/by-method/{httpMethod}")
    public ResponseEntity<Map<String, Object>> getEndpointsByMethod(@PathVariable String httpMethod) {
        Map<String, Object> response = new HashMap<>();
        List<String> endpoints = new ArrayList<>();

        Map<RequestMappingInfo, HandlerMethod> handlerMethods = 
            requestMappingHandlerMapping.getHandlerMethods();

        for (Map.Entry<RequestMappingInfo, HandlerMethod> entry : handlerMethods.entrySet()) {
            RequestMappingInfo mappingInfo = entry.getKey();
            
            Set<String> methods = mappingInfo.getMethodsCondition().getMethods()
                .stream()
                .map(method -> method.name())
                .collect(Collectors.toSet());

            if (methods.contains(httpMethod.toUpperCase()) || methods.isEmpty()) {
                Set<String> patterns = mappingInfo.getPatternsCondition().getPatterns();
                endpoints.addAll(patterns);
            }
        }

        response.put("method", httpMethod.toUpperCase());
        response.put("endpoints", endpoints);
        response.put("count", endpoints.size());

        return ResponseEntity.ok(response);
    }
}
