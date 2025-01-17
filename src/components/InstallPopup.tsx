declare global {
  interface Window {
    wb: {
      messageSkipWaiting(): void;
      register(): void;
      addEventListener(
        name: string,
        callback: () => unknown
      ): void;
    };
  }
}

import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const InstallPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const { t } = useTranslation();
  const onConfirmActivate = () => {
    if (window.wb) {
      window.wb.messageSkipWaiting();
    }
  };

  useEffect(() => {
    const isAppInstalled =
      (navigator.standalone !== undefined && navigator.standalone) ||
      window.matchMedia('(display-mode: standalone)').matches;

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isAppInstalled && !localStorage.getItem('visited')) {
        localStorage.setItem('visited', 'true');
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.wb) {
      window.wb.addEventListener('controlling', () => {
        window.location.reload();
      });
      window.wb.addEventListener('waiting', () => setIsUpdateAvailable(true));
      window.wb.register();
    }
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
      } catch (error) {
        console.error('Installation failed:', error);
      } finally {
        setDeferredPrompt(null);
      }
    }
    setIsVisible(false);
  };

  if (!isVisible && !isUpdateAvailable) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        {isUpdateAvailable ? (
          <>
            <h4>{t('COMMON.UPDATE_AVAILABLE')}</h4>
            <p>{t('COMMON.RELOAD_TO_UPDATE')}</p>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#FDBE16', color: '#000000', borderRadius: 5 }}
              onClick={onConfirmActivate}
            >
              {t('COMMON.RELOAD')}
            </Button>
          </>
        ) : (
          <>
            <h4>{t('COMMON.INSTALL_APP_MESSAGE')}</h4>
            <p>{t('COMMON.INSTALL_APP_DESCRIPTION')}</p>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#FDBE16', color: '#000000', borderRadius: 5 }}
              onClick={handleInstall}
            >
              {t('COMMON.INSTALL')}
            </Button>
          </>
        )}
        <Button style={styles.closeButton} onClick={() => setIsVisible(false)}>
          {t('COMMON.CLOSE')}
        </Button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed' as 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  popup: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center' as 'center',
    width: '90%',
    maxWidth: '400px',
  },
  closeButton: {
    marginLeft: '10px',
    background: 'none',
    border: 'none',
    color: '#007BFF',
    cursor: 'pointer',
  },
};

export default InstallPopup;
