package com.techconf.controllers;

import com.techconf.models.Charla;
import com.techconf.models.Asistente;
import com.techconf.repositories.AsistenteRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.techconf.repositories.CharlaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/charlas")
@CrossOrigin(origins = "http://localhost:4200")
public class CharlaController {
    
    @Autowired
    private CharlaRepository repository;

    @Autowired
    private AsistenteRepository asistenteRepository;

    @PostMapping("/{id}/asistentes")
    @ResponseStatus(HttpStatus.CREATED)
    public Asistente inscribirAsistente(@PathVariable Long id, @Valid @RequestBody Asistente asistente) {
        Charla charla = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Charla no encontrada"));
        asistente.setId(null);
        asistente.setCharla(charla);
        return asistenteRepository.save(asistente);
    }

    @GetMapping
    public List<Charla> obtenerTodas() {
        return repository.findAll();
    }

    @PostMapping
    public Charla registrarCharla(@Valid @RequestBody Charla nuevaCharla) {
        nuevaCharla.setId(null);
        return repository.save(nuevaCharla);
    }
}