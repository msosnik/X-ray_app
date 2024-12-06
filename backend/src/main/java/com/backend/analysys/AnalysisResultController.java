package com.backend.analysys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/analysis-result")
public class AnalysisResultController {

    @Autowired
    private AnalysisResultService analysisResultService;

    @GetMapping
    public List<AnalysisResultDTO> getAllAnalysisResults() {
        return analysisResultService.getAllAnalysisResults();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnalysisResultDTO> getAnalysisResultById(@PathVariable int id) {
        return analysisResultService.getAnalysisResultById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/image/{id}")
    public ResponseEntity<AnalysisResultDTO> getAnalysisResultByImageId(@PathVariable int id) {
        return analysisResultService.getAnalysisResultById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping
    public AnalysisResult createAnalysisResult(@RequestBody AnalysisResult analysisResult) {
        return analysisResultService.createAnalysisResult(analysisResult);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnalysisResult> updateAnalysisResult(@PathVariable int id, @RequestBody AnalysisResult updatedResult) {
        try {
            return ResponseEntity.ok(analysisResultService.updateAnalysisResult(id, updatedResult));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnalysisResult(@PathVariable int id) {
        analysisResultService.deleteAnalysisResult(id);
        return ResponseEntity.noContent().build();
    }
}
