package org.example.Dto;

public class ResumeRequest {
    private String resumeText;
    private String jobDescription;

    // Default Constructor (Required for JSON mapping)
    public ResumeRequest() {}

    // Multi-arg Constructor
    public ResumeRequest(String resumeText, String jobDescription) {
        this.resumeText = resumeText;
        this.jobDescription = jobDescription;
    }

    // Getters and Setters
    public String getResumeText() {
        return resumeText;
    }

    public void setResumeText(String resumeText) {
        this.resumeText = resumeText;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }
}