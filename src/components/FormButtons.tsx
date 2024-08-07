import { Button, useTheme } from '@mui/material';
import { useTranslation } from 'next-i18next';
import React from 'react';

interface FormButtons {
  formData: any;
  onClick: (event: any) => void;
  isCreateCentered?: boolean;
  isCreatedFacilitator?: boolean;
  isCreatedLearner?: boolean;
  actions?: any;
  isSingleButton?: boolean;
}
const FormButtons: React.FC<FormButtons> = ({
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
    : isCreateCentered && !isCreatedFacilitator && !isCreatedLearner
      ? t('COMMON.CREATE')
      : isCreatedFacilitator && !isCreateCentered && !isCreatedLearner
        ? t('GUIDE_TOUR.NEXT')
        : isCreatedLearner && !isCreatedFacilitator && !isCreateCentered
          ? t('COMMON.CREATE')
          : t('COMMON.SUBMIT');

  console.log(isCreateCentered);

  return (
    <div
      style={{
        marginTop: '16px',
        display: 'flex',
        justifyContent: isSingleButton ? 'center' : 'space-between',
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
          width: isSingleButton ? '100%' : '48%',
        }}
        type="submit"
        onClick={() => onClick(formData)}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default FormButtons;
