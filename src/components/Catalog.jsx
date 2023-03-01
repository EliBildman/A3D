import { List, ListItemText, ListItemButton } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import HeadDropDown from './HeadDropdown';
import { useEffect, useState } from 'react';

const Catalog = (props) => {
    const { spawnerInfo, createEntity, blockInfo } = props;

    const [expanded, setExpanded] = useState({});

    useEffect(() => {
        setExpanded(
            // holy MOLY he really TA'd cs 220
            spawnerInfo.reduce((acc, curr) => {
                acc[curr.name] = false;
                return acc;
            }, {})
        );
    }, [spawnerInfo]);

    const getHandleClick = (headName) => () => {
        const newExpanded = { ...expanded };
        newExpanded[headName] = !newExpanded[headName];
        setExpanded(newExpanded);
    };

    const heads = [];
    for (const head of spawnerInfo) {
        const isExpanded = expanded[head.name];
        heads.push(
            <ListItemButton
                sx={{
                    borderBottom: '2px solid black', //cringe
                }}
                key={head.name}
                // className='CatalogHeadName'
                onClick={getHandleClick(head.name)}
            >
                <ListItemText primary={head.name} />
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
        );

        heads.push(
            <HeadDropDown
                key={head.name + ' collapse'}
                head={head}
                createEntity={createEntity}
                blockInfo={blockInfo}
                expanded={isExpanded}
            />
        );
    }

    return (
        <div className='Catalog'>
            <List sx={{ p: 0 }} className='HeadList'>
                {heads}
            </List>
        </div>
    );
};

export default Catalog;
