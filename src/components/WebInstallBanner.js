import { useEffect, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { styles } from "../styles/appStyles";

function detectIos() {
  if (Platform.OS !== "web" || typeof navigator === "undefined") {
    return false;
  }

  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function isStandalone() {
  if (Platform.OS !== "web" || typeof window === "undefined") {
    return false;
  }

  const matchesDisplayMode = typeof window.matchMedia === "function"
    ? window.matchMedia("(display-mode: standalone)").matches
    : false;
  const iosStandalone = typeof navigator !== "undefined" && navigator.standalone === true;

  return matchesDisplayMode || iosStandalone;
}

export function WebInstallBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "web") {
      return undefined;
    }

    setIsIos(detectIos());
    setIsVisible(!isStandalone());

    function handleBeforeInstallPrompt(event) {
      event.preventDefault();
      setDeferredPrompt(event);
      setIsVisible(true);
    }

    function handleInstalled() {
      setIsVisible(false);
      setDeferredPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }

  if (Platform.OS !== "web" || !isVisible) {
    return null;
  }

  return (
    <View style={styles.installBanner}>
      <View style={styles.installBannerTextWrap}>
        <Text style={styles.installBannerTitle}>Instalar app</Text>
        <Text style={styles.installBannerText}>
          {isIos
            ? "En Safari, toca Compartir y luego Agregar a pantalla de inicio."
            : deferredPrompt
              ? "Instalala en tu telefono para abrirla como app."
              : "En tu navegador, usa Agregar a pantalla principal o Instalar app."}
        </Text>
      </View>
      {deferredPrompt && !isIos ? (
        <Pressable style={styles.installBannerButton} onPress={handleInstall}>
          <Text style={styles.installBannerButtonText}>Instalar</Text>
        </Pressable>
      ) : (
        <Pressable style={styles.installBannerClose} onPress={() => setIsVisible(false)}>
          <Text style={styles.installBannerCloseText}>Cerrar</Text>
        </Pressable>
      )}
    </View>
  );
}
