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

            String prompt = """
                    You are a professional resume reviewer. Analyze the following resume text and provide structured, detailed feedback in JSON format.
                    
                    Your response should include:
                    - title: a one-line summary of the candidate’s profile
                    - strengths: list of 4-6 key strengths in the resume
                    - improvements: 4-6 specific, constructive suggestions on how to improve the resume
                    - advice: an overall summary that helps the user understand their current standing and what to improve for better job prospects
                    
                    Make sure the advice is actionable and personalized. Do not repeat lines from the resume. Be honest but professional.
                    
                    Resume:
                    """ + resumeText;

            Map<String, Object> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", model);
            requestBody.put("messages", List.of(message));
            requestBody.put("temperature", 0.7);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.POST, entity, String.class);

            logger.info("OpenRouter Raw Response: {}", response.getBody());

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());

            if (root.has("choices") && root.get("choices").isArray() && root.get("choices").size() > 0) {
                String content = root.get("choices").get(0).get("message").get("content").asText();

                // Parse model's response as JSON
                JsonNode aiJson = mapper.readTree(content);

                String title = aiJson.path("title").asText();

                List<String> strengths = new ArrayList<>();
                aiJson.path("strengths").forEach(node -> strengths.add(node.asText()));

                List<String> improvements = new ArrayList<>();
                aiJson.path("improvements").forEach(node -> improvements.add(node.asText()));

                String advice = aiJson.has("advice") ? aiJson.get("advice").asText() : "";

                return new AIResponse(title, strengths, improvements, advice);
            } else if (root.has("error")) {
                return new AIResponse("OpenRouter Error: " + root.get("error").get("message").asText());
            } else {
                return new AIResponse("Error: 'choices' missing or empty in response.");
            }

        } catch (Exception e) {
            logger.error("Exception while calling OpenRouter API", e);
            return new AIResponse("Exception: " + e.getMessage());
        }
    }
}
