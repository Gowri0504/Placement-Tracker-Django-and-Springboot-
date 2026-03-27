package com.tracker.placementtracker.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class RedirectController {
    
    @RequestMapping(value = "/{path:[^\\.]*}")
    public String redirect() {
        // Forward all non-API and non-static resource requests to index.html
        return "forward:/index.html";
    }
}
