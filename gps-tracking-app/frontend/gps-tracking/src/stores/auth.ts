import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiService } from '@/services/api';
import { notificationService } from '@/services/notification';
import type {
  User,
  BusinessUser,
  SimpleUser,
  LoginCredentials,
  BusinessRegistration,
  SimpleRegistration
} from '@/types';

export const useAuthStore = defineStore('auth', () => {
  // État
  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref<User | null>(null);
  const loading = ref(false);

  // Getters
  const isAuthenticated = computed(() => !!token.value);
  const isBusinessUser = computed(() => user.value?.type === 'business');

  // Actions
  const setToken = (newToken: string | null) => {
    token.value = newToken;
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      loading.value = true;
      const response = await apiService.post<{ token: string; user: User }>('/auth/login', credentials);
      setToken(response.token);
      user.value = response.user;
      notificationService.success('Connexion réussie');
    } catch (error) {
      console.error('Erreur de connexion:', error);
      notificationService.error('Identifiants invalides');
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const registerBusiness = async (registration: BusinessRegistration) => {
    try {
      loading.value = true;
      const response = await apiService.post<{ token: string; user: BusinessUser }>(
        '/auth/register/business',
        registration
      );
      setToken(response.token);
      user.value = response.user;
      notificationService.success('Inscription réussie');
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      notificationService.error('Erreur lors de l\'inscription');
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const registerSimple = async (registration: SimpleRegistration) => {
    try {
      loading.value = true;
      const response = await apiService.post<{ token: string; user: SimpleUser }>(
        '/auth/register/simple',
        registration
      );
      setToken(response.token);
      user.value = response.user;
      notificationService.success('Inscription réussie');
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      notificationService.error('Erreur lors de l\'inscription');
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    setToken(null);
    user.value = null;
    notificationService.info('Déconnexion réussie');
  };

  const fetchCurrentUser = async () => {
    try {
      loading.value = true;
      const currentUser = await apiService.get<User>('/auth/me');
      user.value = currentUser;
    } catch (error) {
      console.error('Erreur lors du chargement de l\'utilisateur:', error);
      logout();
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const updateProfile = async (profileData: Partial<User>) => {
    try {
      loading.value = true;
      const updatedUser = await apiService.put<User>('/auth/profile', profileData);
      user.value = updatedUser;
      notificationService.success('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      notificationService.error('Impossible de mettre à jour le profil');
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const changePassword = async (passwordData: { currentPassword: string; newPassword: string }) => {
    try {
      loading.value = true;
      await apiService.post('/auth/change-password', passwordData);
      notificationService.success('Mot de passe modifié avec succès');
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      notificationService.error('Impossible de modifier le mot de passe');
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      loading.value = true;
      await apiService.post('/auth/reset-password', { email });
      notificationService.success('Instructions de réinitialisation envoyées par email');
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      notificationService.error('Impossible d\'envoyer les instructions de réinitialisation');
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const initialize = async () => {
    if (token.value && !user.value) {
      await fetchCurrentUser();
    }
  };

  // Vérification du token à l'expiration
  const checkTokenExpiration = () => {
    if (token.value) {
      try {
        const tokenData = JSON.parse(atob(token.value.split('.')[1]));
        const expirationTime = tokenData.exp * 1000; // Convertir en millisecondes
        
        if (Date.now() >= expirationTime) {
          logout();
          notificationService.warning('Session expirée, veuillez vous reconnecter');
          return false;
        }
        return true;
      } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);
        logout();
        return false;
      }
    }
    return false;
  };

  // Rafraîchissement automatique du token
  const refreshTokenInterval = setInterval(() => {
    if (token.value && checkTokenExpiration()) {
      apiService.post('/auth/refresh-token')
        .then((response: any) => {
          setToken(response.token);
        })
        .catch((error) => {
          console.error('Erreur lors du rafraîchissement du token:', error);
          logout();
        });
    }
  }, 5 * 60 * 1000); // Toutes les 5 minutes

  // Nettoyage à la destruction du store
  const cleanup = () => {
    clearInterval(refreshTokenInterval);
  };

  return {
    // État
    token,
    user,
    loading,

    // Getters
    isAuthenticated,
    isBusinessUser,

    // Actions
    login,
    registerBusiness,
    registerSimple,
    logout,
    fetchCurrentUser,
    updateProfile,
    changePassword,
    resetPassword,
    initialize,
    cleanup
  };
});
