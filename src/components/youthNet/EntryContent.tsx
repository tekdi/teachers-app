import React from 'react';
import { Box, Divider, Typography } from '@mui/material';
import { UserList } from '@/components/youthNet/UserCard';
import UploadedFile from '@/components/youthNet/UploadedFile';

type EntryContentProps = {
  date: string;
  users: { name: string; age: string; village: string; image: string }[];
  theme: string;
  files: string[]; // Array of filenames for uploaded files
  youthListUsers: {
    name: string;
    age: string;
    village: string;
    image: string;
  }[];
};

const EntryContent: React.FC<EntryContentProps> = ({
  date,
  users,
  theme,
  files,
  youthListUsers,
}) => {
  return (
    <Box>
      <Typography
        sx={{ fontSize: '12px', fontWeight: '300', fontStyle: 'italic' }}
      >
        {date}
      </Typography>
      <UserList users={users} />
      <Divider />
      <Typography
        sx={{
          marginTop: '30px',
          fontSize: '16px',
          fontWeight: '500',
          color: 'black',
        }}
      >
        Theme: {theme}
      </Typography>
      <Typography
        sx={{ marginTop: '12px', fontSize: '14px', fontWeight: '500' }}
      >
        Uploaded files(s)
      </Typography>
      {files.map((file, index) => (
        <UploadedFile key={index} title={file} />
      ))}
      <Typography
        sx={{ marginTop: '20px', fontSize: '14px', fontWeight: '500' }}
      >
        Youth List
      </Typography>
      <UserList users={youthListUsers} />
    </Box>
  );
};

export default EntryContent;
