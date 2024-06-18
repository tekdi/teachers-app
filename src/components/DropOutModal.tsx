import * as React from 'react';

import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { Theme, useTheme } from '@mui/material/styles';

import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'next-i18next';

interface DropOutModalProps {
  open: boolean;
  onClose: (confirmed: boolean) => void;
}

function DropOutModal({ open, onClose }: DropOutModalProps) {
  const [personName, setPersonName] = React.useState<string[]>([]);
  const { t } = useTranslation();

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '85%',
    boxShadow: 24,
    bgcolor: '#fff',
    borderRadius: '24px',
    '@media (min-width: 600px)': {
      width: '450px',
    },
  };

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(typeof value === 'string' ? value.split(',') : value);
  };
  const theme = useTheme<any>();

  return (
    <React.Fragment>
      <Modal
        open={open}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style }}>
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            sx={{ padding: '18px 16px' }}
          >
            <Box marginBottom={'0px'}>
              <Typography
                variant="h2"
                sx={{
                  color: theme.palette.warning['A200'],
                  fontSize: '14px',
                }}
                component="h2"
              >
                {t('COMMON.DROP_OUT')}
              </Typography>
            </Box>
            <CloseIcon
              sx={{
                cursor: 'pointer',
                color: theme.palette.warning['A200'],
              }}
              onClick={() => onClose(false)}
            />
          </Box>
          <Divider />
          <Box sx={{ padding: '10px 18px' }}>
            <FormControl sx={{ mt: 1, width: '100%' }}>
              <InputLabel
                sx={{ fontSize: '16px', color: theme.palette.warning['300'] }}
                id="demo-multiple-name-label"
              >
                {t('COMMON.REASON_FOR_DROPOUT')}
              </InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                value={personName}
                onChange={handleChange}
                input={<OutlinedInput label="Reason for Dropout" />}
              >
                <MenuItem
                  value="Unable to cope with studies"
                  sx={{
                    fontSize: '16px',
                    color: theme.palette.warning['300'],
                  }}
                >
                  Unable to cope with studies {/* come from API   */}
                </MenuItem>
                <MenuItem
                  value="Family responsibilities"
                  sx={{
                    fontSize: '16px',
                    color: theme.palette.warning['300'],
                  }}
                >
                  Family responsibilities {/* come from API   */}
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box mt={1.5}>
            <Divider />
          </Box>
          <Box p={'18px'}>
            <Button
              className="w-100"
              sx={{ boxShadow: 'none' }}
              variant="contained"
              onClick={() => onClose(true)}
            >
              {t('COMMON.ADD_NEW')}
            </Button>
          </Box>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default DropOutModal;
