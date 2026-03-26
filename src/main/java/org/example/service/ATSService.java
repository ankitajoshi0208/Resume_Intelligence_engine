package org.example.service; // This MUST be the first line

import opennlp.tools.postag.POSModel;
import opennlp.tools.postag.POSTaggerME;
import opennlp.tools.tokenize.WhitespaceTokenizer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ATSService {

    @Autowired
    private ResourceLoader resourceLoader;

    public Map<String, Object> calculateATS(String resume, String jd) {
        // Standardize all keywords to lowercase and trimmed
        Set<String> resumeSet = extractTechnicalKeywords(resume).stream()
                .map(String::toLowerCase)
                .map(String::trim)
                .collect(Collectors.toSet());

        Set<String> jdSet = extractTechnicalKeywords(jd).stream()
                .map(String::toLowerCase)
                .map(String::trim)
                .collect(Collectors.toSet());

        // Find matches
        Set<String> matched = jdSet.stream()
                .filter(resumeSet::contains)
                .collect(Collectors.toSet());

        // Find missing
        Set<String> missing = jdSet.stream()
                .filter(word -> !resumeSet.contains(word))
                .collect(Collectors.toSet());
        System.out.println("ATS Debug - Resume Keywords: " + resumeSet);
        System.out.println("ATS Debug - JD Keywords: " + jdSet);

        double score = jdSet.isEmpty() ? 0 : ((double) matched.size() / jdSet.size()) * 100;

        Map<String, Object> result = new HashMap<>();
        result.put("score", Math.round(score));
        result.put("matchedKeywords", new ArrayList<>(matched));
        result.put("missingKeywords", new ArrayList<>(missing));

        return result;
    }

    private List<String> extractTechnicalKeywords(String text) {
        if (text == null || text.trim().isEmpty()) return new ArrayList<>();

        List<String> keywords = new ArrayList<>();

        // 1. Define common "Noise" words to ignore (Stop Words)
        Set<String> stopWords = Set.of(
                "requirements", "location", "ideal", "candidate", "looking", "have",
                "with", "the", "and", "should", "join", "motivated", "responsibilities",
                "using", "experience", "knowledge", "proficient", "strong", "skills"
        );

        try {
            // 2. Clean the text: Keep letters, numbers, and tech symbols like + and #
            // This ensures "C++" and "C#" are not broken into "C"
            String cleanedText = text.toLowerCase().replaceAll("[^a-z0-9+#.\\s]", " ");

            // 3. Simple Tokenization (Split by space)
            String[] tokens = cleanedText.split("\\s+");

            for (String token : tokens) {
                String word = token.trim();
                // 4. Filter: Keep words longer than 2 chars that aren't stop words
                if (word.length() > 2 && !stopWords.contains(word)) {
                    keywords.add(word);
                }
            }

            System.out.println("✅ Keyword Extraction Successful. Found: " + keywords.size());

        } catch (Exception e) {
            System.out.println("❌ Extraction Error: " + e.getMessage());
        }

        return keywords;
    } }