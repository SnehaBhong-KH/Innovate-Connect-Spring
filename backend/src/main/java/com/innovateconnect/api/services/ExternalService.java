package com.innovateconnect.api.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class ExternalService {

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<?, ?> getLeetCodeStats(String username) {
        String url = "https://leetcode-stats-api.herokuapp.com/" + username;
        return restTemplate.getForObject(url, Map.class);
    }

    public Object getGitHubRepos(String username) {
        String url = "https://api.github.com/users/" + username + "/repos";
        return restTemplate.getForObject(url, Object.class);
    }
}
