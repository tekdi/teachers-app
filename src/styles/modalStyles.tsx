export const modalStyles = (theme: any) => ({
  width: '85%',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.palette.warning.A400,
  borderRadius: '8px',
  zIndex: '9999',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  '@media (min-width: 600px)': {
    width: '450px',
  },
});

export const SendCredstyle = (theme: any) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '65%',
  boxShadow: 24,
  bgcolor: '#fff',
  borderRadius: '16px',
  '@media (min-width: 600px)': {
    width: '450px',
  },
});
