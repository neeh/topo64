
export function inside_castle_seg7_collision_star_door() {
  COL_INIT();
  COL_VERTEX_INIT(0x8);
  COL_VERTEX(-80, 0, -20);
  COL_VERTEX(-80, 256, 20);
  COL_VERTEX(-80, 256, -20);
  COL_VERTEX(80, 256, 20);
  COL_VERTEX(80, 256, -20);
  COL_VERTEX(80, 0, -20);
  COL_VERTEX(-80, 0, 20);
  COL_VERTEX(80, 0, 20);
  COL_TRI_INIT(SURFACE_DEFAULT, 8);
  COL_TRI(2, 3, 4);
  COL_TRI(2, 1, 3);
  COL_TRI(5, 2, 4);
  COL_TRI(5, 0, 2);
  COL_TRI(6, 3, 1);
  COL_TRI(6, 7, 3);
  COL_TRI(5, 6, 0);
  COL_TRI(5, 7, 6);
  COL_TRI_STOP();
  COL_END();
}
