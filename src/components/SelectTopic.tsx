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

  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [subtopics, setSubtopics] = useState<string[]>([]);
  const [selectedSubValues, setSelectedSubValues] = useState<string[]>([]);

  useEffect(() => {
    const selectedTopicIds = Array.isArray(selectedTopics)
      ? selectedTopics
          .map((topic: any) => {
            return topic?.id || null;
          })
          .filter((id) => id !== null)
      : [];

    setSelectedTopicIds(selectedTopicIds);
    setSelectedSubValues(
      Array.isArray(selectedSubTopics) ? selectedSubTopics : []
    );

    const aggregatedSubtopics = (
      Array.isArray(selectedTopics) ? selectedTopics : []
    ).flatMap((topicId) => {
      const topicData = subTopicsList.find((t: any) => t.id === topicId);
      return topicData ? topicData.subtopics : [];
    });
    setSubtopics(aggregatedSubtopics);
  }, []);

  const handleTopicChange = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    const selectedTopicIds =
      typeof value === 'string' ? value.split(',') : value;
    setSelectedTopicIds(selectedTopicIds);

    const selectedTopicNames = selectedTopicIds
      .map((id) => {
        const topic = topics.find((t: any) => t.id === id);
        return topic ? { name: topic?.name || '', id: id } : null;
      })
      .filter((topic) => topic !== null);

    const aggregatedSubtopics = selectedTopicIds.flatMap((topicId) => {
      const topicData = subTopicsList.find((t: any) => t.id === topicId);
      return topicData ? topicData.subtopics : [];
    });

    setSubtopics(aggregatedSubtopics);
    setSelectedSubValues([]);
    onTopicSelected(selectedTopicNames);
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
            value={selectedTopicIds}
            onChange={handleTopicChange}
            renderValue={(selected) =>
              selected
                .map((id) => {
                  const topic = topics.find((t: any) => t.id === id);
                  return topic?.name || '';
                })
                .join(', ')
            }
            style={{ borderRadius: '4px' }}
            className="topic-select"
          >
            {topics?.map((topic: any) => (
              <MenuItem key={topic.id} value={topic.id}>
                <Checkbox
                  checked={selectedTopicIds.includes(topic.id)}
                  sx={{
                    '&.Mui-checked': {
                      color: theme?.palette?.warning['300'],
                    },
                  }}
                />
                <ListItemText primary={topic.name} />
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
                  checked={selectedSubValues.includes(subTopic)}
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
