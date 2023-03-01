import { useRef } from 'react';
import { ENTITY_TYPES } from '../tools/types';
import Action from './Action';
import Event from './Event';
import * as deepcopy from 'deepcopy';
import ReactDOM from 'react-dom';

const Spawner = (props) => {
    const ref = useRef();

    const { createEntity, entityInfo, blockInfo } = props;
    let displayBlock;

    const handleMouseDown = (ev) => {
        const pos = ReactDOM.findDOMNode(ref.current).getBoundingClientRect();
        const entityCopy = deepcopy(entityInfo); // need to copy info

        createEntity(entityCopy, { x: pos.x, y: pos.y });
    };

    if (entityInfo.type === ENTITY_TYPES.ACTION) {
        displayBlock = (
            <Action
                {...entityInfo}
                {...blockInfo}
                bottomNotch={entityInfo.connections_allowed}
                disable
            />
        );
    } else if (entityInfo.type === ENTITY_TYPES.EVENT) {
        displayBlock = <Event {...entityInfo} {...blockInfo} disable />;
    }

    const style = {
        width: blockInfo.width,
        height: blockInfo.height,
    };

    return (
        <div
            className='Spawner'
            style={style}
            onMouseDown={handleMouseDown}
            ref={ref}
        >
            {displayBlock}
        </div>
    );
};

export default Spawner;
