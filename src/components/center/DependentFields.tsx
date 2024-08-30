import React, { useEffect, useState } from 'react';
import {
  formatOptions,
  getAssociatesByCode,
  filterByCategory,
  getOptionsByCode,
  mapFrameworksToOptionsWithFieldId,
  getAssociatesByIdentifier,
} from '@/utils/Helper';
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  Checkbox,
  ListItemText,
} from '@mui/material';

interface DependentFieldsProps {
  customFormData: any;
  onFieldsChange: (fields: any) => void;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const DependentFields: React.FC<DependentFieldsProps> = ({
  customFormData,
  onFieldsChange,
  setShowForm
}) => {
  const [MGSData, setMGSData] = useState<any[]>();
  const [boardOptions, setBoardOptions] = useState<any[]>([]);
  const [mediumOptions, setMediumOptions] = useState<any[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<string>('');
  const [selectedBoardId, setSelectedBoardId] = useState<string>('');
  const [selectedMedium, setSelectedMedium] = useState<string>('');
  const [gradeOptions, setGradeOptions] = useState<any[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [subjectData, setSubjectData] = useState<any[]>([]);
  const [subjectOptions, setSubjectOptions] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string[]>([]);

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
        subject: {
          fieldId: fieldIds.subject,
          subjectName: selectedSubject,
        },
      };
      // console.log(`arrangedData`, arrangedData)
      if (
        selectedBoard &&
        selectedMedium &&
        selectedGrade &&
        selectedSubject.length > 0 &&
        arrangedData
      ) {
        localStorage.setItem('BMGSData', JSON.stringify(arrangedData));
      }
    }
  }, [selectedBoard, selectedMedium, selectedGrade, selectedSubject]);

  useEffect(() => {
    setSelectedSubject([]);
  }, [selectedBoard, selectedMedium, selectedGrade]);

  useEffect(() => {
    const handleBMGS = async () => {
      try {
        const url =
          'https://diksha.gov.in/api/channel/v1/read/0126684405014528002';
        const boardData = await fetch(url).then((res) => res.json());
        const frameworks = boardData?.result?.channel?.frameworks;
        const options = mapFrameworksToOptionsWithFieldId(frameworks);

        if (options) {
          setBoardOptions(options);
        }
      } catch (error) {
        console.error('Error fetching board data:', error);
      }
    };

    handleBMGS();
  }, [res]);

  useEffect(() => {
    const fetchMediumOptions = async (boardId: string) => {
      try {
        const url = `https://diksha.gov.in/api/framework/v1/read/${boardId}?categories=gradeLevel,medium,class,subject`;
        const mediumRes = await fetch(url).then((res) => res.json());
        const mediumData = mediumRes?.result?.framework?.categories;
        if (mediumData) {
          const extractedSubjectOptions = getOptionsByCode(
            mediumData,
            'gradeLevel'
          );
          setSubjectData(extractedSubjectOptions);

          const filteredMediumData = getOptionsByCode(mediumData, 'medium');
          setMGSData(filteredMediumData);
          const extractedMediumOptions = formatOptions(filteredMediumData);
          setMediumOptions(extractedMediumOptions || []);
        }
      } catch (error) {
        console.error('Error fetching medium options:', error);
      }
    };

    if (selectedBoardId) {
      fetchMediumOptions(selectedBoardId);
    }
  }, [selectedBoardId]);

  const handleBoardChange = (event: SelectChangeEvent<string>) => {
    const board = event.target.value;
    let selectedOption = boardOptions.find((option) => option.value === board);
    console.log('selectedValue', selectedOption.label);
    setSelectedBoard(selectedOption.label);
    setSelectedBoardId(board);
    setMediumOptions([]);
    setGradeOptions([]);
    setSubjectOptions([]);
    setShowForm(false);
  };

  const handleMediumChange = (event: SelectChangeEvent<string>) => {
    const selectedCode = event.target.value;
    let selectedOption = mediumOptions.find(
      (option) => option.value === selectedCode
    );

    console.log(`selectedMedium`, selectedOption.label);
    setSelectedMedium(selectedOption.label);
    setSelectedGrade('');
    setSubjectOptions([]);
    setShowForm(false);
    if (selectedCode) {
      const getGradeSubjectData = getAssociatesByCode(MGSData, selectedCode);
      const extractedGradeOptions = filterByCategory(
        getGradeSubjectData,
        'gradeLevel'
      );
      setGradeOptions(extractedGradeOptions);
    }
  };

  const handleGradeChange = (event: SelectChangeEvent<string>) => {
    const grade = event.target.value;
    setShowForm(false);
    let selectedOption: any = gradeOptions.find(
      (option) => option.value === grade
    );

    if (selectedOption) {
      setSelectedGrade(selectedOption?.label);
      console.log(`selectedGrade`, selectedOption.label);
    }
    const filteredData = subjectData?.filter(
      (item) => item?.identifier === grade
    );
    if (filteredData) {
      const associateData = getAssociatesByIdentifier(filteredData, grade);
      const extractedSubjectOptions = filterByCategory(
        associateData,
        'subject'
      );
      setSubjectOptions(extractedSubjectOptions);
    }
  };

  const handleSubjectChange = (event: SelectChangeEvent<string[]>) => {
    const subjects = event.target.value as string[];
    setSelectedSubject(subjects);
    console.log('Subjects', subjects);

    onFieldsChange({
      board: selectedBoard,
      medium: selectedMedium,
      grade: selectedGrade,
      subject: subjects,
    });
  };

  return (
    <div>
      {/* Board dropdown */}
      {boardOptions && (
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="board-select-label">Board</InputLabel>
          <Select
            labelId="board-select-label"
            onChange={handleBoardChange}
            defaultValue=""
            label="Board"
          >
            {boardOptions.map((option: any) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Medium dropdown */}
        <FormControl fullWidth variant="outlined" margin="normal"  disabled={!selectedBoard}>
          <InputLabel id="medium-select-label">Medium</InputLabel>
          <Select
            labelId="medium-select-label"
            onChange={handleMediumChange}
            defaultValue=""
            label="Medium"
          >
            {mediumOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

      {/* Grade dropdown */}  
        <FormControl fullWidth variant="outlined" margin="normal"  disabled={!selectedMedium}>
          <InputLabel id="grade-select-label">Grade</InputLabel>
          <Select
            labelId="grade-select-label"
            onChange={handleGradeChange}
            defaultValue=""
            label="Grade"
          >
            {gradeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

      {/* Subject dropdown (multi-select with checkboxes) */}
        <FormControl fullWidth variant="outlined" margin="normal"  disabled={!selectedGrade}>
          <InputLabel id="subject-select-label">Subject</InputLabel>
          <Select
            labelId="subject-select-label"
            multiple
            value={selectedSubject}
            onChange={handleSubjectChange}
            renderValue={(selected) =>
              (selected as string[])
                .map(
                  (value) =>
                    subjectOptions.find((option) => option.value === value)
                      ?.label
                )
                .join(', ')
            }
            label="Subject"
          >
            {subjectOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox
                  checked={selectedSubject.indexOf(option.value) > -1}
                />
                <ListItemText primary={option.label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
    </div>
  );
};

export default DependentFields;
