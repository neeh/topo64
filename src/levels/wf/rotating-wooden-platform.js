
export function wf_seg7_collision_clocklike_rotation() {
  COL_INIT();
  COL_VERTEX_INIT(0xA);
  COL_VERTEX(0, 0, -204);
  COL_VERTEX(-176, 0, -101);
  COL_VERTEX(-176, 0, 102);
  COL_VERTEX(0, 0, 205);
  COL_VERTEX(177, 0, 102);
  COL_VERTEX(177, 0, -101);
  COL_VERTEX(0, -127, 0);
  COL_VERTEX(768, -127, 0);
  COL_VERTEX(768, 0, -101);
  COL_VERTEX(768, 0, 102);
  COL_TRI_INIT(SURFACE_DEFAULT, 15);
  COL_TRI(0, 1, 2);
  COL_TRI(0, 2, 3);
  COL_TRI(0, 3, 4);
  COL_TRI(0, 4, 5);
  COL_TRI(3, 6, 4);
  COL_TRI(2, 6, 3);
  COL_TRI(1, 6, 2);
  COL_TRI(0, 6, 1);
  COL_TRI(8, 7, 5);
  COL_TRI(5, 6, 0);
  COL_TRI(6, 7, 9);
  COL_TRI(4, 6, 9);
  COL_TRI(5, 4, 9);
  COL_TRI(5, 9, 8);
  COL_TRI(7, 6, 5);
  COL_TRI_STOP();
  COL_END();
}
