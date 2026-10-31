package com.pizzalab.service;
import com.pizzalab.dto.SalesReportResponse; import com.pizzalab.exception.NotFoundException; import com.pizzalab.repository.ReportRepository; import org.springframework.batch.core.*; import org.springframework.batch.core.launch.JobLauncher; import org.springframework.stereotype.Service; import java.time.LocalDate; import java.util.ArrayList; import java.util.List;
/** Facade que lanza el Job síncrono local y expone únicamente resultados terminados. */
@Service public class SalesReportService {
 private final JobLauncher launcher; private final Job job; private final ReportRepository reports; public SalesReportService(JobLauncher l,Job salesReportJob,ReportRepository r){launcher=l;job=salesReportJob;reports=r;}
 public SalesReportResponse run(LocalDate date){try{JobParameters p=new JobParametersBuilder().addString("date",date.toString()).addLong("request",System.nanoTime(),false).toJobParameters();JobExecution e=launcher.run(job,p);if(e.getStatus()!=BatchStatus.COMPLETED)throw new IllegalStateException("El batch terminó en "+e.getStatus());return get(date);}catch(Exception e){throw new IllegalStateException("No se pudo ejecutar el batch",e);}}
 /** Ejecuta el mismo Job de un día por cada fecha y devuelve los reportes persistidos. */
 public List<SalesReportResponse> runRange(LocalDate from, LocalDate to) {
   if (from.isAfter(to)) throw new IllegalArgumentException("La fecha inicial debe ser anterior o igual a la final");
   List<SalesReportResponse> result = new ArrayList<>();
   for (LocalDate day = from; !day.isAfter(to); day = day.plusDays(1)) result.add(run(day));
   return List.copyOf(result);
 }
 public SalesReportResponse get(LocalDate date){return reports.find(date).orElseThrow(()->new NotFoundException("No hay reporte para "+date));}
}
