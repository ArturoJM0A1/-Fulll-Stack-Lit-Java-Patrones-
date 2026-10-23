package com.pizzalab.service;
import com.pizzalab.dto.PizzaResponse; import com.pizzalab.repository.PizzaRepository; import org.springframework.stereotype.Service; import java.util.List;
/** Servicio de consulta; los beans Spring singleton no guardan estado mutable por petición. */
@Service public class PizzaService { private final PizzaRepository pizzas; public PizzaService(PizzaRepository pizzas){this.pizzas=pizzas;} public List<PizzaResponse> list(){return pizzas.findAll().stream().map(p->new PizzaResponse(p.id(),p.name(),p.description(),p.priceCents())).toList();} }
