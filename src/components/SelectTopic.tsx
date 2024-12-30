import {
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { TopicSubtopicProps } from '@/utils/Interfaces';

const SelectTopic: React.FC<TopicSubtopicProps> = ({
  topics,
  subTopicsList,
  onTopicSelected,
  onSubtopicSelected,
  selectedTopics,
  selectedSubTopics,
}) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();

  const [selectedTopic, setSelectedTopic] = useState<string[]>([]);
  const [subtopics, setSubtopics] = useState<string[]>([]);
  const [selectedSubValues, setSelectedSubValues] = useState<string[]>([]);

  useEffect(() => {
    setSelectedTopic(Array.isArray(selectedTopics) ? selectedTopics : []);
    setSelectedSubValues(
      Array.isArray(selectedSubTopics) ? selectedSubTopics : []
    );

    const aggregatedSubtopics = (
      Array.isArray(selectedTopics) ? selectedTopics : []
    ).flatMap((topic) => subTopicsList[topic] || []);
    setSubtopics(aggregatedSubtopics);
  }, []);

  const handleTopicChange = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    const topic = typeof value === 'string' ? value.split(',') : value;
    setSelectedTopic(topic);
    const aggregatedSubtopics = topic.flatMap((t) =>
      subTopicsList
        .filter((item: any) => item[t])
        .flatMap((item: any) => item[t] || [])
    );
    setSubtopics(aggregatedSubtopics);
    setSelectedSubValues([]);
    onTopicSelected(topic);
  };

  const handleSubtopicChange = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    const subtopics = typeof value === 'string' ? value.split(',') : value;
    setSelectedSubValues(subtopics);
    onSubtopicSelected(subtopics);
  };

  return (
    <Box sx={{ padding: '8px 16px' }}>
      <Box sx={{ mt: 2 }}>
        <FormControl fullWidth>
          <InputLabel
            style={{
              color: theme?.palette?.warning['A200'],
              background: theme?.palette?.warning['A400'],
              padding: '2px 8px',
            }}
            id="topic-select-label"
          >
            {t('CENTER_SESSION.TOPIC')}
          </InputLabel>
          <Select
            labelId="topic-select-label"
            id="topic-select"
            multiple
            value={selectedTopic}
            onChange={handleTopicChange}
            renderValue={(selected) => selected.join(', ')}
            style={{ borderRadius: '4px' }}
            className="topic-select"
          >
            {topics?.map((topic) => (
              <MenuItem key={topic} value={topic}>
                <Checkbox
                  checked={selectedTopic.indexOf(topic) > -1}
                  sx={{
                    '&.Mui-checked': {
                      color: theme?.palette?.warning['300'],
                    },
                  }}
                />
                <ListItemText primary={topic} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ my: 2 }}>
        <FormControl fullWidth>
          <InputLabel
            style={{
              color: theme?.palette?.warning['A200'],
              background: theme?.palette?.warning['A400'],
              padding: '2px 8px',
            }}
            id="subtopic-select-label"
          >
            {t('CENTER_SESSION.SUBTOPIC')}
          </InputLabel>
          <Select
            labelId="subtopic-select-label"
            id="subtopic-select"
            multiple
            value={selectedSubValues}
            onChange={handleSubtopicChange}
            renderValue={(selected) => selected.join(', ')}
            style={{ borderRadius: '4px' }}
          >
            {subtopics?.map((subTopic) => (
              <MenuItem key={subTopic} value={subTopic}>
                <Checkbox
                  checked={selectedSubValues.indexOf(subTopic) > -1}
                  sx={{
                    '&.Mui-checked': {
                      color: theme?.palette?.warning['300'],
                    },
                  }}
                />
                <ListItemText primary={subTopic} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default SelectTopic;
