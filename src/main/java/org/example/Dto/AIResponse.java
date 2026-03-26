package org.example.Dto;

import java.util.List;

public class AIResponse {

    private String title;
    private List<String> strengths;
    private List<String> improvements;
    private String advice;

    // Constructor for success
    public AIResponse(String title, List<String> strengths, List<String> improvements, String advice) {
        this.title = title;
        this.strengths = strengths;
        this.improvements = improvements;
        this.advice = advice;
    }

    // Constructor for error
    public AIResponse(String errorMessage) {
        this.title = "Error";
        this.advice = errorMessage;
    }

    // Getters
    public String getTitle() { return title; }
    public List<String> getStrengths() { return strengths; }
    public List<String> getImprovements() { return improvements; }
    public String getAdvice() { return advice; }
}