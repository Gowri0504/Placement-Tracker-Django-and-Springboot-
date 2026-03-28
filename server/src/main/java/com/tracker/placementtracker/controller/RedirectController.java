package com.tracker.placementtracker.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class RedirectController {
    
    @RequestMapping(value = { "{path:[^\\.]*}", "/**/{path:[^\\.]*}" })
    public String redirect(jakarta.servlet.http.HttpServletRequest request) {
        String path = request.getRequestURI();
        if (path.startsWith("/api")) {
            return null; // Let Spring handle it normally
        }
        return "forward:/index.html";
    }
}
