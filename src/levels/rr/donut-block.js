
export function rr_seg7_collision_donut_platform() {
  COL_INIT();
  COL_VERTEX_INIT(0x8);
  COL_VERTEX(-101, 0, -306);
  COL_VERTEX(-101, 0, 307);
  COL_VERTEX(-101, 154, 307);
  COL_VERTEX(102, 0, 307);
  COL_VERTEX(102, 154, 307);
  COL_VERTEX(102, 0, -306);
  COL_VERTEX(102, 154, -306);
  COL_VERTEX(-101, 154, -306);
  COL_TRI_INIT(SURFACE_DEFAULT, 12);
  COL_TRI(0, 1, 2);
  COL_TRI(1, 3, 4);
  COL_TRI(1, 4, 2);
  COL_TRI(5, 3, 1);
  COL_TRI(5, 1, 0);
  COL_TRI(6, 4, 3);
  COL_TRI(6, 3, 5);
  COL_TRI(7, 4, 6);
  COL_TRI(7, 2, 4);
  COL_TRI(0, 2, 7);
  COL_TRI(7, 6, 5);
  COL_TRI(7, 5, 0);
  COL_TRI_STOP();
  COL_END();
}
