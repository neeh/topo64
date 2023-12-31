
export function bbh_seg7_collision_tilt_floor_platform() {
  COL_INIT();
  COL_VERTEX_INIT(0x8);
  COL_VERTEX(307, 0, -255);
  COL_VERTEX(-306, 0, 256);
  COL_VERTEX(307, 0, 256);
  COL_VERTEX(307, -101, -255);
  COL_VERTEX(307, -101, 256);
  COL_VERTEX(-306, -101, -255);
  COL_VERTEX(-306, 0, -255);
  COL_VERTEX(-306, -101, 256);
  COL_TRI_INIT(SURFACE_DEFAULT, 12);
  COL_TRI(0, 1, 2);
  COL_TRI(2, 3, 0);
  COL_TRI(2, 4, 3);
  COL_TRI(1, 4, 2);
  COL_TRI(0, 3, 5);
  COL_TRI(4, 5, 3);
  COL_TRI(0, 6, 1);
  COL_TRI(0, 5, 6);
  COL_TRI(4, 7, 5);
  COL_TRI(1, 7, 4);
  COL_TRI(6, 7, 1);
  COL_TRI(6, 5, 7);
  COL_TRI_STOP();
  COL_END();
}
