
export function wf_seg7_collision_trapezoid() {
  COL_INIT();
  COL_VERTEX_INIT(0x8);
  COL_VERTEX(-214, 102, -204);
  COL_VERTEX(-214, 0, -204);
  COL_VERTEX(-504, 0, 85);
  COL_VERTEX(-504, 102, 85);
  COL_VERTEX(215, 102, -204);
  COL_VERTEX(505, 0, 85);
  COL_VERTEX(505, 102, 85);
  COL_VERTEX(215, 0, -204);
  COL_TRI_INIT(SURFACE_DEFAULT, 10);
  COL_TRI(0, 1, 2);
  COL_TRI(0, 2, 3);
  COL_TRI(4, 0, 3);
  COL_TRI(5, 2, 1);
  COL_TRI(3, 2, 5);
  COL_TRI(3, 5, 6);
  COL_TRI(4, 3, 6);
  COL_TRI(5, 1, 7);
  COL_TRI(6, 5, 7);
  COL_TRI(6, 7, 4);
  COL_TRI_STOP();
  COL_END();
}
