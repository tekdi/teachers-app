import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const InstallPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const { t } = useTranslation();

  useEffect(() => {
    // Check if the app is installed (iOS Safari or display-mode: standalone)
    const isAppInstalled =
      (navigator.standalone !== undefined && navigator.standalone) ||
      window.matchMedia('(display-mode: standalone)').matches;

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      console.log('beforeinstallprompt event fired');
      setDeferredPrompt(e);
      if (!isAppInstalled && !localStorage.getItem('visited')) {
        localStorage.setItem('visited', 'true');
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt(); // Show the install prompt
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
    } else {
      console.log('No deferredPrompt available.');
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h3>{t('COMMON.INSTALL_APP_MESSAGE')}</h3>
        <p>{t('COMMON.INSTALL_APP_DESCRIPTION')}</p>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#FDBE16',
            '&:hover': {
              backgroundColor: '#F0A500',
            },
            color: '#FFFFFF',
          }}
          onClick={handleInstall}
          className="one-line-text"
        >
          {t('COMMON.INSTALL')}
        </Button>
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
  button: {
    backgroundColor: '#f69435',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  closeButton: {
    marginTop: '10px',
    background: 'none',
    border: 'none',
    color: '#007BFF',
    cursor: 'pointer',
  },
};
export default InstallPopup;
