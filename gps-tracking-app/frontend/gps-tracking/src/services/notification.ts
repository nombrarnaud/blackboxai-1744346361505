import { NotificationType, Notification } from '@/types';

class NotificationService {
  private subscribers: Array<(notification: Notification) => void> = [];
  private notificationId = 0;

  // Méthodes publiques pour afficher les notifications
  public success(message: string, title = 'Succès', duration = 3000): void {
    this.show({
      id: this.getNextId().toString(),
      type: NotificationType.SUCCESS,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      duration
    });
  }

  public error(message: string, title = 'Erreur', duration = 5000): void {
    this.show({
      id: this.getNextId().toString(),
      type: NotificationType.ERROR,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      duration
    });
  }

  public warning(message: string, title = 'Attention', duration = 4000): void {
    this.show({
      id: this.getNextId().toString(),
      type: NotificationType.WARNING,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      duration
    });
  }

  public info(message: string, title = 'Information', duration = 3000): void {
    this.show({
      id: this.getNextId().toString(),
      type: NotificationType.INFO,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      duration
    });
  }

  // Méthode générique pour afficher une notification
  private show(notification: Notification): void {
    this.notifySubscribers(notification);

    // Si une durée est spécifiée, supprimer automatiquement la notification
    if (notification.duration) {
      setTimeout(() => {
        this.notifySubscribers({
          ...notification,
          type: 'remove' as const,
        });
      }, notification.duration);
    }
  }

  // Gestion des abonnements pour les composants qui affichent les notifications
  public subscribe(callback: (notification: Notification) => void): void {
    this.subscribers.push(callback);
  }

  public unsubscribe(callback: (notification: Notification) => void): void {
    this.subscribers = this.subscribers.filter(subscriber => subscriber !== callback);
  }

  // Notifier tous les abonnés
  private notifySubscribers(notification: Notification): void {
    this.subscribers.forEach(subscriber => subscriber(notification));
  }

  // Générer un ID unique pour chaque notification
  private getNextId(): number {
    return ++this.notificationId;
  }

  // Méthode pour gérer les erreurs d'API
  public handleApiError(error: any): void {
    if (error.response) {
      // Erreur avec réponse du serveur
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          this.error(data.message || 'Requête invalide');
          break;
        case 401:
          this.error('Session expirée. Veuillez vous reconnecter.');
          break;
        case 403:
          this.error('Accès non autorisé');
          break;
        case 404:
          this.error('Ressource non trouvée');
          break;
        case 422:
          if (data.errors && Array.isArray(data.errors)) {
            data.errors.forEach((err: string) => this.error(err));
          } else {
            this.error(data.message || 'Erreur de validation');
          }
          break;
        case 500:
          this.error('Erreur serveur interne');
          break;
        default:
          this.error('Une erreur est survenue');
      }
    } else if (error.request) {
      // Erreur sans réponse du serveur
      this.error('Impossible de contacter le serveur');
    } else {
      // Erreur lors de la configuration de la requête
      this.error('Erreur de configuration de la requête');
    }

    // Log l'erreur pour le débogage
    console.error('API Error:', error);
  }

  // Méthode pour afficher une notification de confirmation
  public confirm(message: string, title = 'Confirmation'): Promise<boolean> {
    return new Promise((resolve) => {
      const notification: Notification = {
        id: this.getNextId().toString(),
        type: NotificationType.WARNING,
        title,
        message,
        timestamp: new Date().toISOString(),
        read: false,
        duration: 0, // Pas de suppression automatique
        onConfirm: () => handleConfirm(true),
        onCancel: () => handleConfirm(false)
      };

      const handleConfirm = (confirmed: boolean) => {
        this.notifySubscribers({
          ...notification,
          type: 'remove' as const,
        });
        resolve(confirmed);
      };

      this.notifySubscribers(notification);
    });
  }

  // Méthode pour afficher une notification de chargement
  public loading(message: string, title = 'Chargement'): () => void {
    const notification: Notification = {
      id: this.getNextId().toString(),
      type: NotificationType.INFO,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      duration: 0 // Pas de suppression automatique
    };

    this.notifySubscribers(notification);

    // Retourner une fonction pour arrêter le chargement
    return () => {
      this.notifySubscribers({
        ...notification,
        type: 'remove' as const,
      });
    };
  }
}

// Exporter une instance unique du service
export const notificationService = new NotificationService();
