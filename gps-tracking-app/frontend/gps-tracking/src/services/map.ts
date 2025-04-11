import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Vehicle, TrackingData } from '@/types';

class MapService {
  private map: L.Map | null = null;
  private markers: { [key: number]: L.Marker } = {};
  private paths: { [key: number]: L.Polyline } = {};
  private markerLayer: L.LayerGroup | null = null;
  private pathLayer: L.LayerGroup | null = null;

  // Initialiser la carte
  public initMap(elementId: string, center: L.LatLngExpression = [0, 0], zoom = 13): void {
    this.map = L.map(elementId).setView(center, zoom);

    // Ajouter la couche OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);

    // Initialiser les couches pour les marqueurs et les chemins
    this.markerLayer = L.layerGroup().addTo(this.map);
    this.pathLayer = L.layerGroup().addTo(this.map);

    // Ajouter les contrôles de zoom
    L.control.zoom({
      position: 'bottomright'
    }).addTo(this.map);

    // Ajouter l'échelle
    L.control.scale({
      imperial: false,
      position: 'bottomleft'
    }).addTo(this.map);
  }

  // Mettre à jour les positions des véhicules
  public updateVehiclePositions(vehicles: Vehicle[]): void {
    if (!this.map || !this.markerLayer) return;

    vehicles.forEach(vehicle => {
      if (vehicle.lastPosition) {
        const position = L.latLng(vehicle.lastPosition.lat, vehicle.lastPosition.lng);
        
        if (this.markers[vehicle.id]) {
          // Mettre à jour la position du marqueur existant
          this.markers[vehicle.id].setLatLng(position);
        } else {
          // Créer un nouveau marqueur
          const marker = L.marker(position, {
            icon: this.createVehicleIcon(vehicle.type),
            title: vehicle.name
          });

          // Ajouter le popup avec les informations du véhicule
          marker.bindPopup(this.createVehiclePopup(vehicle));
          
          this.markers[vehicle.id] = marker;
          this.markerLayer.addLayer(marker);
        }
      }
    });

    // Supprimer les marqueurs des véhicules qui ne sont plus présents
    Object.keys(this.markers).forEach(id => {
      const vehicleId = parseInt(id);
      if (!vehicles.find(v => v.id === vehicleId)) {
        this.markerLayer?.removeLayer(this.markers[vehicleId]);
        delete this.markers[vehicleId];
      }
    });
  }

  // Afficher l'historique des déplacements d'un véhicule
  public showVehicleHistory(trackingData: TrackingData[]): void {
    if (!this.map || !this.pathLayer || trackingData.length === 0) return;

    // Créer le chemin
    const points = trackingData.map(data => 
      L.latLng(data.latitude, data.longitude)
    );

    const path = L.polyline(points, {
      color: '#0ea5e9',
      weight: 3,
      opacity: 0.8,
      smoothFactor: 1
    });

    // Ajouter les marqueurs de début et de fin
    const startMarker = L.marker(points[0], {
      icon: this.createCustomIcon('start', 'green')
    });

    const endMarker = L.marker(points[points.length - 1], {
      icon: this.createCustomIcon('end', 'red')
    });

    // Ajouter au layer et ajuster la vue
    this.pathLayer.clearLayers();
    this.pathLayer.addLayer(path);
    this.pathLayer.addLayer(startMarker);
    this.pathLayer.addLayer(endMarker);

    // Ajuster la vue pour montrer tout le trajet
    this.map.fitBounds(path.getBounds(), {
      padding: [50, 50]
    });
  }

  // Créer une icône personnalisée pour les véhicules
  private createVehicleIcon(type: string): L.Icon {
    const iconUrl = this.getVehicleIconUrl(type);
    return L.icon({
      iconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  }

  // Créer une icône personnalisée pour les marqueurs de début/fin
  private createCustomIcon(type: 'start' | 'end', color: string): L.DivIcon {
    return L.divIcon({
      className: `custom-div-icon`,
      html: `<div style="background-color: ${color};" class="marker-pin"></div>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42]
    });
  }

  // Obtenir l'URL de l'icône en fonction du type de véhicule
  private getVehicleIconUrl(type: string): string {
    const iconMap: { [key: string]: string } = {
      CAR: '/icons/car.svg',
      TRUCK: '/icons/truck.svg',
      VAN: '/icons/van.svg',
      MOTORCYCLE: '/icons/motorcycle.svg',
      OTHER: '/icons/vehicle.svg'
    };
    return iconMap[type] || iconMap.OTHER;
  }

  // Créer le contenu du popup pour un véhicule
  private createVehiclePopup(vehicle: Vehicle): string {
    return `
      <div class="vehicle-popup">
        <h3 class="font-bold">${vehicle.name}</h3>
        <p class="text-sm text-gray-600">${vehicle.registrationNumber}</p>
        ${vehicle.lastLocation ? `
          <div class="mt-2">
            <p class="text-sm">Vitesse: ${vehicle.lastLocation.speed} km/h</p>
            <p class="text-sm">Altitude: ${vehicle.lastLocation.altitude} m</p>
            <p class="text-sm">Batterie: ${vehicle.lastLocation.batteryLevel}%</p>
          </div>
        ` : ''}
      </div>
    `;
  }

  // Nettoyer la carte
  public cleanup(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.markers = {};
      this.paths = {};
      this.markerLayer = null;
      this.pathLayer = null;
    }
  }

  // Redimensionner la carte
  public resize(): void {
    if (this.map) {
      this.map.invalidateSize();
    }
  }

  // Centrer la carte sur un véhicule
  public centerOnVehicle(vehicleId: number): void {
    const marker = this.markers[vehicleId];
    if (this.map && marker) {
      this.map.setView(marker.getLatLng(), 15);
      marker.openPopup();
    }
  }

  // Activer/désactiver le suivi automatique d'un véhicule
  public toggleVehicleTracking(vehicleId: number, enabled: boolean): void {
    const marker = this.markers[vehicleId];
    if (this.map && marker && enabled) {
      this.map.setView(marker.getLatLng(), this.map.getZoom());
    }
  }
}

// Exporter une instance unique du service
export const mapService = new MapService();
