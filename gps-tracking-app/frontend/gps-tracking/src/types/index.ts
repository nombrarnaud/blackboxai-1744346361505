// Types d'utilisateurs
export interface User {
  id: number;
  email: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  type: 'business' | 'simple';
}

export interface BusinessUser extends User {
  companyName: string;
  registrationNumber: string;
  managerFullName: string;
}

export interface SimpleUser extends User {
  fullName: string;
  idCardNumber: string;
}

// Types pour l'authentification
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface BusinessRegistration {
  email: string;
  password: string;
  companyName: string;
  registrationNumber: string;
  managerFullName: string;
  phoneNumber: string;
}

export interface SimpleRegistration {
  email: string;
  password: string;
  fullName: string;
  idCardNumber: string;
  phoneNumber: string;
}

export interface AuthResponse {
  token: string;
  user: BusinessUser | SimpleUser;
}

// Types de véhicules et données de suivi
export interface Vehicle {
  id: number;
  name: string;
  identifier: string;
  registrationNumber: string;
  type: VehicleType;
  status: VehicleStatus;
  userId: number;
  createdAt: string;
  updatedAt: string;
  lastUpdate: string;
  lastPosition?: {
    lat: number;
    lng: number;
  };
  lastLocation?: TrackingData;
}

// Filtres pour les véhicules
export interface VehicleFilters {
  search?: string;
  type?: VehicleType;
  status?: VehicleStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface TrackingData {
  id: number;
  vehicleId: number;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  heading: number;
  timestamp: string;
  batteryLevel: number;
  signalStrength: number;
  temperature: number;
}

// Types pour les notifications
export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

export interface BaseNotification {
  id: string;
  type: NotificationType | 'remove';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  duration?: number;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export type Notification = BaseNotification;

// Types pour les métriques
export interface HistoryMetrics {
  totalDistance: number;
  averageSpeed: number;
  maxSpeed: number;
  totalDuration: number;
  stops: number;
  alerts: number;
}

// Énumérations
export enum VehicleType {
  CAR = 'CAR',
  TRUCK = 'TRUCK',
  VAN = 'VAN',
  MOTORCYCLE = 'MOTORCYCLE',
  OTHER = 'OTHER'
}

export enum VehicleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance'
}

// Types pour la pagination
export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  content: T[];
  number: number;
  totalElements: number;
  size: number;
  totalPages: number;
}

// Types pour les alertes
export interface Alert {
  id: number;
  vehicleId: number;
  type: AlertType;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export enum AlertType {
  SPEED_LIMIT = 'SPEED_LIMIT',
  GEOFENCE = 'GEOFENCE',
  BATTERY_LOW = 'BATTERY_LOW',
  SIGNAL_LOST = 'SIGNAL_LOST',
  MAINTENANCE_DUE = 'MAINTENANCE_DUE'
}

// Types pour les métriques
export interface VehicleMetrics {
  currentSpeed: number;
  averageSpeed: number;
  distance: number;
  runtime: number;
  fuelLevel?: number;
  temperature: number;
  batteryLevel: number;
  signalStrength: number;
}

// Types pour les événements
export interface VehicleEvent {
  id: number;
  vehicleId: number;
  type: VehicleEventType;
  description: string;
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export enum VehicleEventType {
  START = 'START',
  STOP = 'STOP',
  IDLE = 'IDLE',
  ALERT = 'ALERT',
  MAINTENANCE = 'MAINTENANCE'
}

// Types pour les préférences utilisateur
export interface UserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  language: string;
  timezone: string;
  distanceUnit: 'km' | 'mi';
  speedUnit: 'kmh' | 'mph';
  theme: 'light' | 'dark' | 'system';
}

// Types pour les rapports
export interface Report {
  id: number;
  type: ReportType;
  format: ReportFormat;
  dateRange: {
    start: string;
    end: string;
  };
  status: ReportStatus;
  url?: string;
  createdAt: string;
}

export enum ReportType {
  ACTIVITY = 'ACTIVITY',
  ALERTS = 'ALERTS',
  MAINTENANCE = 'MAINTENANCE',
  ANALYTICS = 'ANALYTICS'
}

export enum ReportFormat {
  PDF = 'PDF',
  CSV = 'CSV',
  EXCEL = 'EXCEL'
}

export enum ReportStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}
