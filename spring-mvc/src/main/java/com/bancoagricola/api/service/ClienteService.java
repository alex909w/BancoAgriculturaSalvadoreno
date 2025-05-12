package com.bancoagricola.api.service;

import com.bancoagricola.api.exception.ResourceNotFoundException;
import com.bancoagricola.api.model.Cliente;
import com.bancoagricola.api.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ClienteService {
    
    private final ClienteRepository clienteRepository;
    
    @Autowired
    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }
    
    @Transactional(readOnly = true)
    public List<Cliente> findAll() {
        return clienteRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Cliente findById(Integer id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", "id", id));
    }
    
    @Transactional(readOnly = true)
    public Cliente findByDui(String dui) {
        return clienteRepository.findByDui(dui)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", "dui", dui));
    }
    
    @Transactional
    public Cliente save(Cliente cliente) {
        return clienteRepository.save(cliente);
    }
    
    @Transactional
    public Cliente update(Integer id, Cliente cliente) {
        if (!clienteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cliente", "id", id);
        }
        cliente.setIdCliente(id);
        return clienteRepository.save(cliente);
    }
    
    @Transactional
    public void delete(Integer id) {
        if (!clienteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cliente", "id", id);
        }
        clienteRepository.deleteById(id);
    }
}
