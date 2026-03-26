package org.example.service;

import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class TikaService {

    public String extractText(MultipartFile file) {
        try {
            Tika tika = new Tika();

            String text = tika.parseToString(file.getInputStream());

            if (text == null || text.isEmpty()) {
                return "No text extracted from file.";
            }

            return text;

        } catch (Exception e) {
            e.printStackTrace();
            return "Error extracting text: " + e.getMessage();
        }
    }
}