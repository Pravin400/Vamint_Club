package com.vamint.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final Cloudinary cloudinary;

    public Map<String, Object> upload(MultipartFile file, Map<String, Object> options) throws IOException {
        if (file == null || file.isEmpty())
            return null;
        @SuppressWarnings("unchecked")
        Map<String, Object> result = (Map<String, Object>) cloudinary.uploader().upload(file.getBytes(),
                options == null ? ObjectUtils.emptyMap() : options);
        return result;
    }

    public String uploadAndGetUrl(MultipartFile file, Map<String, Object> options) throws IOException {
        Map<String, Object> result = upload(file, options);
        if (result == null)
            return null;
        return (String) result.get("secure_url");
    }
}
