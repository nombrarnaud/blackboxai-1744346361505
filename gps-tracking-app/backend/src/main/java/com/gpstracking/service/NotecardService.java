package com.gpstracking.service;

import com.gpstracking.model.TrackingData;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class NotecardService {
    
    @Value("${notecard.api.url}")
    private String notecardApiUrl;
    
    @Value("${notecard.product.uid}")
    private String productUid;
    
    @Value("${notecard.hub.name}")
    private String hubName;
    
    private final RestTemplate restTemplate;
    private final VehicleService vehicleService;
    
    // Cache pour stocker les dernières données reçues par véhicule
    private final Map<String, TrackingData> lastDataCache = new ConcurrentHashMap<>();

    public NotecardService(VehicleService vehicleService) {
        this.restTemplate = new RestTemplate();
        this.vehicleService = vehicleService;
    }

    public void handleNotecardWebhook(Map<String, Object> payload) {
        try {
            // Extraction des données du payload Notecard
            String deviceId = (String) payload.get("device");
            Map<String, Object> body = (Map<String, Object>) payload.get("body");
            
            // Conversion des données en objet TrackingData
            TrackingData trackingData = new TrackingData();
            trackingData.setLatitude((Double) body.get("lat"));
            trackingData.setLongitude((Double) body.get("lon"));
            trackingData.setSpeed((Double) body.get("speed"));
            trackingData.setAltitude((Double) body.get("alt"));
            trackingData.setBatteryLevel((Double) body.get("bat"));
            trackingData.setSignalStrength((String) body.get("sig"));
            trackingData.setTemperature((Double) body.get("temp"));

            // Mise en cache des données
            lastDataCache.put(deviceId, trackingData);

            // Envoi des données au service de véhicule
            // Note: Vous devrez implémenter une logique pour mapper deviceId vers vehicleId
            Long vehicleId = mapDeviceIdToVehicleId(deviceId);
            if (vehicleId != null) {
                vehicleService.addTrackingData(vehicleId, trackingData);
            }

        } catch (Exception e) {
            // Log l'erreur et continue
            System.err.println("Erreur lors du traitement des données Notecard: " + e.getMessage());
        }
    }

    public void sendCommandToDevice(String deviceId, String command) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = Map.of(
            "req", "note.add",
            "product", productUid,
            "device", deviceId,
            "body", Map.of(
                "command", command
            )
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
        
        try {
            restTemplate.postForObject(notecardApiUrl, request, String.class);
        } catch (Exception e) {
            System.err.println("Erreur lors de l'envoi de la commande au dispositif: " + e.getMessage());
        }
    }

    // Méthode pour récupérer les dernières données d'un véhicule depuis le cache
    public TrackingData getLastKnownData(String deviceId) {
        return lastDataCache.get(deviceId);
    }

    // Cette méthode devrait être implémentée pour mapper les IDs des dispositifs Notecard
    // vers les IDs de véhicules dans votre système
    private Long mapDeviceIdToVehicleId(String deviceId) {
        // Implémentez votre logique de mapping ici
        // Par exemple, vous pourriez avoir une table en base de données qui fait le lien
        return null; // À implémenter
    }
}
