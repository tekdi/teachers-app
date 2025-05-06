import { Role } from '@/utils/app.constant';
import { capitalizeFirstLetterOfEachWordInArray } from '@/utils/Helper';
import { Box, Grid, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import MultipleSelectCheckmarks from './FormControl';
import { useRouter } from 'next/router';

interface State {
  value: string;
  label: string;
}

interface Country {
  value: string;
  label: string;
}
interface District {
  value: string;
  label: string;
}

interface Block {
  value: string;
  label: string;
}
interface Centers {
  value: string;
  label: string;
}
interface DropdownBoxProps {
  country: Country[];
  states: State[];
  districts: District[];
  blocks: Block[];
  allCenters?: Centers[];
  selectedState: string[];
  selectedDistrict: string[];
  selectedBlock: string[];
  selectedCenter?: any;
  inModal?: boolean;
  handleCountryChangeWrapper: (
    selectedNames: string[],
    selectedCodes: string[]
  ) => Promise<void>;
  handleStateChangeWrapper: (
    selected: string[],
    selectedCodes: string[]
  ) => Promise<void>;
  handleBlockChangeWrapper: (
    selected: string[],
    selectedCodes: string[]
  ) => void;
  handleCenterChangeWrapper?: (
    selected: string[],
    selectedCodes: string[]
  ) => void;

  isMobile: boolean;
  isMediumScreen: boolean;
  isCenterSelection?: boolean;
  stateDefaultValue?: string;
  userType?: string;
  reAssignModal?: boolean;
  blockDefaultValue?: string;
  districtDefaultValue?: string;
  isUserAdd?: boolean;
  iscenterCreate?: boolean;
}

const AreaSelection: React.FC<DropdownBoxProps> = ({
  country,
  states,
  districts,
  blocks,
  allCenters,
  selectedState,
  selectedDistrict,
  selectedBlock,
  selectedCenter = [],
  handleCountryChangeWrapper,
  handleStateChangeWrapper,
  handleBlockChangeWrapper,
  isMobile,
  isMediumScreen,
  isCenterSelection = true,
  inModal = false,
  handleCenterChangeWrapper = () => {},
  stateDefaultValue,
  blockDefaultValue,
  districtDefaultValue,
  isUserAdd,
  iscenterCreate = false,
  userType,
  reAssignModal = false,
}) => {
  const router = useRouter();

  const { center } = router.query;

  const { t } = useTranslation();
  const theme = useTheme<any>();
  const [singleState, setSingleState] = useState<boolean>(true);
  const [stateValue, setStateValue] = useState<string>('');
  const [stateCode, setStateCode] = useState<string>('');
  const isSmallScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down('sm')
  );
  // isSmallScreen=isMobile?true: false;
  const centerNames = allCenters?.map((center) => center.label) || [];

  const blockDisable = districtDefaultValue ? false : true;
  const shouldRenderSelectCheckmarks = !(
    reAssignModal && userType === Role.TEAM_LEADER
  );
  return (
    <Box
      sx={{
        display: 'flex',
        borderRadius: '8px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          '@media (max-width: 900px)': {
            flexDirection: 'column',
          },
        }}
      >
        {userType && !reAssignModal && inModal === false && (
          <Box>
            <Typography marginTop="20px" variant="h1">
              {userType === Role.CONTENT_CREATOR ? t('SIDEBAR.SCTA') : userType}
            </Typography>
          </Box>
        )}

        {
          <Box
            sx={{
              width: inModal ? '100%' : '62%',
              '@media (max-width: 900px)': {
                width: '100%',
              },
            }}
          >
            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                sm={inModal ? 12 : 6}
                md={inModal ? 12 : 4}
                lg={inModal ? 12 : isCenterSelection ? 3 : 4}
              >
                <MultipleSelectCheckmarks
                  names={country?.map(
                    (country) =>
                      country.label?.toLowerCase().charAt(0).toUpperCase() +
                      country.label?.toLowerCase().slice(1)
                  )}
                  codes={country?.map((country) => country.value)}
                  tagName={t('COMMON.COUNTRY')}
                  selectedCategories={selectedState}
                  onCategoryChange={handleCountryChangeWrapper}
                  // disabled={stateDefaultValue !== t("COMMON.ALL_STATES")}
                  overall={!inModal}
                  // defaultValue={stateDefaultValue}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={inModal ? 12 : 6}
                md={inModal ? 12 : 4}
                lg={inModal ? 12 : isCenterSelection ? 3 : 4}
              >
                <MultipleSelectCheckmarks
                  names={states?.map((states) => states.label)}
                  codes={states?.map((states) => states.value)}
                  tagName={t('COMMON.COUNTY')}
                  selectedCategories={selectedDistrict}
                  onCategoryChange={handleStateChangeWrapper}
                  // disabled={
                  //   districts?.length <= 0 ||
                  //   (selectedState.length === 0 &&
                  //     stateDefaultValue === t("COMMON.ALL_STATES"))
                  // }
                  overall={!inModal}
                  defaultValue={
                    reAssignModal
                      ? districtDefaultValue
                      : selectedState.length > 0 && districts?.length === 0
                        ? t('COMMON.COUNTY')
                        : t('COMMON.ALL_COUNTY')
                  }
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={inModal ? 12 : 6}
                md={inModal ? 12 : 4}
                lg={inModal ? 12 : isCenterSelection ? 3 : 4}
              >
                {shouldRenderSelectCheckmarks && (
                  <MultipleSelectCheckmarks
                    names={capitalizeFirstLetterOfEachWordInArray(
                      blocks?.length > 0
                        ? blocks.map((block) => block.label)
                        : []
                    )}
                    codes={
                      blocks?.length > 0
                        ? blocks?.map((block) => block.value)
                        : []
                    }
                    tagName={t('COMMON.SUB_COUNTY')}
                    selectedCategories={capitalizeFirstLetterOfEachWordInArray(
                      selectedBlock
                    )}
                    onCategoryChange={handleBlockChangeWrapper}
                    overall={!inModal}
                    defaultValue={
                      selectedDistrict?.length > 0 && blocks?.length === 0
                        ? t('COMMON.SUB_COUNTY')
                        : t('COMMON.ALL_SUB_COUNTY')
                    }
                  />
                )}
              </Grid>

              {/* {isCenterSelection && !iscenterCreate && (
                <Grid
                  item
                  xs={12}
                  sm={inModal ? 12 : 6}
                  md={inModal ? 12 : 4}
                  lg={inModal ? 12 : isCenterSelection ? 3 : 4}
                >
                  <MultipleSelectCheckmarks
                    names={capitalizeFirstLetterOfEachWordInArray(centerNames)}
                    codes={allCenters?.map((center) => center.value) || []}
                    tagName={t("CENTERS.CENTERS")}
                    selectedCategories={selectedCenter}
                    onCategoryChange={handleCenterChangeWrapper}
                  />
                </Grid>
              )} */}
            </Grid>

            {/* {isCenterSelection && !iscenterCreate && (
              <Grid
                item
                xs={12}
                sm={inModal ? 12 : 6}
                md={inModal ? 12 : 4}
                lg={inModal ? 12 : isCenterSelection ? 3 : 4}
              >
                <MultipleSelectCheckmarks
                  names={capitalizeFirstLetterOfEachWordInArray(centerNames)}
                  codes={allCenters?.map((center) => center.value) || []}
                  tagName={t("CENTERS.CENTERS")}
                  selectedCategories={selectedCenter}
                  onCategoryChange={handleCenterChangeWrapper}
                  // disabled={
                  //  (center&& !inModal)?false:
                  //   selectedBlock.length === 0 ||
                  //   selectedBlock[0] === t("COMMON.ALL_BLOCKS") ||
                  //   (selectedBlock?.length > 0 && allCenters?.length === 0)
                />
              </Grid>
            )} */}
          </Box>
        }
      </Box>
    </Box>
  );
};

export default AreaSelection;
