import { CollisionModel } from './collision-model.js';

let curModel = null;
let isInit = false;
let vertexCount = 0;
let curBatch = null;
let curBatchSize = 0;
let specialObjCount = 0;
let waterBoxesCount = 0;

function resetInternal() {
  isInit = false;
  vertexCount = 0;
  curBatch = null;
  curBatchSize = 0;
  specialObjCount = 0;
  waterBoxesCount = 0;
}

export function COL_INIT() {
  if (isInit) {
    throw new Error('COL_INIT: called twice');
  }
  if (!curModel) {
    throw new Error('COL_INIT: no CollisionModel to output');
  }
  resetInternal();
  isInit = true;
}

export function COL_VERTEX_INIT(count) {
  if (!curModel) {
    throw new Error('COL_VERTEX_INIT: no model to output to');
  }
  if (!isInit) {
    throw new Error('COL_VERTEX_INIT: not initialized');
  }
  if (vertexCount > 0) {
    throw new Error('COL_VERTEX_INIT: already called for this model');
  }
  if (count === 0) {
    throw new Error('COL_VERTEX_INIT: vertex count cannot be 0');
  }
  vertexCount = count;
}

export function COL_VERTEX(x, y, z) {
  if (!curModel) {
    throw new Error('COL_VERTEX: no model to output to');
  }
  if (!isInit) {
    throw new Error('COL_VERTEX: not initialized');
  }
  if (curModel.vertices.length >= vertexCount) {
    throw new Error('COL_VERTEX: cannot add more vertices');
  }
  curModel.vertices.push([x, y, z]);
}

export function COL_TRI_INIT(type, count) {
  if (!curModel) {
    throw new Error('COL_TRI_INIT: no model to output to');
  }
  if (curBatch && curBatch.tris.length < curBatchSize) {
    throw new Error('COL_TRI_INIT: previous batch is incomplete');
  }
  if (count === 0) {
    throw new Error('COL_TRI_INIT: batch cannot be empty');
  }
  curBatch = { type, tris: [] };
  curBatchSize = count;
  curModel.batches.push(curBatch);
}

function COL_TRI_internal(a, b, c, sp) {
  if (!curModel) {
    throw new Error('no model to output to');
  }
  if (!curBatch) {
    throw new Error('no batch to output to');
  }
  if (curBatch.tris.length >= curBatchSize) {
    throw new Error('current batch is full');
  }
  if (Math.max(a, b, c) >= curModel.vertices.length) {
    throw new Error('unreachable vertex');
  }
  curBatch.tris.push([a, b, c, sp]);
}

export function COL_TRI(a, b, c) {
  try {
    COL_TRI_internal(a, b, c, 0);
  } catch (err) {
    throw new Error('COL_TRI: ' + err);
  }
}

export function COL_TRI_SPECIAL(a, b, c, sp) {
  try {
    COL_TRI_internal(a, b, c, sp);
  } catch (err) {
    throw new Error('COL_TRI_SPECIAL: ' + err);
  }
}

export function COL_TRI_STOP() {
  if (!curModel) {
    throw new Error('COL_TRI_STOP: no active model');
  }
  if (!curBatch) {
    throw new Error('COL_TRI_STOP: no active batch');
  }
  if (curBatch.tris.length < curBatchSize) {
    throw new Error('COL_TRI_STOP: current batch is incomplete');
  }
  curBatch = null;
  curBatchSize = 0;
}

export function COL_SPECIAL_INIT(count) {
  if (!curModel) {
    throw new Error('COL_SPECIAL_INIT: no model to output to');
  }
  if (!isInit) {
    throw new Error('COL_SPECIAL_INIT: not initialized');
  }
  if (specialObjCount > 0) {
    throw new Error('COL_SPECIAL_INIT: already called for this model');
  }
  if (count === 0) {
    throw new Error('COL_SPECIAL_INIT: vertex count cannot be 0');
  }
  specialObjCount = count;
}


export function SPECIAL_OBJECT_internal(name, x, y, z, yaw = 0, param = 0) {
  if (!curModel) {
    throw new Error('no model to output to');
  }
  if (!isInit) {
    throw new Error('not initialized');
  }
  if (curModel.specialObjs.length >= specialObjCount) {
    throw new Error('cannot add more special objects');
  }
  curModel.specialObjs.push({ name, pos: [x, y, z], yaw, param });
}

