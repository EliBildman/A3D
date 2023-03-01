import '../App.css';
import { useRef, useState } from 'react';
import Xarrow from 'react-xarrows';
import ParamsDialog from './ParamsDialog';
import { dialogActionsClasses, Divider } from '@mui/material';

const NOTCH_HEIGHT_RATIO = 0.05;
const NOTCH_WIDTH_RATIO = 0.2;

const Action = (props) => {
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
        parent,
        child,
        highlighted,
        outlineWidth,
        held,
        bottomNotch,
        arrows,
        bottomAllowsConnections,
        clickArrow,
        disable,
        input,
        output,
        params,
        updateParams,
    } = props;

    const ident = id ?? `display-${head}.${name}`;

    const ref = useRef();
    const [propsOpen, setPropsOpen] = useState(false);

    const blockStyle = {
        top,
        left,
        backgroundColor: color,
        height: height * (1 - NOTCH_HEIGHT_RATIO) + 'px',
        width: width + 'px',
        color: textColor,
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
            if (parent && child) {
                setBorders(blockStyle, ['L', 'R']);
                setBorders(topNotchStyle, ['L']);
                setBorders(bottomNotchStyle, ['R']);
            }
            if (!parent && child) {
                setBorders(blockStyle, ['L', 'R', 'T']);
                setBorders(topNotchStyle, ['L', 'T', 'R']);
                setBorders(bottomNotchStyle, ['R']);
            }
            if (parent && !child) {
                setBorders(blockStyle, ['L', 'R', 'B']);
                setBorders(topNotchStyle, ['L']);
                setBorders(bottomNotchStyle, ['R', 'L', 'B']);
            }
            if (!parent && !child) {
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
    const makeConnectors = (bottom) => {
        // add puzzle piece cuts
        const notchHeight = height * NOTCH_HEIGHT_RATIO;
        const notchWidth = width * NOTCH_WIDTH_RATIO;

        topNotchStyle.height = notchHeight;
        topNotchStyle.width = width - notchWidth;
        topNotchStyle.top = -notchHeight - outlineWidth + 'px';
        topNotchStyle.left = -outlineWidth;

        const top = (
            <div
                className='TopConnector'
                key='thetopone'
                style={topNotchStyle}
            />
        );

        if (bottom) {
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
            return [top, bottom];
        }

        return [top];
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

    setHighlight(highlighted);
    const connectors = makeConnectors(bottomNotch);

    const xArrows = [];
    const boxes = [];

    for (const [arrowId, arrow] of Object.entries(arrows)) {
        let end = `${ident}-${arrowId}`;
        let startAnchor = { position: 'bottom', offset: { x: 0, y: 0 } };
        let endAnchor = { position: 'bottom', offset: { x: 0, y: 5 } };
        let headSize = 3;
        if (arrow.to) {
            end = arrow.to;
            startAnchor = ['left', 'right'];
            endAnchor = ['left', 'right'];
            headSize = 5;
        }
        const onMouseDown = (ev) => {
            if (!disable) {
                ev.stopPropagation();
                clickArrow(ident, arrowId);
            }
        };
        xArrows.push(
            <Xarrow
                startAnchor={startAnchor}
                endAnchor={endAnchor}
                path={'smooth'}
                key={arrowId}
                start={`${ident}-${arrowId}`}
                end={end}
                passProps={{
                    onClick: onMouseDown,
                    className: 'Arrow',
                }}
                zIndex={3}
                headSize={headSize}
            />
        );

        boxes.push(
            <div
                onMouseDown={onMouseDown}
                id={`${ident}-${arrowId}`}
                key={arrowId}
                className={arrow.selected ? 'ArrowBox selected' : 'ArrowBox'}
                zindex={4}
            >
                {arrow.name}
            </div>
        );
    }

    let paramPopup = <div />;
    if (!disable) {
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

    let paramInfo = <div />;
    if (input.length > 0) {
        const name = input[0].name;
        const val = params ? params[name] : '';
        paramInfo = <div className='ParamInfo'>{val}</div>;
    }

    return (
        <div
            id={ident ?? ``}
            ref={ref}
            className='Action'
            style={blockStyle}
            onMouseDown={onMouseDown}
            onContextMenu={handleRightClick}
        >
            {paramPopup}
            <div className='ActionLabel'>
                {head}.{name}
            </div>
            {paramInfo}
            <div className='ArrowBoxContainer'>{boxes}</div>
            {connectors}
            {xArrows}
        </div>
    );
};

export default Action;
