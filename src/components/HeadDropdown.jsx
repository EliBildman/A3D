import { ENTITY_TYPES } from '../tools/types';
import { Collapse, List } from '@mui/material';
import Spawner from './Spawner';
import { wordToColor } from '../tools/color';

const HeadDropDown = (props) => {
    const { head, blockInfo, createEntity, expanded } = props;

    const [color, textColor] = wordToColor(head.name);

    const actions = head.actions.map((action, ind) => {
        action.type = ENTITY_TYPES.ACTION;
        action.color = color;
        action.textColor = textColor;
        action.head = head.name;
        return (
            <Spawner
                className='Spawner'
                key={ind}
                entityInfo={action}
                blockInfo={blockInfo}
                createEntity={createEntity}
            />
        );
    });

    const events = head.events.map((event, ind) => {
        event.type = ENTITY_TYPES.EVENT;
        event.color = color;
        event.textColor = textColor;
        event.head = head.name;
        return (
            <Spawner
                className='Spawner'
                key={ind}
                entityInfo={event}
                blockInfo={blockInfo}
                createEntity={createEntity}
            />
        );
    });

    return (
        <Collapse in={expanded}>
            <List
                sx={{ borderBottom: '2px solid black' }}
                className='ActionsList'
            >
                {events}
                {actions}
            </List>
        </Collapse>
    );
};

export default HeadDropDown;
