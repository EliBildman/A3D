import '../App.css';
import Action from './Action';
import { useEffect, useRef, useState } from 'react';
import { ENTITY_TYPES } from '../tools/types';
import { useXarrow, Xwrapper } from 'react-xarrows';
import Catalog from './Catalog';
import { v4 as uuid } from 'uuid';
import ReactDOM from 'react-dom';
import Event from './Event';
import { getHeads } from '../tools/api';
import { getPage, savePage } from '../tools/api';
import { entitiesToPage, pageToEntities } from '../tools/translation';
import Utils from './Utils';

const MAX_FARGMENT_LENGTH = 100;
const SNAP_DISTANCE = 100;

const BLOCK_HEIGHT = 80;
const BLOCK_WIDTH = 150;
const OUTLINE_WIDTH = 2;

// i know this file is horrific, it a proof of concept

const Editor = (props) => {
  const panelRef = useRef();
  const [pageInd, _setPageInd] = useState(0);
  const [entityInfo, _setEntityInfo] = useState({});
  const [spawnerInfo, setSpawnerInfo] = useState([]);
  const [held, setHeld] = useState([]);
  const [hover, setHover] = useState(null);
  const updateArrow = useXarrow();
  const [arrowSelected, setArrowSelected] = useState(null);
  const [unsaved, setUnsaved] = useState(false);
  const [warned, setWarned] = useState(false);

  useEffect(() => {
    getHeads().then((heads) => {
      setSpawnerInfo(heads);
      getPage(pageInd).then((page) => {
        _setEntityInfo(pageToEntities(page, heads, BLOCK_HEIGHT));
      });
    });
  }, [pageInd]);

  const _save = () => {
    setUnsaved(false);
    setWarned(false);
    savePage(entitiesToPage(pageInd, entityInfo));
  };

  const setPage = (ind) => {
    if (unsaved && !warned) {
      alert('Unsaved changes!');
      setWarned(true);
      return;
    }
    setUnsaved(false);
    setWarned(false);
    _setPageInd(ind);
  };

  // useEffect(() => {
  //     const listener = (e) => {
  //         if (e.key === 'ArrowRight') {
  //             setPage(pageInd + 1);
  //         }
  //         if (e.key === 'ArrowLeft') {
  //             if (pageInd > 0) {
  //                 setPage(pageInd - 1);
  //             }
  //         }
  //         if (e.key === 's' && e.ctrlKey) {
  //             _save();
  //         }
  //     };
  //     document.addEventListener('keydown', listener);
  //     return () => {
  //         document.removeEventListener('keydown', listener);
  //     };
  // }, [pageInd, entityInfo]);

  // set and flag unsaved changes
  const setEntityInfo = (info) => {
    setUnsaved(true);
    _setEntityInfo(info);
  };

  const moveBlock = (id, dX, dY, info) => {
    info[id].pos.x += dX;
    info[id].pos.y += dY;
  };

  const clearHighlights = (info) => {
    for (const block of Object.values(info)) block.highlighted = false;
  };

  const checkHover = (id, info) => {
    // get element being hovered, null otherwise
    const block = info[id];
    if (info[id].type !== ENTITY_TYPES.ACTION) {
      return null; //dont check if holding a event
    }

    for (const [otherId, otherEntity] of Object.entries(info)) {
      if (
        id !== otherId &&
        !held.includes(otherId) &&
        Math.abs(block.pos.x - otherEntity.pos.x) < SNAP_DISTANCE &&
        Math.abs(block.pos.y - otherEntity.pos.y) < SNAP_DISTANCE
      ) {
        return otherId;
      }
    }
    return null;
  };

  const getTop = (id, info) => {
    // gets highest level parent
    while (
      info[id].parent != null &&
      info[info[id].parent].type === ENTITY_TYPES.ACTION
    ) {
      id = info[id].parent;
    }
    return id;
  };

  const getBottom = (id, info) => {
    // gets lowest level child
    while (info[id].child != null) {
      id = info[id].child;
    }
    return id;
  };

  const highlight = (id, info) => {
    // highlights fragment starting with id (needs parent)
    if (info[id].parent) {
      // has a event
      info[info[id].parent].highlighted = true;
    }
    while (id != null) {
      info[id].highlighted = true;
      id = info[id].child;
    }
  };

  const connect = (id, to, info) => {
    // connect block (id) to new parent (to) (must be highest connecting to lowest)
    info[to].child = id;
    info[id].parent = to;
    let x = info[to].pos.x;
    let y = info[to].pos.y + BLOCK_HEIGHT;
    while (id != null) {
      // reposition new blocks, could be improved
      info[id].pos.x = x;
      info[id].pos.y = y;
      y += BLOCK_HEIGHT;
      id = info[id].child;
    }
  };

  const deleteEntity = (id, info) => {
    delete info[id];
    // remove incoming arrows TODO: fix please!
    Object.values(info)
      .filter((entity) => entity.type === ENTITY_TYPES.ACTION)
      .forEach((action) => {
        for (const arrow of Object.values(action.arrows)) {
          if (arrow.to === id) arrow.to = null;
        }
      });
  };

  const onMouseMove = (ev) => {
    if (held.length > 0) {
      let newInfo = { ...entityInfo };
      const top = newInfo[held[0]];
      if (top.parent) {
        // disconnect from parent if there is one
        newInfo[top.parent].child = null;
        top.parent = null;
      }
      for (const blockId of held) {
        moveBlock(blockId, ev.movementX, ev.movementY, newInfo);
      }
      clearHighlights(newInfo);
      const newHover = checkHover(held[0], newInfo);
      if (newHover) {
        highlight(getTop(newHover, newInfo), newInfo);
      }
      setHover(newHover);
      setEntityInfo(newInfo);
      updateArrow();
    }
  };

  const dropHeld = () => {
    if (held.length > 0) {
      const newInfo = { ...entityInfo };
      clearHighlights(newInfo);
      const top = held[0];
      if (hover && newInfo[top].type === ENTITY_TYPES.ACTION) {
        const bottom = getBottom(hover, newInfo);
        if (
          entityInfo[bottom].type === ENTITY_TYPES.EVENT ||
          entityInfo[bottom].connections_allowed
        ) {
          const hoverTop = getTop(bottom, newInfo);

          if (newInfo[hoverTop].type === ENTITY_TYPES.ACTION) {
            // reloocate any arrows pointing to held, TODO make better
            Object.values(newInfo)
              .filter((entity) => entity.type === ENTITY_TYPES.ACTION)
              .forEach((action) => {
                for (const arrow of Object.values(action.arrows))
                  if (arrow.to === top) {
                    if (getTop(arrow.from, newInfo) !== hoverTop) {
                      arrow.to = hoverTop;
                    } else {
                      arrow.to = null;
                    }
                  }
              });
            // disconnect arrows from held to hover TODO: make better
            for (const action of held) {
              for (const arrow of Object.values(newInfo[action].arrows)) {
                if (arrow.to === hoverTop) {
                  arrow.to = null;
                }
              }
            }
          }
          connect(top, bottom, newInfo);
        }
      } else if (newInfo[top].pos.x < 0) {
        //if hovering catalog, delete
        for (const id of held) {
          deleteEntity(id, newInfo);
        }
      }
      setHeld([]);
      setEntityInfo(newInfo);
      setHover(null);
    }
  };

  const pickUp = (id) => {
    const newHeld = [];
    let blockId = id;
    let depth = 0;
    while (blockId != null) {
      // pickup all children
      newHeld.push(blockId);
      blockId = entityInfo[blockId].child;

      depth += 1;
      if (depth > MAX_FARGMENT_LENGTH) {
        console.error('Max fragment length reached, something went wrong');
        setHeld([]);
        break;
      }
    }
    setHeld(newHeld);
  };

  const clickArrow = (entity, arrow) => {
    if (entityInfo[entity].arrows[arrow].to) {
      attachArrow(entity, arrow, null); // detach arrow
    } else {
      setArrowSelected({ entity, arrow });
    }
  };

  const attachArrow = (entity, arrow, to) => {
    const newInfo = { ...entityInfo };
    newInfo[entity].arrows[arrow].to = to;
    setEntityInfo(newInfo);
    setArrowSelected(null);
  };

  const createEntity = (entity, pos) => {
    const newInfo = { ...entityInfo };

    const panelPos = ReactDOM.findDOMNode(
      panelRef.current
    ).getBoundingClientRect();

    const id = uuid();
    newInfo[id] = entity;

    entity.pos = { x: pos.x - panelPos.x, y: pos.y - panelPos.y };

    entity.params = {}; //TODO

    entity.parent = null;
    entity.highlighted = false;

    if (entity.type === ENTITY_TYPES.ACTION) {
      entity.child = null;

      for (const arrow of Object.values(entity.arrows)) {
        arrow.from = id;
        arrow.to = null;
      }
    }

    setEntityInfo(newInfo);
    setHeld([id]);
  };

  const getHandleEntityClicked = (id) => {
    return (ev) => {
      ev.stopPropagation();
      if (arrowSelected && entityInfo[id].type === ENTITY_TYPES.ACTION) {
        const top = getTop(id, entityInfo);
        const arrowFrom = getTop(arrowSelected.entity, entityInfo); //top of frag arrow is coming from
        if (arrowFrom !== top) {
          attachArrow(arrowSelected.entity, arrowSelected.arrow, top);
        } else {
          setArrowSelected(null);
        }
      } else {
        pickUp(id);
      }
    };
  };

  const handleEditorClicked = (ev) => {
    setArrowSelected(null);
  };

  const updateParamCallback = (id) => (param) => (value) => {
    const newInfo = { ...entityInfo };
    newInfo[id].params[param] = value;
    setEntityInfo(newInfo);
  };

  const blocks = Object.keys(entityInfo).map((id, ind) => {
    const info = entityInfo[id];
    const bottom = getBottom(id, entityInfo);
    const updateParams = updateParamCallback(id);
    const mouseDownCallback = getHandleEntityClicked(id);
    if (info.type === ENTITY_TYPES.ACTION) {
      for (const [arrowId, arrow] of Object.entries(info.arrows)) {
        arrow.selected =
          arrowSelected &&
          arrowSelected.entity === id &&
          arrowSelected.arrow === arrowId;
      }
      return (
        <Action
          key={id}
          id={id}
          name={info.name}
          head={info.head}
          onMouseDown={mouseDownCallback}
          clickArrow={clickArrow}
          left={info.pos.x}
          top={info.pos.y}
          color={info.color}
          textColor={info.textColor}
          parent={info.parent}
          child={info.child}
          highlighted={info.highlighted}
          height={BLOCK_HEIGHT}
          width={BLOCK_WIDTH}
          outlineWidth={OUTLINE_WIDTH}
          held={held.includes(id)}
          bottomNotch={info.connections_allowed}
          arrows={info.arrows}
          bottomAllowsConnections={entityInfo[bottom].connections_allowed}
          params={info.params}
          input={info.input}
          output={info.output}
          updateParams={updateParams}
        />
      );
    } else if (info.type === ENTITY_TYPES.EVENT) {
      const bottomConnections =
        bottom === id || entityInfo[bottom].connections_allowed;
      return (
        <Event
          key={id}
          id={id}
          name={info.name}
          head={info.head}
          onMouseDown={mouseDownCallback}
          left={info.pos.x}
          top={info.pos.y}
          color={info.color}
          textColor={info.textColor}
          child={info.child}
          highlighted={info.highlighted}
          height={BLOCK_HEIGHT}
          width={BLOCK_WIDTH}
          outlineWidth={OUTLINE_WIDTH}
          held={held.includes(id)}
          bottomAllowsConnections={bottomConnections}
          params={info.params}
          input={info.input}
          output={info.output}
          updateParams={updateParams}
        />
      );
    } else {
      return <div></div>;
    }
  });

  return (
    <div
      id="Editor"
      className="Editor"
      onMouseDown={handleEditorClicked}
      onMouseMove={onMouseMove}
      onMouseUp={dropHeld}
      onMouseLeave={dropHeld}
    >
      <Catalog
        spawnerInfo={spawnerInfo}
        createEntity={createEntity}
        blockInfo={{
          height: BLOCK_HEIGHT,
          width: BLOCK_WIDTH,
          outlineWidth: OUTLINE_WIDTH,
        }}
      />
      <div className="RightSide">
        <div className="TopBar">
          <Utils
            className="Utils"
            saveCallback={_save}
            pageInd={pageInd}
            setPageInd={setPage}
            unsaved={unsaved}
          />
        </div>
        <div className="Panel" ref={panelRef}>
          <Xwrapper>{blocks}</Xwrapper>
        </div>
      </div>
    </div>
  );
};

export default Editor;
