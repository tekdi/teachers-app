import React from 'react';
import {
  Avatar,
  Box,
  Typography,
  List,
  ListItem,
  Divider,
} from '@mui/material';

type UserCardProps = {
  name: string;
  age: number;
  village: string;
  image?: string; // Optional prop for the image
};

type UserListProps = {
  users: UserCardProps[];
};

const UserCard: React.FC<UserCardProps> = ({ name, age, village, image }) => {
  return (
    <ListItem>
      <Avatar
        src={image}
        alt={name}
        sx={{
          width: 48,
          height: 48,
          backgroundColor: image ? 'transparent' : '#f5f5f5',
          fontSize: 18,
          fontWeight: '400',
          color: 'black',
          border: '2px solid #CDC5BD',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        {!image && name[0]}
      </Avatar>
      <Box ml={2}>
        <Typography
          sx={{
            fontSize: '16px',
            color: '#0D599E',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          {name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {age} y/o • {village}
        </Typography>
      </Box>
    </ListItem>
  );
};

export const UserList: React.FC<UserListProps> = ({ users }) => {
  return (
    <List>
      {users.map((user, index) => (
        <React.Fragment key={index}>
          <UserCard
            name={user.name}
            age={user.age}
            village={user.village}
            image={user.image}
          />
          {index < users.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  );
};
