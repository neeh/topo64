import { COL_INIT, COL_VERTEX_INIT, COL_VERTEX, COL_TRI_INIT, COL_TRI, COL_TRI_SPECIAL, COL_TRI_STOP, COL_SPECIAL_INIT, SPECIAL_OBJECT_WITH_YAW, COL_WATER_BOX_INIT, COL_WATER_BOX, COL_END } from '../../commands.js';
import { SurfaceType } from '../../surface-terrains.js';

export function ttm_seg7_collision_ukiki_cage() {
  COL_INIT();
  COL_VERTEX_INIT(0x8);
  COL_VERTEX(-76, 102, -76);
  COL_VERTEX(77, -76, -76);
  COL_VERTEX(-76, -76, -76);
  COL_VERTEX(-76, -76, 77);
  COL_VERTEX(77, -76, 77);
  COL_VERTEX(77, 102, -76);
  COL_VERTEX(77, 102, 77);
  COL_VERTEX(-76, 102, 77);
  COL_TRI_INIT(SURFACE_DEFAULT, 12);
  COL_TRI(0, 1, 2);
  COL_TRI(0, 2, 3);
  COL_TRI(2, 4, 3);
  COL_TRI(2, 1, 4);
  COL_TRI(0, 5, 1);
  COL_TRI(6, 4, 1);
  COL_TRI(6, 1, 5);
  COL_TRI(3, 4, 6);
  COL_TRI(0, 3, 7);
  COL_TRI(3, 6, 7);
  COL_TRI(0, 7, 6);
  COL_TRI(0, 6, 5);
  COL_TRI_STOP();
  COL_END();
}