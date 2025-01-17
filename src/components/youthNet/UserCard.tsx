import React from 'react';
import {
  Avatar,
  Box,
  Typography,
  List,
  ListItem,
  Divider,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTheme } from '@mui/material/styles';

type UserCardProps = {
  name: string;
  showAvtar?: boolean;
  age?: string | number;
  village?: string;
  image?: string;
  joinOn?: string;
  isNew?: boolean;
  showMore?: boolean;
  totalCount?: number;
  newRegistrations?: number;
};

type UserListProps = {
  users: UserCardProps[];
};

const UserCard: React.FC<UserCardProps> = ({
  name,
  age,
  village,
  image,
  joinOn,
  isNew,
  showMore,
  showAvtar,
  totalCount,
  newRegistrations,
}) => {
  // const displayAge = age && age !== '';
  const theme = useTheme<any>();

  return (
    <ListItem>
      {showAvtar && (
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
      )}
      <Box ml={2} display={totalCount ? 'flex' : 'block'}>
        <Typography
          sx={{
            fontSize: '16px',
            color: '#0D599E',
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: '5px 5px',
          }}
        >
          {name}
        </Typography>
        <Box display={'flex'}>
          {age && (
            <Typography variant="body2" color="textSecondary">
              {age} y/o • {village || joinOn}
            </Typography>
          )}
          <Box display={'flex'} ml={'3rem'}>
            {isNew && (
              <Typography
                variant="body2"
                color={theme.palette.success.main}
                ml={5}
                fontWeight={600}
              >
                NEW
              </Typography>
            )}
            {showMore && (
              <MoreVertIcon
                // onClick={(event) => {
                //   isMobile
                //     ? toggleDrawer('bottom', true, teacherUserId)(event)
                //     : handleMenuOpen(event, teacherUserId);
                // }}
                sx={{
                  fontSize: '24px',
                  color: theme.palette.warning['300'],
                  cursor: 'pointer',
                }}
              />
            )}

            {totalCount && (
              <Typography
                variant="body2"
                color="black"
                // ml={5}
                mt={'1rem'}
                fontWeight={600}
              >
                {totalCount}
                {newRegistrations && (
                  <span
                    style={{
                      color:
                        newRegistrations < 5
                          ? theme.palette.error.main
                          : theme.palette.success.main,
                    }}
                  >
                    (+{newRegistrations})
                  </span>
                )}
              </Typography>
            )}
          </Box>
        </Box>
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
            joinOn={user.joinOn}
            image={user.image}
            showAvtar={user.showAvtar}
            isNew={user.isNew}
            showMore={user.showMore}
            totalCount={user.totalCount}
            newRegistrations={user.newRegistrations}
          />
          {index < users.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  );
};
