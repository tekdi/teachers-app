import { Box, Button, Divider, useTheme } from '@mui/material';
import { useTranslation } from 'next-i18next';
import React from 'react';

interface IFormButtons {
  formData: any;
  onClick: (formData: any) => void;
  isCreateCentered?: boolean;
  isCreatedFacilitator?: boolean;
  isCreatedLearner?: boolean;
  actions?: any;
  isSingleButton?: boolean;
}
const FormButtons: React.FC<IFormButtons> = ({
  formData,
  onClick,
  isCreateCentered,
  isCreatedFacilitator,
  isCreatedLearner,
  actions,
  isSingleButton,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();

  const buttonText = isSingleButton
    ? t('COMMON.SAVE')
    : (isCreateCentered && !isCreatedFacilitator && !isCreatedLearner) ||
        (isCreatedLearner && !isCreatedFacilitator && !isCreateCentered)
      ? t('COMMON.CREATE')
      : t('GUIDE_TOUR.NEXT');

  return (
    <>
      <Divider />
      <Box
        sx={{
          padding: '16px 16px 16px',
          background: theme.palette.warning['A400'],
          display: 'flex',
          justifyContent: 'center',
          gap: '15px',
          borderRadius: '10px',
        }}
      >
        {!isSingleButton && !isCreateCentered && !isCreatedFacilitator && (
          <Button
            variant="outlined"
            color="primary"
            sx={{
              '&.Mui-disabled': {
                backgroundColor: theme?.palette?.primary?.main,
              },
              minWidth: '84px',
              height: '2.5rem',
              padding: theme.spacing(1),
              fontWeight: '500',
              width: '48%',
            }}
            type="submit"
            onClick={() => actions.back()}
          >
            {t('COMMON.BACK')}
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          sx={{
            '&.Mui-disabled': {
              backgroundColor: theme?.palette?.primary?.main,
            },
            minWidth: '84px',
            height: '2.5rem',
            padding: theme.spacing(1),
            fontWeight: '500',
            width:
              !isSingleButton && !isCreateCentered && !isCreatedFacilitator
                ? '50%'
                : '100%',
          }}
          type="submit"
          onClick={() => onClick(formData)}
        >
          {buttonText}
        </Button>
      </Box>
    </>
  );
};

export default FormButtons;
