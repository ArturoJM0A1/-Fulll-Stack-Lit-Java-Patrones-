package com.pizzalab.dto;
/** DTO: no expone detalles de SQL a la API JSON. */
public record PizzaResponse(long id, String name, String description, int priceCents) { }
