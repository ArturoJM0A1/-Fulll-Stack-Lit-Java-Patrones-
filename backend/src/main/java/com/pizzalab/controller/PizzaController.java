package com.pizzalab.controller;
import com.pizzalab.dto.PizzaResponse; import com.pizzalab.service.PizzaService; import org.springframework.web.bind.annotation.*; import java.util.List;
/** Adaptador HTTP fino: delega la consulta al servicio. */
@RestController @RequestMapping("/api/pizzas") public class PizzaController {private final PizzaService service; public PizzaController(PizzaService s){service=s;} @GetMapping public List<PizzaResponse> all(){return service.list();}}
