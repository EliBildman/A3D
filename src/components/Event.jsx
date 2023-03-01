import '../App.css';
import { useRef, useState } from 'react';
import ParamsDialog from './ParamsDialog';
import { INPUT_TYPES } from '../tools/types';

const NOTCH_HEIGHT_RATIO = 0.05;
const NOTCH_WIDTH_RATIO = 0.2;

const Event = (props) => {
    const {
        id,
        height,
        width,
        head,
        name,
        top,
        left,
        onMouseDown,
        color,
        textColor,
        child,
        highlighted,
        outlineWidth,
        bottomAllowsConnections,
        input,
        output,
        disable,
        params,
        updateParams,
        held,
    } = props;

    const ref = useRef();
    const [propsOpen, setPropsOpen] = useState(false);

    const blockStyle = {
        top,
        left,
        backgroundColor: color,
        color: textColor,
        height: height * (1 - NOTCH_HEIGHT_RATIO) + 'px',
        width: width + 'px',
    };

    const topNotchStyle = {
        backgroundColor: color,
    };

    const bottomNotchStyle = {
        backgroundColor: color,
    };

    const setBorders = (style, sides) => {
        const borderColor = bottomAllowsConnections ? 'black' : 'transparent';
        style.borderLeft = `solid ${
            sides.includes('L') ? borderColor : 'transparent'
        } ${outlineWidth}px`;
        style.borderTop = `solid ${
            sides.includes('T') ? borderColor : 'transparent'
        } ${outlineWidth}px`;
        style.borderRight = `solid ${
            sides.includes('R') ? borderColor : 'transparent'
        } ${outlineWidth}px`;
        style.borderBottom = `solid ${
            sides.includes('B') ? borderColor : 'transparent'
        } ${outlineWidth}px`;
    };

    const setHighlight = (visible) => {
        // add border highlight (conditional on familial relationships)
        // kinda cringe but also
        if (visible) {
            if (child) {
                setBorders(blockStyle, ['L', 'R', 'T']);
                setBorders(topNotchStyle, ['L', 'T', 'R']);
                setBorders(bottomNotchStyle, ['R']);
            }
            if (!child) {
                setBorders(blockStyle, ['L', 'R', 'B', 'T']);
                setBorders(topNotchStyle, ['L', 'T', 'R']);
                setBorders(bottomNotchStyle, ['R', 'L', 'B']);
            }
        } else {
            setBorders(blockStyle, []);
            setBorders(topNotchStyle, []);
            setBorders(bottomNotchStyle, []);
        }
    };

    // (bottom: bool)
    const makeConnectors = () => {
        // add puzzle piece cuts
        const notchHeight = height * NOTCH_HEIGHT_RATIO;
        const notchWidth = width * NOTCH_WIDTH_RATIO;

        bottomNotchStyle.height = notchHeight;
        bottomNotchStyle.width = notchWidth;
        bottomNotchStyle.top = height - notchHeight - outlineWidth + 'px';
        bottomNotchStyle.left = width - notchWidth - outlineWidth + 'px';

        const bottom = (
            <div
                className='BottomConnector'
                key='bottom'
                style={bottomNotchStyle}
            />
        );

        return [bottom];
    };

    const handleRightClick = (e) => {
        if (!disable) {
            e.preventDefault();
            setPropsOpen(true);
        }
    };

    const handleClose = () => {
        setPropsOpen(false);
    };

    let paramPopup = <div />;
    if (!disable) {
        for (const inp of Object.values(input)) {
            inp.input = INPUT_TYPES.RAW; // input in always raw for events
        }
        paramPopup = (
            <ParamsDialog
                title={`${head}.${name}`}
                open={propsOpen}
                handleClose={handleClose}
                input={input}
                output={output}
                params={params}
                updateParams={updateParams}
            />
        );
    }

    setHighlight(highlighted);
    const connectors = makeConnectors();

    let paramInfo = <div />;
    if (input.length > 0) {
        const name = input[0].name;
        const val = params ? params[name] : '';
        paramInfo = <div className='ParamInfo'>{val}</div>;
    }

    return (
        <div
            id={id}
            ref={ref}
            className='Event'
            style={blockStyle}
            onMouseDown={onMouseDown}
            onContextMenu={handleRightClick}
        >
            {paramPopup}
            <div className='EventLabel'>
                {head}.{name}
            </div>
            {paramInfo}
            {connectors}
        </div>
    );
};

export default Event;
