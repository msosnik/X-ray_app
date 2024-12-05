package com.backend;

import com.backend.analysys.AnalysisResult;
import com.backend.analysys.AnalysisResultRepository;
import com.backend.annotation.Annotation;
import com.backend.annotation.AnnotationRepository;
import com.backend.appointment.Appointment;
import com.backend.appointment.AppointmentRepository;
import com.backend.appointment.Status;
import com.backend.chat.Chat;
import com.backend.chat.ChatRepository;
import com.backend.doctor.Doctor;
import com.backend.doctor.DoctorRepository;
import com.backend.message.Message;
import com.backend.message.MessageRepository;
import com.backend.patient.Patient;
import com.backend.patient.PatientRepository;
import com.backend.user.PasswordUtil;
import com.backend.user.User;
import com.backend.xRayImage.XRayImage;
import com.backend.xRayImage.XRayImageRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

@Component
public class DataInitializer implements CommandLineRunner {

    private final PatientRepository patientRepository;
    private final XRayImageRepository xRayImageRepository;
    private final AnalysisResultRepository analysisResultRepository;
    private final DoctorRepository doctorRepository;
    private final AnnotationRepository annotationRepository;
    private final AppointmentRepository appointmentRepository;
    private final PasswordUtil passwordUtil;
    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;

    public DataInitializer(PatientRepository patientRepository, XRayImageRepository xRayImageRepository, AnalysisResultRepository analysisResultRepository, DoctorRepository doctorRepository, AnnotationRepository annotationRepository, AppointmentRepository appointmentRepository, PasswordUtil passwordUtil, ChatRepository chatRepository, MessageRepository messageRepository) {
        this.patientRepository = patientRepository;
        this.xRayImageRepository = xRayImageRepository;
        this.analysisResultRepository = analysisResultRepository;
        this.doctorRepository = doctorRepository;
        this.annotationRepository = annotationRepository;
        this.appointmentRepository = appointmentRepository;
        this.passwordUtil = passwordUtil;
        this.chatRepository = chatRepository;
        this.messageRepository = messageRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (patientRepository.count() > 0) {
            return;
            }

        // Create Patients
        Patient patient1 = new Patient("john.doe@example.com", passwordUtil.hashPassword("password"), "John", "Doe", LocalDate.now(), LocalDate.of(1990, 1, 1), "123 Main St, Anytown, USA", 1234567890 );
        Patient patient2 = new Patient("jane.smith@example.com", passwordUtil.hashPassword("password"), "Jane", "Smith", LocalDate.now(), LocalDate.of(2000, 1, 1), "Grodzka 1, Kraków", 111111111);
        Patient patient3 = new Patient("jane.solo@example.com", passwordUtil.hashPassword("password"), "Jane", "Solo", LocalDate.now(), LocalDate.of(2000, 1, 1), "Grodzka 1, Kraków", 111111112);

        // Save Patients to the Repository
        List<Patient> patientList = Stream.of(patient1, patient2).toList();
        patientRepository.saveAll(patientList);
        patientRepository.save(patient3);

        // Create XRay Images
        XRayImage image1 = new XRayImage("images/1.jpg", patient1, LocalDate.now(), "Chest");
        XRayImage image2 = new XRayImage("images/2.jpeg", patient2, LocalDate.now(), "Knee");
        xRayImageRepository.save(image1);
        xRayImageRepository.save(image2);

        AnalysisResult result1 = new AnalysisResult(image1, Arrays.asList("broken rib 3", "no sternum"), LocalDate.now());
        AnalysisResult result2 = new AnalysisResult(image2, Arrays.asList("broken long bone", "knee dislocation"), LocalDate.now());
        List<AnalysisResult> resultList = Stream.of(result1, result2).toList();
        analysisResultRepository.saveAll(resultList);

        Doctor doctor1 = new Doctor("doc1@example.com", passwordUtil.hashPassword("password"), "John", "Doe", LocalDate.now(), 67779, 123456, "123 Clinic St.", "Cardiology", "Mon-Fri", "9 AM - 5 PM");
        Doctor doctor2 = new Doctor("doc2@example.com", passwordUtil.hashPassword("password"), "Jane", "Smith", LocalDate.now(), 82286116, 654321, "456 Hospital Rd.", "Neurology", "Mon-Wed", "10 AM - 4 PM");
        List<Doctor> doctorList = Stream.of(doctor1, doctor2).toList();
        doctorRepository.saveAll(doctorList);

        Annotation annotation = new Annotation();
        annotation.setAnalysisResult(result1);
        annotation.setDoctor(doctor1);
        annotation.setAnnotationData("{\"abnormality\": \"Fracture\", \"severity\": \"High\"}");
        annotation.setCreatedAt(LocalDateTime.now());
        annotationRepository.save(annotation);

        Appointment appointment1 = new Appointment(patient1, doctor1, LocalDateTime.now().plusDays(1), Status.SCHEDULED, LocalDate.now());
        Appointment appointment2 = new Appointment(patient1, doctor2, LocalDateTime.now().plusDays(3), Status.CANCELLED, LocalDate.now());
        appointmentRepository.save(appointment1);
        appointmentRepository.save(appointment2);

        doctor1.setPatients(patientList);
        doctor2.setPatients(patientList);
        patient1.setDoctors(doctorList);
        patient2.setDoctors(doctorList);
        patientRepository.saveAll(patientList);
        doctorRepository.saveAll(doctorList);

        // Initialize a chat with users
        List<User> participants = Arrays.asList(patient1, patient2);
        Chat chat = new Chat();
        chat.setParticipants(participants);
        chatRepository.save(chat);

        // Initialize messages
        Message message1 = new Message();
        message1.setAuthor(patient1);
        message1.setChat(chat);
        message1.setText("Hello, Jane!");
        message1.setTimestamp(LocalDateTime.now().minusMinutes(10));
        messageRepository.save(message1);

        Message message2 = new Message();
        message2.setAuthor(patient2);
        message2.setChat(chat);
        message2.setText("Hi John, how are you?");
        message2.setTimestamp(LocalDateTime.now().minusMinutes(5));
        messageRepository.save(message2);

        // Initialize another chat and messages
        List<User> participants2 = Arrays.asList(patient3, doctor1);
        Chat chat2 = new Chat();
        chat2.setParticipants(participants2);
        chatRepository.save(chat2);

        Message message3 = new Message();
        message3.setAuthor(patient3);
        message3.setChat(chat2);
        message3.setText("Hello Dr. Bob, I have a question.");
        message3.setTimestamp(LocalDateTime.now().minusMinutes(30));
        messageRepository.save(message3);
    }

}