export function SPECIAL_OBJECT(name, x, y, z) {
  try {
    SPECIAL_OBJECT_internal(name, x, y, z);
  } catch (err) {
    throw new Error('SPECIAL_OBJECT: ' + err);
  }
}

export function SPECIAL_OBJECT_WITH_YAW(name, x, y, z, yaw) {
  try {
    SPECIAL_OBJECT_internal(name, x, y, z, yaw);
  } catch (err) {
    throw new Error('SPECIAL_OBJECT_WITH_YAW: ' + err);
  }
}

export function SPECIAL_OBJECT_WITH_YAW_AND_PARAM(name, x, y, z, yaw, param) {
  try {
    SPECIAL_OBJECT_internal(name, x, y, z, yaw, param);
  } catch (err) {
    throw new Error('SPECIAL_OBJECT_WITH_YAW_AND_PARAM: ' + err);
  }
}

export function COL_WATER_BOX_INIT(count) {
  if (!curModel) {
    throw new Error('COL_WATER_BOX_INIT: no model to output to');
  }
  if (!isInit) {
    throw new Error('COL_WATER_BOX_INIT: not initialized');
  }
  if (waterBoxesCount > 0) {
    throw new Error('COL_WATER_BOX_INIT: already called for this model');
  }
  if (count === 0) {
    throw new Error('COL_WATER_BOX_INIT: count cannot be 0');
  }
  waterBoxesCount = count;
}

export function COL_WATER_BOX(id, minX, maxX, minZ, maxZ, height) {
  if (!curModel) {
    throw new Error('COL_WATER_BOX: no model to output to');
  }
  if (!isInit) {
    throw new Error('COL_WATER_BOX: not initialized');
  }
  if (curModel.waterBoxes.length >= waterBoxesCount) {
    throw new Error('COL_WATER_BOX: cannot add more water boxes');
  }
  curModel.waterBoxes.push({ id, bounds: [minX, maxX, minZ, maxZ], height });
}

export function COL_END() {
  if (!curModel) {
    throw new Error('COL_END: no active model');
  }
  if (!isInit) {
    throw new Error('COL_END: nothing to end');
  }
  if (curModel.specialObjs.length < specialObjCount) {
    throw new Error('COL_END: missing some special objects');
  }
  if (curModel.waterBoxes.length < waterBoxesCount) {
    throw new Error('COL_END: missing some special objects');
  }
  resetInternal();
}

const commands = {
  COL_INIT,
  COL_VERTEX_INIT,
  COL_VERTEX,
  COL_TRI_INIT,
  COL_TRI,
  COL_TRI_SPECIAL,
  COL_TRI_STOP,
  COL_SPECIAL_INIT,
  SPECIAL_OBJECT,
  SPECIAL_OBJECT_WITH_YAW,
  SPECIAL_OBJECT_WITH_YAW_AND_PARAM,
  COL_WATER_BOX_INIT,
  COL_WATER_BOX,
  COL_END,
};

const specialObjNames = [
  'special_0stars_door',
  'special_1star_door',
  'special_3star_door',
  'special_bowser',
  'special_bubble_tree',
  'special_castle_door_warp',
  'special_haunted_door',
  'special_hmc_door',
  'special_level_geo_03',
  'special_level_geo_04',
  'special_level_geo_05',
  'special_level_geo_06',
  'special_level_geo_07',
  'special_level_geo_08',
  'special_level_geo_09',
  'special_level_geo_0A',
  'special_level_geo_0B',
  'special_level_geo_0C',
  'special_level_geo_0D',
  'special_level_geo_0E',
  'special_level_geo_0F',
  'special_level_geo_10',
  'special_level_geo_11',
  'special_level_geo_12',
  'special_level_geo_13',
  'special_level_geo_14',
  'special_level_geo_15',
  'special_level_geo_16',
  'special_metal_door',
  'special_metal_door_warp',
  'special_mine',
  'special_null_start',
  'special_snow_tree',
  'special_spiky_tree',
  'special_wooden_door',
  'special_wooden_door_warp',
];

const global = window;
for (const name in commands) {
  global[name] = commands[name];
}
for (const name of specialObjNames) {
  global[name] = name;
}

export function createModel(commandsWrap) {
  const model = new CollisionModel(commandsWrap.name);

  curModel = model;
  commandsWrap();
  curModel = null;

  return model;
}
