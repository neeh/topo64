
export function lll_seg7_collision_floating_block() {
  COL_INIT();
  COL_VERTEX_INIT(0x8);
  COL_VERTEX(128, 0, 256);
  COL_VERTEX(128, 154, 256);
  COL_VERTEX(-127, 154, 256);
  COL_VERTEX(128, 154, -255);
  COL_VERTEX(-127, 154, -255);
  COL_VERTEX(128, 0, -255);
  COL_VERTEX(-127, 0, -255);
  COL_VERTEX(-127, 0, 256);
  COL_TRI_INIT(SURFACE_DEFAULT, 10);
  COL_TRI(0, 1, 2);
  COL_TRI(1, 3, 4);
  COL_TRI(1, 4, 2);
  COL_TRI(5, 3, 1);
  COL_TRI(5, 1, 0);
  COL_TRI(6, 3, 5);
  COL_TRI(6, 4, 3);
  COL_TRI(7, 2, 4);
  COL_TRI(7, 4, 6);
  COL_TRI(0, 2, 7);
  COL_TRI_STOP();
  COL_END();
}
