package com.gpstracking.controller;

import com.gpstracking.service.NotecardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notecard")
public class NotecardWebhookController {
    
    private final NotecardService notecardService;

    public NotecardWebhookController(NotecardService notecardService) {
        this.notecardService = notecardService;
    }

    @PostMapping("/webhook")
    public ResponseEntity<Void> handleWebhook(@RequestBody Map<String, Object> payload) {
        notecardService.handleNotecardWebhook(payload);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/command/{deviceId}")
    public ResponseEntity<Void> sendCommand(
            @PathVariable String deviceId,
            @RequestBody Map<String, String> commandRequest) {
        String command = commandRequest.get("command");
        if (command == null || command.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        notecardService.sendCommandToDevice(deviceId, command);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/data/{deviceId}")
    public ResponseEntity<Object> getLastKnownData(@PathVariable String deviceId) {
        return ResponseEntity.ok(notecardService.getLastKnownData(deviceId));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        return ResponseEntity
                .badRequest()
                .body("Erreur lors du traitement de la requête Notecard: " + e.getMessage());
    }
}
