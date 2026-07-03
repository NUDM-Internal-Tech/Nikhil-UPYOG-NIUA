package org.upyog.Automation.Controller;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.upyog.Automation.model.ReportDto;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import java.io.File;
import java.util.Arrays;
import java.util.Comparator;

@RestController
@RequestMapping("/api/report")
public class ReportController {

    private File getLatestReport() {

        File reportDir =
                new File("target/reports");

        File[] files =
                reportDir.listFiles(
                        (dir, name) ->
                                name.startsWith("Execution_")
                                        && name.endsWith(".html")
                );

        if (files == null || files.length == 0) {
            return null;
        }

        Arrays.sort(
                files,
                Comparator.comparingLong(File::lastModified)
                        .reversed()
        );

        return files[0];
    }

    @GetMapping("/view")
    public ResponseEntity<Resource> viewReport() {

        File latestReport = getLatestReport();

        if (latestReport == null) {
            return ResponseEntity.notFound().build();
        }

        Resource resource =
                new FileSystemResource(latestReport);

        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body(resource);
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> downloadReport() {

        File latestReport = getLatestReport();

        if (latestReport == null) {
            return ResponseEntity.notFound().build();
        }

        Resource resource =
                new FileSystemResource(latestReport);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename="
                                + latestReport.getName()
                )
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
    @GetMapping("/list")
    public ResponseEntity<String[]> getReports() {

        File reportDir =
                new File("target/reports");

        File[] files =
                reportDir.listFiles(
                        (dir, name) ->
                                name.startsWith("Execution_")
                                        && name.endsWith(".html")
                );

        if (files == null) {
            return ResponseEntity.ok(new String[0]);
        }
        Arrays.sort(
                files,
                Comparator.comparingLong(File::lastModified)
                        .reversed()
        );


        String[] reportNames =
                Arrays.stream(files)
                        .map(File::getName)
                        .toArray(String[]::new);

        return ResponseEntity.ok(reportNames);
    }

    @GetMapping("/view/{fileName}")
    public ResponseEntity<Resource> viewReport(
            @PathVariable String fileName
    ) {

        try {

            if (fileName.contains("..")
                    || fileName.contains("/")
                    || fileName.contains("\\")) {

                return ResponseEntity
                        .badRequest()
                        .build();
            }

            File reportDir =
                    new File("target/reports");

            File report =
                    new File(reportDir, fileName);

            String basePath =
                    reportDir.getCanonicalPath();

            String targetPath =
                    report.getCanonicalPath();

            if (!targetPath.startsWith(basePath)) {

                return ResponseEntity
                        .badRequest()
                        .build();
            }

            if (!report.exists()) {

                return ResponseEntity
                        .notFound()
                        .build();
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_HTML)
                    .body(new FileSystemResource(report));

        } catch (Exception e) {

            return ResponseEntity.internalServerError()
                    .build();
        }
    }

    @GetMapping("/module/{moduleName}")
    public List<ReportDto> getReportsByModule(@PathVariable String moduleName) {

        File reportDir = new File("target/reports");

        if (!reportDir.exists()) {
            return new ArrayList<>();
        }

        File[] files = reportDir.listFiles((dir, name) ->
                name.startsWith("Execution_" + moduleName.toUpperCase() + "_")
                        && name.endsWith(".html"));

        if (files == null) {
            return new ArrayList<>();
        }

        SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
        SimpleDateFormat timeFormat = new SimpleDateFormat("hh:mm:ss a");

        return java.util.Arrays.stream(files)
                .sorted(Comparator.comparingLong(File::lastModified).reversed())
                .limit(5)
                .map(file -> {

                    Date modified = new Date(file.lastModified());

                    ReportDto dto = new ReportDto();
                    dto.setFileName(file.getName());
                    dto.setDate(dateFormat.format(modified));
                    dto.setTime(timeFormat.format(modified));

                    return dto;

                })
                .collect(Collectors.toList());
    }
}