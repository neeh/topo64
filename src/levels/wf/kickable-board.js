
export function wf_seg7_collision_kickable_board() {
  COL_INIT();
  COL_VERTEX_INIT(0x8);
  COL_VERTEX(-96, 0, 0);
  COL_VERTEX(-96, 1178, 77);
  COL_VERTEX(-96, 1178, 0);
  COL_VERTEX(95, 1178, 77);
  COL_VERTEX(95, 1178, 0);
  COL_VERTEX(95, 0, 0);
  COL_VERTEX(95, 0, 77);
  COL_VERTEX(-96, 0, 77);
  COL_TRI_INIT(SURFACE_WALL_MISC, 12);
  COL_TRI(0, 1, 2);
  COL_TRI(2, 1, 3);
  COL_TRI(2, 3, 4);
  COL_TRI(2, 4, 5);
  COL_TRI(2, 5, 0);
  COL_TRI(4, 3, 6);
  COL_TRI(4, 6, 5);
  COL_TRI(0, 7, 1);
  COL_TRI(3, 1, 7);
  COL_TRI(3, 7, 6);
  COL_TRI(5, 6, 7);
  COL_TRI(5, 7, 0);
  COL_TRI_STOP();
  COL_END();
}
