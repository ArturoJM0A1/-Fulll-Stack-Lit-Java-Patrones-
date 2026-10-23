package com.pizzalab.model;

import java.util.Objects;

/** Objeto de valor del menú; el precio se guarda en centavos para evitar errores de coma flotante. */
public final class Pizza {
  private final long id; private final String name; private final String description; private final int priceCents;
  public Pizza(long id, String name, String description, int priceCents) { this.id=id; this.name=Objects.requireNonNull(name); this.description=Objects.requireNonNull(description); this.priceCents=priceCents; }
  public long id(){return id;} public String name(){return name;} public String description(){return description;} public int priceCents(){return priceCents;}
  @Override public boolean equals(Object value){ return value instanceof Pizza other && id == other.id; }
  @Override public int hashCode(){ return Long.hashCode(id); }
}
