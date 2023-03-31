import React from 'react';
import { ListItem, ListItemText } from '@mui/material';

const LogItem = (props) => {
  const { log } = props;

  return (
    <ListItem
      style={{
        padding: 0,
        paddingLeft: '5px',
        fontFamily: "'VT323', monospace",
        fontSize: '1.2rem',
      }}
    >
      {'- ' + log}
    </ListItem>
  );
};

export default LogItem;
