
export function ttc_seg7_collision_clock_platform() {
  COL_INIT();
  COL_VERTEX_INIT(0x8);
  COL_VERTEX(256, -153, -127);
  COL_VERTEX(256, 0, -127);
  COL_VERTEX(256, 0, 128);
  COL_VERTEX(-255, 0, -127);
  COL_VERTEX(-255, 0, 128);
  COL_VERTEX(-255, -153, 128);
  COL_VERTEX(256, -153, 128);
  COL_VERTEX(-255, -153, -127);
  COL_TRI_INIT(SURFACE_NOT_SLIPPERY, 12);
  COL_TRI(0, 1, 2);
  COL_TRI(0, 3, 1);
  COL_TRI(1, 4, 2);
  COL_TRI(1, 3, 4);
  COL_TRI(5, 4, 3);
  COL_TRI(2, 4, 5);
  COL_TRI(0, 2, 6);
  COL_TRI(2, 5, 6);
  COL_TRI(0, 7, 3);
  COL_TRI(5, 3, 7);
  COL_TRI(6, 7, 0);
  COL_TRI(6, 5, 7);
  COL_TRI_STOP();
  COL_END();
}
