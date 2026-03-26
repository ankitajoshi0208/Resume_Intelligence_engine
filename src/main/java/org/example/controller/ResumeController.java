package org.example.controller;

import org.example.Dto.AIResponse;
import org.example.Dto.ResumeRequest;
import org.example.service.AIService;
import org.example.service.TikaService;
import org.example.service.ATSService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = "*")
public class ResumeController {

    private static final Logger logger = LoggerFactory.getLogger(ResumeController.class);

    @Autowired
    private AIService aiService;

    @Autowired
    private ATSService atsService;

    @Autowired
    private TikaService tikaService;

    // ✅ METHOD 1: TEXT ANALYSIS
    @PostMapping("/analyze")
    public Map<String, Object> analyze(@RequestBody ResumeRequest request) {
        Map<String, Object> finalResponse = new HashMap<>();

        // Always do AI Analysis
        AIResponse aiResponse = aiService.analyzeText(request.getResumeText());
        finalResponse.put("ai", aiResponse);

        // Only do ATS if JD is provided
        if (request.getJobDescription() != null && !request.getJobDescription().trim().isEmpty()) {
            Map<String, Object> ats = atsService.calculateATS(request.getResumeText(), request.getJobDescription());
            finalResponse.put("ats", ats);
        }

        return finalResponse;
    }

    // ✅ METHOD 2: FILE UPLOAD (Updated to include ATS Score)
    @PostMapping("/upload")
    public Map<String, Object> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("jobDescription") String jobDescription) { // Receive JD here

        Map<String, Object> finalResponse = new HashMap<>();
        try {
            logger.info("📄 Processing file: {}", file.getOriginalFilename());

            // 1. Extract Text
            String text = tikaService.extractText(file);
            text = text.replaceAll("\\s+", " ");

            // 2. AI Analysis
            AIResponse aiResponse = aiService.analyzeText(text);

            // 3. ATS Score Calculation
            Map<String, Object> ats = atsService.calculateATS(text, jobDescription);

            finalResponse.put("ai", aiResponse);
            finalResponse.put("ats", ats);

        } catch (Exception e) {
            logger.error("Error processing file upload", e);
            finalResponse.put("error", "Error: " + e.getMessage());
        }
        return finalResponse;
    }
}