
export function ttc_seg7_collision_07015754() {
  COL_INIT();
  COL_VERTEX_INIT(0x8);
  COL_VERTEX(-101, 205, -101);
  COL_VERTEX(-101, 0, 102);
  COL_VERTEX(-101, 205, 102);
  COL_VERTEX(-101, 0, -101);
  COL_VERTEX(102, 205, 102);
  COL_VERTEX(102, 0, 102);
  COL_VERTEX(102, 0, -101);
  COL_VERTEX(102, 205, -101);
  COL_TRI_INIT(SURFACE_NOT_SLIPPERY, 12);
  COL_TRI(0, 1, 2);
  COL_TRI(0, 3, 1);
  COL_TRI(4, 1, 5);
  COL_TRI(4, 2, 1);
  COL_TRI(1, 3, 6);
  COL_TRI(5, 1, 6);
  COL_TRI(0, 6, 3);
  COL_TRI(0, 7, 6);
  COL_TRI(4, 6, 7);
  COL_TRI(4, 5, 6);
  COL_TRI(7, 2, 4);
  COL_TRI(7, 0, 2);
  COL_TRI_STOP();
  COL_END();
}
