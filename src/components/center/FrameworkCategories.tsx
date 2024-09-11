import React, { useEffect, useState } from 'react';

import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  Box,
} from '@mui/material';
import {
  findCommonAssociations,
  getAssociationsByCode,
  getOptionsByCategory,
} from '@/utils/Helper';
import { frameworkId } from '../../../app.config';

interface FrameworkCategoriesProps {
  customFormData: any;
  onFieldsChange: (fields: any) => void;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const FrameworkCategories: React.FC<FrameworkCategoriesProps> = ({
  customFormData,
  onFieldsChange,
  setShowForm,
}) => {
  const [framework, setFramework] = useState<any[]>([]);
  const [stateOption, setStateOption] = useState<any[]>([]);
  const [stateAssociations, setStateAssociations] = useState<any[]>([]);
  const [boardOptions, setBoardOptions] = useState<any[]>([]);
  const [boardAssociations, setBoardAssociations] = useState<any[]>([]);
  const [mediumOptions, setMediumOptions] = useState<any[]>([]);
  const [mediumAssociations, setMediumAssociations] = useState<any[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<string>('');
  const [selectedMedium, setSelectedMedium] = useState<string>('');
  const [gradeOptions, setGradeOptions] = useState<any[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>('');

  const userStateName = localStorage.getItem('stateName');
  const [selectedState, setSelectedState] = useState<string>('');

  const res = customFormData;
  function extractFieldIds(data: any) {
    const fieldsOfInterest = ['board', 'medium', 'grade', 'subject'];
    const fieldIds: { [key: string]: string } = {};

    data.fields.forEach((field: { name: string; fieldId: string }) => {
      if (fieldsOfInterest.includes(field.name)) {
        fieldIds[field.name] = field.fieldId;
      }
    });

    return fieldIds;
  }
  const fieldIds = extractFieldIds(res);
  console.log(`fieldIds`, fieldIds);

  useEffect(() => {
    if (fieldIds) {
      const arrangedData = {
        board: {
          fieldId: fieldIds.board,
          boardName: selectedBoard,
        },
        medium: {
          fieldId: fieldIds.medium,
          mediumName: selectedMedium,
        },
        grade: {
          fieldId: fieldIds.grade,
          gradeName: selectedGrade,
        },
      };
      // console.log(`arrangedData`, arrangedData)
      if (selectedBoard && selectedMedium && selectedGrade && arrangedData) {
        localStorage.setItem('BMGSData', JSON.stringify(arrangedData));
      }
    }
  }, [selectedBoard, selectedMedium, selectedGrade]);

  useEffect(() => {
    const handleBMGS = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_FRAMEWORK_API_URL}/read/${frameworkId}`;
        const boardData = await fetch(url).then((res) => res.json());
        const frameworks = boardData?.result?.framework;
        setFramework(frameworks);
        const getStates = getOptionsByCategory(frameworks, 'state');

        const matchingState = getStates.find(
          (state: any) => state.name === userStateName
        );
        if (matchingState) {
          setStateOption([matchingState]);
          setSelectedState(matchingState.code);
          setStateAssociations(matchingState.associations);
          console.log('matchingStateAssociations', matchingState.associations);
        }
        const getBoards = getOptionsByCategory(frameworks, 'board');
        // console.log('getBoards', getBoards);

        //filter common board by mapping boards with stateAssociation
        if (getBoards && matchingState) {
          const commonBoards = getBoards
            .filter((item1: { code: any }) =>
              matchingState.associations.some(
                (item2: { code: any; category: string }) =>
                  item2.code === item1.code && item2.category === 'board'
              )
            )
            .map((item1: { name: any; code: any; associations: any }) => ({
              name: item1.name,
              code: item1.code,
              associations: item1.associations,
            }));
          setBoardOptions(commonBoards);
        }
      } catch (error) {
        console.error('Error fetching board data:', error);
      }
    };
    handleBMGS();
  }, []);

  const handleBoardChange = (event: SelectChangeEvent<string>) => {
    const board = event.target.value;
    setSelectedBoard(board);
    // console.log('board', board);
    setSelectedMedium('');
    setMediumOptions([]);
    setGradeOptions([]);
    setSelectedGrade('');
    setShowForm(false);

    if (board) {
      const getMedium = getOptionsByCategory(framework, 'medium');
      const boardAssociations = getAssociationsByCode(boardOptions, board);
      setBoardAssociations(boardAssociations);

      const commonMediumInState = getMedium
        .filter((item1: { code: string }) =>
          stateAssociations.some(
            (item2: { code: string; category: string }) =>
              item2.code === item1.code && item2.category === 'medium'
          )
        )
        .map((item1: { name: string; code: string; associations: any[] }) => ({
          name: item1.name,
          code: item1.code,
          associations: item1.associations,
        }));

      const commonMediumInBoard = getMedium
        .filter((item1: { code: any }) =>
          boardAssociations.some(
            (item2: { code: any; category: string }) =>
              item2.code === item1.code && item2.category === 'medium'
          )
        )
        .map((item1: { name: any; code: any; associations: any }) => ({
          name: item1.name,
          code: item1.code,
          associations: item1.associations,
        }));
      // console.log(`commonMediumInState`, commonMediumInState);
      // console.log(`commonMediumInBoard`, commonMediumInBoard);

      const commonMediumData = findCommonAssociations(
        commonMediumInState,
        commonMediumInBoard
      );
      setMediumOptions(commonMediumData);
    }
  };

  const handleMediumChange = (event: SelectChangeEvent<string>) => {
    const medium = event.target.value;
    setSelectedMedium(medium);
    setSelectedGrade('');
    setGradeOptions([]);
    setShowForm(false);
    console.log('medium', medium);
    if (medium) {
      const getGrades = getOptionsByCategory(framework, 'gradeLevel');
      const mediumAssociations = getAssociationsByCode(mediumOptions, medium);
      console.log('boardAssociations', stateAssociations);
      setMediumAssociations(mediumAssociations);

      const commonGradeInState = getGrades
        .filter((item1: { code: string }) =>
          stateAssociations.some(
            (item2: { code: string; category: string }) =>
              item2.code === item1.code && item2.category === 'gradeLevel'
          )
        )
        .map((item1: { name: string; code: string; associations: any[] }) => ({
          name: item1.name,
          code: item1.code,
          associations: item1.associations,
        }));

      const commonGradeInBoard = getGrades
        .filter((item1: { code: any }) =>
          boardAssociations.some(
            (item2: { code: any; category: string }) =>
              item2.code === item1.code && item2.category === 'gradeLevel'
          )
        )
        .map((item1: { name: any; code: any; associations: any }) => ({
          name: item1.name,
          code: item1.code,
          associations: item1.associations,
        }));

      const commonGradeInMedium = getGrades
        .filter((item1: { code: any }) =>
          mediumAssociations.some(
            (item2: { code: any; category: string }) =>
              item2.code === item1.code && item2.category === 'gradeLevel'
          )
        )
        .map((item1: { name: any; code: any; associations: any }) => ({
          name: item1.name,
          code: item1.code,
          associations: item1.associations,
        }));
      console.log(`commonGradeInState`, commonGradeInState);
      console.log(`commonGradeInMedium`, commonGradeInMedium);

      const commonGradeInStateBoard = findCommonAssociations(
        commonGradeInState,
        commonGradeInBoard
      );
      const overAllCommonGrade = findCommonAssociations(
        commonGradeInStateBoard,
        commonGradeInMedium
      );
      setGradeOptions(overAllCommonGrade);
    }
  };

  const handleGradeChange = (event: SelectChangeEvent<string>) => {
    const grade = event.target.value;
    setSelectedGrade(grade);
    console.log('grade', grade);

    if (selectedBoard && selectedMedium && grade) {
      setShowForm(true);
    }
    onFieldsChange({
      board: selectedBoard,
      medium: selectedMedium,
      grade: grade,
    });
  };

  return (
    <Box mt={2}>
      {/* State dropdown */}
      {stateOption && (
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="state-select-label">State</InputLabel>
          <Select
            labelId="state-select-label"
            defaultValue=""
            label="State"
            value={selectedState}
            disabled
          >
            {stateOption?.map((option: any) => (
              <MenuItem key={option.code} value={option.code}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Board dropdown */}
      {boardOptions && (
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="board-select-label">Board</InputLabel>
          <Select
            labelId="board-select-label"
            onChange={handleBoardChange}
            value={selectedBoard}
            defaultValue=""
            label="Board"
          >
            {boardOptions?.map((option: any) => (
              <MenuItem key={option.code} value={option.code}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Medium dropdown */}
      <FormControl
        fullWidth
        variant="outlined"
        margin="normal"
        disabled={!selectedBoard}
      >
        <InputLabel id="medium-select-label">Medium</InputLabel>
        <Select
          labelId="medium-select-label"
          onChange={handleMediumChange}
          value={selectedMedium}
          defaultValue=""
          label="Medium"
        >
          {mediumOptions?.map((option) => (
            <MenuItem key={option.code} value={option.code}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Grade dropdown */}
      <FormControl
        fullWidth
        variant="outlined"
        margin="normal"
        disabled={!selectedMedium}
      >
        <InputLabel id="grade-select-label">Grade</InputLabel>
        <Select
          labelId="grade-select-label"
          onChange={handleGradeChange}
          value={selectedGrade}
          defaultValue=""
          label="Grade"
        >
          {gradeOptions?.map((option) => (
            <MenuItem key={option.code} value={option.code}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default FrameworkCategories;
