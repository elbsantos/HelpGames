import { useCallback, useEffect, useState } from "react";

export interface PushNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
}

export function usePushNotification() {
  const [isSupported, setIsSupported] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);

  // Verificar suporte e permissão ao montar
  useEffect(() => {
    const supported = "Notification" in window;
    setIsSupported(supported);

    if (supported) {
      setIsPermissionGranted(Notification.permission === "granted");
    }
  }, []);

  // Solicitar permissão
  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      console.warn("Notificações push não são suportadas neste navegador");
      return false;
    }

    if (Notification.permission === "granted") {
      setIsPermissionGranted(true);
      return true;
    }

    if (Notification.permission !== "denied") {
      try {
        const permission = await Notification.requestPermission();
        const granted = permission === "granted";
        setIsPermissionGranted(granted);
        return granted;
      } catch (error) {
        console.error("Erro ao solicitar permissão de notificação:", error);
        return false;
      }
    }

    return false;
  }, [isSupported]);

  // Enviar notificação
  const sendNotification = useCallback(
    async (options: PushNotificationOptions) => {
      if (!isSupported) {
        console.warn("Notificações push não são suportadas");
        return null;
      }

      // Solicitar permissão se ainda não foi concedida
      if (!isPermissionGranted) {
        const granted = await requestPermission();
        if (!granted) {
          console.warn("Permissão de notificação foi negada");
          return null;
        }
      }

      try {
        const notification = new Notification(options.title, {
          body: options.body,
          icon: options.icon || "/logo.svg",
          badge: options.badge,
          tag: options.tag,
          requireInteraction: options.requireInteraction ?? false,
        });

        // Fechar notificação após 5 segundos se não exigir interação
        if (!options.requireInteraction) {
          setTimeout(() => notification.close(), 5000);
        }

        return notification;
      } catch (error) {
        console.error("Erro ao enviar notificação:", error);
        return null;
      }
    },
    [isSupported, isPermissionGranted, requestPermission]
  );

  return {
    isSupported,
    isPermissionGranted,
    requestPermission,
    sendNotification,
  };
}
