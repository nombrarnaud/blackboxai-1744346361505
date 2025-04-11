import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { notificationService } from './notification';

class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Intercepteur pour ajouter le token d'authentification
    this.api.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Intercepteur pour gérer les erreurs globalement
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          // Gérer les erreurs de réponse du serveur
          switch (error.response.status) {
            case 401:
              // Token expiré ou invalide
              this.clearToken();
              window.location.href = '/login';
              break;
            case 403:
              notificationService.error('Accès non autorisé');
              break;
            case 404:
              notificationService.error('Ressource non trouvée');
              break;
            case 500:
              notificationService.error('Erreur serveur');
              break;
            default:
              notificationService.error('Une erreur est survenue');
          }
        } else if (error.request) {
          // Erreur de réseau
          notificationService.error('Impossible de contacter le serveur');
        } else {
          // Erreur de configuration
          notificationService.error('Erreur de configuration de la requête');
        }
        return Promise.reject(error);
      }
    );
  }

  // Méthode pour définir le token
  public setToken(token: string): void {
    this.token = token;
  }

  // Méthode pour supprimer le token
  public clearToken(): void {
    this.token = null;
  }

  // Méthodes HTTP génériques
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url, config);
    return response.data;
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.patch(url, data, config);
    return response.data;
  }

  // Méthode pour gérer les uploads de fichiers
  public async upload<T>(url: string, file: File, onProgress?: (percentage: number) => void): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentage);
        }
      },
    };

    const response: AxiosResponse<T> = await this.api.post(url, formData, config);
    return response.data;
  }

  // Méthode pour gérer les téléchargements de fichiers
  public async download(url: string, filename: string): Promise<void> {
    const response = await this.api.get(url, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  // Méthode pour annuler les requêtes en cours
  public getCancelToken() {
    return axios.CancelToken.source();
  }
}

// Exporter une instance unique du service
export const apiService = new ApiService();
