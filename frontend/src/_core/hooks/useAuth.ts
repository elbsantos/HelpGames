import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { TRPCClientError } from "@trpc/client";
import { useCallback, useEffect, useMemo, useRef } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

// Chave usada para guardar o ID do último utilizador autenticado
const LAST_USER_KEY = "helpgames_last_user_id";

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = getLoginUrl() } =
    options ?? {};
  const utils = trpc.useUtils();
  const prevUserIdRef = useRef<number | null | undefined>(undefined);

  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.setData(undefined, null);
    },
  });

  // Função central de limpeza de cache — chamada no logout E na troca de utilizador
  const clearAllUserCache = useCallback(async () => {
    // Limpar o utilizador do cache imediatamente
    utils.auth.me.setData(undefined, null);

    // Invalidar (e limpar) TODAS as queries de dados do utilizador
    await utils.invalidate();

    // Limpar localStorage completamente (exceto preferências de UI)
    const sidebarWidth = localStorage.getItem("sidebar-width");
    localStorage.clear();
    if (sidebarWidth) localStorage.setItem("sidebar-width", sidebarWidth);
  }, [utils]);

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error: unknown) {
      if (
        error instanceof TRPCClientError &&
        error.data?.code === "UNAUTHORIZED"
      ) {
        // Já deslogado — limpar mesmo assim
      } else {
        throw error;
      }
    } finally {
      await clearAllUserCache();
      // Guardar que não há utilizador
      localStorage.removeItem(LAST_USER_KEY);
    }
  }, [logoutMutation, clearAllUserCache]);

  // Detectar troca de utilizador: se o ID mudou, limpar cache da conta anterior
  useEffect(() => {
    const currentUserId = meQuery.data?.id ?? null;

    // Ignorar o estado inicial (undefined = ainda a carregar)
    if (prevUserIdRef.current === undefined) {
      prevUserIdRef.current = currentUserId;
      if (currentUserId !== null) {
        localStorage.setItem(LAST_USER_KEY, String(currentUserId));
      }
      return;
    }

    // Se o utilizador mudou (troca de conta)
    if (prevUserIdRef.current !== currentUserId) {
      const lastSavedId = localStorage.getItem(LAST_USER_KEY);

      if (lastSavedId && currentUserId !== null && lastSavedId !== String(currentUserId)) {
        // Utilizador diferente — limpar todos os dados em cache
        clearAllUserCache().then(() => {
          localStorage.setItem(LAST_USER_KEY, String(currentUserId));
        });
      } else if (currentUserId !== null) {
        localStorage.setItem(LAST_USER_KEY, String(currentUserId));
      }

      prevUserIdRef.current = currentUserId;
    }
  }, [meQuery.data?.id, clearAllUserCache]);

  const state = useMemo(() => {
    return {
      user: meQuery.data ?? null,
      loading: meQuery.isLoading || logoutMutation.isPending,
      error: meQuery.error ?? logoutMutation.error ?? null,
      isAuthenticated: Boolean(meQuery.data),
    };
  }, [
    meQuery.data,
    meQuery.error,
    meQuery.isLoading,
    logoutMutation.error,
    logoutMutation.isPending,
  ]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (meQuery.isLoading || logoutMutation.isPending) return;
    if (state.user) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;

    window.location.href = redirectPath;
  }, [
    redirectOnUnauthenticated,
    redirectPath,
    logoutMutation.isPending,
    meQuery.isLoading,
    state.user,
  ]);

  return {
    ...state,
    refresh: () => meQuery.refetch(),
    logout,
  };
}
