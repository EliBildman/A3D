import React, { useState, useEffect, useRef } from 'react';
import { Divider, List } from '@mui/material';
import LogItem from './LogItem';
import { getSocket } from '../tools/api';

const LOG_EVENT_NAME = 'LOG';
const ANIMATION_TIME = 0.2;

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [open, setOpen] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const socket = getSocket();

    socket.on(LOG_EVENT_NAME, (message) => {
      setLogs((prevLogs) => [...prevLogs, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [getSocket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const logItems = [];

  if (open) {
    logs.forEach((log, ind) => {
      logItems.push(<LogItem key={ind} log={log} />);
      logItems.push(<Divider className="LogDiv" key={ind + 'divider'} />);
    });
    logItems.push(<div key="bottom" ref={bottomRef} />);
  }

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <List
      dense
      className="Logs"
      style={{
        flex: open ? 0.2 : 0.01,
        minWidth: open ? '300px' : '0px',
        padding: 0,
        overflowY: 'auto',
        whiteSpace: 'nowrap',
        overflowX: 'hidden',
        transition: `flex ${ANIMATION_TIME}s ease, min-width ${ANIMATION_TIME}s ease`,
      }}
      onClick={handleClick}
    >
      {logItems}
    </List>
  );
};

export default Logs;
