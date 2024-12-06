package com.backend.annotation;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/annotation")
public class AnnotationController {

    @Autowired
    private AnnotationService annotationService;

    @PostMapping
    public ResponseEntity<AnnotationDTO> createAnnotation(@RequestBody AnnotationDTO annotationDTO) {
        AnnotationDTO savedAnnotation = annotationService.saveAnnotation(annotationDTO);
        return ResponseEntity.ok(savedAnnotation);
    }

    @GetMapping
    public ResponseEntity<List<AnnotationDTO>> getAllAnnotations() {
        List<AnnotationDTO> annotations = annotationService.getAllAnnotations();
        return ResponseEntity.ok(annotations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnnotationDTO> getAnnotationById(@PathVariable int id) {
        AnnotationDTO annotation = annotationService.getAnnotationById(id);
        return ResponseEntity.ok(annotation);
    }

    @GetMapping("/{id}/json")
    public ResponseEntity<JsonNode> getAnnotationJsonDataById(@PathVariable int id) {
        JsonNode jsonData = annotationService.getAnnotationJsonDataById(id);
        return ResponseEntity.ok(jsonData);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnnotationDTO> updateAnnotation(@PathVariable int id, @RequestBody AnnotationDTO annotationDTO) {
        AnnotationDTO updatedAnnotation = annotationService.updateAnnotation(id, annotationDTO);
        return ResponseEntity.ok(updatedAnnotation);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnnotation(@PathVariable int id) {
        annotationService.deleteAnnotation(id);
        return ResponseEntity.noContent().build();
    }
}
