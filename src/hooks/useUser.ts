import { useAuthStore } from '../stores/authStore';

export const useUser = () => {
  const { user, session, loading, signOut } = useAuthStore();
  return { user, session, loading, signOut };
};
