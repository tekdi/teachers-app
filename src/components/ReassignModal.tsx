import { bulkCreateCohortMembers } from '@/services/CohortServices';
import reassignLearnerStore from '@/store/reassignLearnerStore';
import useStore from '@/store/store';
import { QueryKeys, Status } from '@/utils/app.constant';
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
import { useQueryClient } from '@tanstack/react-query';

interface ReassignModalProps {
  cohortNames?: any;
  message: string;
  handleAction?: () => void;
  buttonNames?: ButtonNames;
  handleCloseReassignModal: () => void;
  modalOpen: boolean;
  reloadState: boolean;
  setReloadState: React.Dispatch<React.SetStateAction<boolean>>;
  selectedUser: any;
}

interface ButtonNames {
  primary: string;
  secondary?: string;
}

interface Cohort {
  id: any;
  cohortId: string;
  name: string;
  status: any;
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
  selectedUser,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const store = useStore();
  const reStore = reassignLearnerStore();
  const queryClient = useQueryClient();

  const cohorts: Cohort[] = store.cohorts.map(
    (cohort: { cohortId: any; name: string; status: any }) => ({
      name: cohort.name,
      id: cohort.cohortId,
      status: cohort?.status,
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
      .map(({ cohortId, name, status }) => ({ id: cohortId, name, status }))
      .filter(
        ({ name, status }) =>
          name.toLowerCase().includes(searchInput.toLowerCase()) &&
          status === Status.ACTIVE
      ).sort((a, b) => a.name.localeCompare(b.name));
      // .sort((a, b) =>
      //   checkedCenters.includes(a.name) === checkedCenters.includes(b.name)
      //     ? 0
      //     : checkedCenters.includes(a.name)
      //       ? -1
      //       : 1
      // );
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
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GET_ACTIVE_FACILITATOR],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.MY_COHORTS, selectedUser.userId],
      });

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
          <Box sx={{ p: 3, maxHeight: '50vh', overflowY: 'auto' }}>
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
