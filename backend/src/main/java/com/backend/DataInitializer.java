package com.backend;

import com.backend.analysys.AnalysisResult;
import com.backend.analysys.AnalysisResultRepository;
import com.backend.patient.Patient;
import com.backend.patient.PatientRepository;
import com.backend.xRayImage.XRayImage;
import com.backend.xRayImage.XRayImageRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

@Component
public class DataInitializer implements CommandLineRunner {

    private final PatientRepository patientRepository;
    private final XRayImageRepository xRayImageRepository;
    private final AnalysisResultRepository analysysResulrRepository;

    public DataInitializer(PatientRepository patientRepository, XRayImageRepository xRayImageRepository, AnalysisResultRepository analysysResulrRepository) {
        this.patientRepository = patientRepository;
        this.xRayImageRepository = xRayImageRepository;
        this.analysysResulrRepository = analysysResulrRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Create Patients
        Patient patient1 = new Patient("john.doe@example.com", "password", "John", "Doe", LocalDate.now(), LocalDate.of(1990, 1, 1), "123 Main St, Anytown, USA", 1234567890 );
        Patient patient2 = new Patient("jane.smith@example.com", "password", "Jane", "Smith", LocalDate.now(), LocalDate.of(2000, 1, 1), "Grodzka 1, Kraków", 111111111);

        // Save Patients to the Repository
        patientRepository.save(patient1);
        patientRepository.save(patient2);

        // Create XRay Images
        XRayImage image1 = new XRayImage("/images/xray1.jpg", patient1, LocalDate.now(), "Chest");
        XRayImage image2 = new XRayImage("/images/xray2.jpg", patient2, LocalDate.now(), "Knee");

        // Save XRay Images to the Repository
        xRayImageRepository.save(image1);
        xRayImageRepository.save(image2);

        AnalysisResult result1 = new AnalysisResult(image1, Arrays.asList("broken rib 3", "no sternum"), LocalDate.now());
        AnalysisResult result2 = new AnalysisResult(image2, Arrays.asList("broken long bone", "knee dislocation"), LocalDate.now());
        List<AnalysisResult> resultList = Stream.of(result1, result2).toList();
        analysysResulrRepository.saveAll(resultList);
    }
}
