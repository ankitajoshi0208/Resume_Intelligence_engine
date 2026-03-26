package org.example.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.Dto.AIResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AIService {

    private static final Logger logger = LoggerFactory.getLogger(AIService.class);

    @Value("${openrouter.api.key}")
    private String apiKey;

    @Value("${openrouter.api.url}")
    private String apiUrl;

    @Value("${openrouter.model}")
    private String model;

    public AIResponse analyzeText(String resumeText) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);
            headers.set("HTTP-Referer", "https://openrouter.ai");
            headers.set("X-Title", "ResumeAnalyzerAI");

            String prompt = "Analyze this resume and provide feedback in JSON format. Return ONLY raw JSON. No markdown. No backticks.\n\nResume:\n" + resumeText;

            Map<String, Object> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", model);
            requestBody.put("messages", List.of(message));
            requestBody.put("temperature", 0.3);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.POST, entity, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());

            if (root.has("choices") && root.get("choices").isArray() && !root.get("choices").isEmpty()) {
                String content = root.get("choices").get(0).get("message").get("content").asText();

                // SIMPLE CLEANING: Just remove markdown markers and trim
                String cleanJson = content.replace("```json", "").replace("```", "").trim();

                logger.info("Cleaned JSON: {}", cleanJson);

                JsonNode aiJson = mapper.readTree(cleanJson);

                String title = aiJson.path("title").asText();
                List<String> strengths = new ArrayList<>();
                aiJson.path("strengths").forEach(node -> strengths.add(node.asText()));

                List<String> improvements = new ArrayList<>();
                aiJson.path("improvements").forEach(node -> improvements.add(node.asText()));

                String advice = aiJson.path("advice").asText();

                return new AIResponse(title, strengths, improvements, advice);
            } else {
                return new AIResponse("Error: Invalid API response");
            }

        } catch (Exception e) {
            logger.error("Error", e);
            return new AIResponse("Exception: " + e.getMessage());
        }
    }
}