import { bulkCreateCohortMembers } from '@/services/CohortServices';
import reassignLearnerStore from '@/store/reassignLearnerStore';
import useStore from '@/store/store';
import { Status } from '@/utils/app.constant';
import { Box, Checkbox, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import * as React from 'react';
import { useEffect, useState } from 'react';
import SearchBar from './Searchbar';
import SimpleModal from './SimpleModal';
import { showToastMessage } from './Toastify';
import { toPascalCase } from '@/utils/Helper';
import NoDataFound from './common/NoDataFound';

interface ReassignModalProps {
  cohortNames?: any;
  message: string;
  handleAction?: () => void;
  buttonNames?: ButtonNames;
  handleCloseReassignModal: () => void;
  modalOpen: boolean;
  reloadState: boolean;
  setReloadState: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ButtonNames {
  primary: string;
  secondary?: string;
}

interface Cohort {
  id: any;
  cohortId: string;
  name: string;
}

const ReassignModal: React.FC<ReassignModalProps> = ({
  cohortNames,
  modalOpen,
  message,
  handleAction,
  buttonNames,
  handleCloseReassignModal,
  reloadState,
  setReloadState,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const store = useStore();
  const reStore = reassignLearnerStore();
  const cohorts: Cohort[] = store.cohorts.map(
    (cohort: { cohortId: any; name: string }) => ({
      name: cohort.name,
      id: cohort.cohortId,
    })
  );

  const [searchInput, setSearchInput] = useState('');
  const [checkedCenters, setCheckedCenters] = useState<string[]>([]);

  React.useEffect(() => {
    if (reloadState) {
      setReloadState(false);
    }
  }, [reloadState, setReloadState]);

  useEffect(() => {
    if (cohortNames) {
      const activeCenters = cohortNames
        .filter((cohort: { status: string }) => cohort.status === Status.ACTIVE)
        .map((cohort: { name: any }) => cohort.name);
      setCheckedCenters(activeCenters);
    }
  }, [cohortNames]);

  const handleToggle = (name: string) => {
    setCheckedCenters((prev) => {
      const updatedCheckedCenters = prev.includes(name)
        ? prev.filter((center) => center !== name)
        : [...prev, name];

      return updatedCheckedCenters;
    });
  };

  const filteredCenters = React.useMemo(() => {
    return cohorts
      .map(({ cohortId, name }) => ({ id: cohortId, name }))
      .filter(({ name }) =>
        name.toLowerCase().includes(searchInput.toLowerCase())
      )
      .sort((a, b) =>
        checkedCenters.includes(a.name) === checkedCenters.includes(b.name)
          ? 0
          : checkedCenters.includes(a.name)
            ? -1
            : 1
      );
  }, [cohorts, searchInput, checkedCenters]);

  const handleReassign = async () => {
    const selectedData = cohorts
      .filter((center) => checkedCenters.includes(center.name))
      .map((center) => center.id);
    const unSelectedData = cohorts
      .filter((center) => !checkedCenters.includes(center.name))
      .map((center) => center.id);

    const payload = {
      userId: [reStore.reassignFacilitatorUserId],
      cohortId: selectedData,
      removeCohortId: unSelectedData,
    };

    try {
      await bulkCreateCohortMembers(payload);
      showToastMessage(
        t('MANAGE_USERS.CENTERS_REQUESTED_SUCCESSFULLY'),
        'success'
      );
      setReloadState(true);
    } catch (error) {
      showToastMessage(t('MANAGE_USERS.CENTERS_REQUEST_FAILED'), 'error');
    } finally {
      handleCloseReassignModal();
    }
  };

  return (
    <>
      {modalOpen && (
        <SimpleModal
          open={modalOpen}
          onClose={handleCloseReassignModal}
          showFooter={true}
          modalTitle={message}
          primaryText={filteredCenters?.length > 0 ? buttonNames?.primary : ''}
          primaryActionHandler={handleReassign}
          secondaryText={filteredCenters?.length > 0 ? '' : t('COMMON.CANCEL')}
          secondaryActionHandler={handleCloseReassignModal}
        >
          <SearchBar
            onSearch={setSearchInput}
            value={searchInput}
            placeholder={t('CENTERS.SEARCH_CENTERS')}
            fullWidth={true}
          ></SearchBar>
          <Box sx={{ p: 3, maxHeight: '180px', overflowY: 'auto' }}>
            {filteredCenters.map((center, index) => (
              <Box key={center.id}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <span style={{ color: 'black' }}>
                    {toPascalCase(center?.name)}
                  </span>
                  <Checkbox
                    checked={checkedCenters.includes(center.name)}
                    onChange={() => handleToggle(center.name)}
                    sx={{
                      color: theme.palette.text.primary,
                      '&.Mui-checked': {
                        color: 'black',
                      },
                      verticalAlign: 'middle',
                      marginTop: '-10px',
                    }}
                  />
                </Box>
                {index < filteredCenters?.length - 1 && (
                  <Divider sx={{ mb: 2 }} />
                )}
              </Box>
            ))}

            {filteredCenters.length === 0 && (
              <NoDataFound title={t('COMMON.NO_CENTER_FOUND')} />
            )}
          </Box>
        </SimpleModal>
      )}
    </>
  );
};

export default ReassignModal;
