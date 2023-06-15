import { DATA_TYPES, ENTITY_TYPES } from './types';
import { v4 as uuid } from 'uuid';
import { wordToColor } from './color';
import * as deepcopy from 'deepcopy';

// translate entity info to backend info TODO: make this way better

export const headstoSpawners = (actionHeads, eventHeads) => {
  const spawnerHeads = [];

  const confirmHead = (name) => {
    let head = spawnerHeads.find((h) => h.name === name);
    if (!head) {
      head = {
        name,
        actions: [],
        events: [],
      };
      spawnerHeads.push(head);
    }
    return head;
  };

  for (const [name, actions] of Object.entries(actionHeads)) {
    const head = confirmHead(name);
    head.actions = actions.map((action) => {
      // translate the object :/
      const arrows = {};
      for (const trigger of action.triggers) {
        arrows[trigger] = {
          name: trigger,
        };
      }
      return {
        name: action.name,
        input: action.input,
        output: action.output,
        connections_allowed: action.direct_connections,
        arrows,
      };
    });
  }

  for (const [name, events] of Object.entries(eventHeads)) {
    const head = confirmHead(name);
    head.events = events.map((event) => {
      return {
        name: event.name,
        input: event.props,
        output: event.output,
      };
    });
  }

  return spawnerHeads;
};

export const entitiesToPage = (ind, entityInfo, pageName) => {
  const page = {
    ind,
    name: pageName,
    listeners: [],
    fragments: [],
  };
  const entities = { ...entityInfo };

  while (Object.values(entities).length > 0) {
    let [id, entity] = Object.entries(entities)[0];

    if (entity.type === ENTITY_TYPES.EVENT) {
      const listener = {
        event: {
          head: entity.head,
          name: entity.name,
        },
        props: entity.params,
        fragment: entity.child,
        id: id,
        pos: entity.pos,
      };

      for (const input of entity.input) {
        if (listener.props[input.name] === undefined) {
          listener.props[input.name] = null;
        }
      }

      page.listeners.push(listener);
      delete entities[id];
    } else if (entity.type === ENTITY_TYPES.ACTION) {
      while (
        entity.parent &&
        entities[entity.parent] &&
        entities[entity.parent].type === ENTITY_TYPES.ACTION
      ) {
        // get to top of fragment
        id = entity.parent;
        entity = entities[id];
      }
      const fragment = {
        id, // use the id and position of the top entity
        pos: entity.pos,
        routine: [],
      };
      // add all entities in fragment
      while (id != null) {
        entity = entities[id];
        const action = {
          action: {
            head: entity.head,
            name: entity.name,
          },
          params: entity.params,
          triggers: Object.values(entity.arrows).reduce(
            // god this is cringe
            (acc, arrow) => {
              acc[arrow.name] = arrow.to; // comes out {arrow_name: id_of_fragment_pointed_to}
              return acc;
            },
            {}
          ),
        };

        for (const input of entity.input) {
          if (action.params[input.name] === undefined) {
            action.params[input.name] = null;
          }
        }

        fragment.routine.push(action);
        delete entities[id];
        id = entity.child;
      }
      page.fragments.push(fragment);
    }
  }
  return page;
};

export const pageToEntities = (page, spawnerInfo, blockHeight) => {
  const entities = {};
  let name = 'untitled';

  const lookupSpawner = (head, name, type) => {
    const spawnerHead = spawnerInfo.find((s) => s.name === head);
    if (!spawnerHead) return null;

    if (type === ENTITY_TYPES.EVENT) {
      const spawnerEvent = spawnerHead.events.find((e) => e.name === name);
      return spawnerEvent;
    }

    if (type === ENTITY_TYPES.ACTION) {
      const spawnerAction = spawnerHead.actions.find((a) => a.name === name);
      return spawnerAction;
    }

    return null;
  };

  const connect = (id, to) => {
    // connect block (id) to new parent (to) (must be highest connecting to lowest)
    entities[to].child = id;
    entities[id].parent = to;
    let x = entities[to].pos.x;
    let y = entities[to].pos.y + blockHeight;
    while (id != null) {
      entities[id].pos.x = x;
      entities[id].pos.y = y;
      y += blockHeight;
      id = entities[id].child;
    }
  };

  const createEvent = (listener) => {
    const spawner = lookupSpawner(
      listener.event.head,
      listener.event.name,
      ENTITY_TYPES.EVENT,
      spawnerInfo
    );
    const entity = deepcopy(spawner);
    entity.pos = listener.pos;
    entity.id = listener.id;

    const [color, contrastColor] = wordToColor(listener.event.head);
    entity.color = color;
    entity.textColor = contrastColor;

    entity.params = listener.props;
    entity.highlighted = false;

    entities[entity.id] = entity;
    return entity.id;
  };

  const createAction = (action, id) => {
    const spawner = lookupSpawner(
      action.action.head,
      action.action.name,
      ENTITY_TYPES.ACTION,
      spawnerInfo
    );
    const entity = deepcopy(spawner);
    entity.pos = {};
    entity.id = id;

    const [color, contrastColor] = wordToColor(action.action.head);
    entity.color = color;
    entity.textColor = contrastColor;

    entity.params = action.params;
    entity.highlighted = false;

    entity.arrows = {};
    for (const [trigger, to] of Object.entries(action.triggers)) {
      entity.arrows[trigger] = {
        name: trigger,
        selected: false,
        to,
      };
    }

    entities[entity.id] = entity;
    return entity.id;
  };

  if (page.fragments) {
    for (const fragment of page.fragments) {
      let curID = createAction(fragment.routine[0], fragment.id);
      entities[curID].pos = fragment.pos;
      for (const action of fragment.routine.slice(1)) {
        // excluding first
        let nextID = createAction(action, uuid()); //create new ids for subsequent actions :/
        connect(nextID, curID);
        curID = nextID;
      }
    }
  }

  if (page.listeners) {
    for (const listener of page.listeners) {
      const eventID = createEvent(listener);
      if (listener.fragment) {
        connect(listener.fragment, eventID);
      }
    }
  }

  if (page.name) {
    name = page.name;
  }

  return [entities, name];
};
