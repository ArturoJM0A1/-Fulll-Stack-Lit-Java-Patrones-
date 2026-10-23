package com.pizzalab.service;
import org.springframework.stereotype.Component;
/** Factory Method centraliza la decisión de formato hoy y permite añadir CSV sin cambiar el batch. */
@Component public class ReportFormatterFactory { private final TextReportFormatter text; public ReportFormatterFactory(TextReportFormatter text){this.text=text;} public ReportFormatter forFormat(String format){if(!"text".equalsIgnoreCase(format)) throw new IllegalArgumentException("Formato no soportado");return text;} }
