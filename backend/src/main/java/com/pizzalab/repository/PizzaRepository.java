package com.pizzalab.repository;
import com.pizzalab.model.Pizza; import java.util.List; import java.util.Optional;
/** Contrato DAO que permite aislar SQL de las reglas de negocio. */
public interface PizzaRepository { List<Pizza> findAll(); Optional<Pizza> findById(long id); }
