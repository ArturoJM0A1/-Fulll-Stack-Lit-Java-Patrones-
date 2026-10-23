package com.pizzalab.service;
import com.pizzalab.dto.SalesReportResponse; import com.pizzalab.exception.NotFoundException; import com.pizzalab.repository.ReportRepository; import org.springframework.batch.core.*; import org.springframework.batch.core.launch.JobLauncher; import org.springframework.stereotype.Service; import java.time.LocalDate;
/** Facade que lanza el Job síncrono local y expone únicamente resultados terminados. */
@Service public class SalesReportService {
 private final JobLauncher launcher; private final Job job; private final ReportRepository reports; public SalesReportService(JobLauncher l,Job salesReportJob,ReportRepository r){launcher=l;job=salesReportJob;reports=r;}
 public SalesReportResponse run(LocalDate date){try{JobParameters p=new JobParametersBuilder().addString("date",date.toString()).addLong("request",System.nanoTime(),false).toJobParameters();JobExecution e=launcher.run(job,p);if(e.getStatus()!=BatchStatus.COMPLETED)throw new IllegalStateException("El batch terminó en "+e.getStatus());return get(date);}catch(Exception e){throw new IllegalStateException("No se pudo ejecutar el batch",e);}}
 public SalesReportResponse get(LocalDate date){return reports.find(date).orElseThrow(()->new NotFoundException("No hay reporte para "+date));}
}
