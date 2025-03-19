export const modalStyles = (theme: any, width?: string) => ({
  display: 'flex',
  flexDirection: 'column' as const,
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: width ?? '650px',
  maxHeight: '80vh',
  width: '100%',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: theme.shadows[5],
});
