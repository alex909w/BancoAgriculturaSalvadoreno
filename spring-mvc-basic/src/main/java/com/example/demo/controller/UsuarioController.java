package com.example.demo.controller;

import com.example.demo.model.Usuario;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

@Controller
public class UsuarioController {

    private List<Usuario> usuarios = new ArrayList<>();
    private Long idCounter = 1L;

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("usuario", new Usuario());
        model.addAttribute("usuarios", usuarios);
        return "index";
    }

    @PostMapping("/guardar")
    public String guardarUsuario(@ModelAttribute Usuario usuario, Model model) {
        usuario.setId(idCounter++);
        usuarios.add(usuario);
        return "redirect:/";
    }

    // Añade este método para tener un punto de entrada adicional
    @GetMapping("/test")
    public String test() {
        return "index";
    }

    // Añade este método para verificar que el controlador responde
    @GetMapping("/ping")
    @ResponseBody
    public String ping() {
        return "Aplicación funcionando correctamente";
    }
}
