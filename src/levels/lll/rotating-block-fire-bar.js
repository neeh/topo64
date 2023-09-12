
export function lll_seg7_collision_rotating_fire_bars() {
  COL_INIT();
  COL_VERTEX_INIT(0xC);
  COL_VERTEX(-165, 0, 0);
  COL_VERTEX(-115, 205, 0);
  COL_VERTEX(-57, 205, -100);
  COL_VERTEX(-82, 0, -143);
  COL_VERTEX(-82, 0, 144);
  COL_VERTEX(-57, 205, 101);
  COL_VERTEX(58, 205, -100);
  COL_VERTEX(58, 205, 101);
  COL_VERTEX(116, 205, 0);
  COL_VERTEX(83, 0, -143);
  COL_VERTEX(83, 0, 144);
  COL_VERTEX(166, 0, 0);
  COL_TRI_INIT(SURFACE_DEFAULT, 16);
  COL_TRI(0, 1, 2);
  COL_TRI(0, 2, 3);
  COL_TRI(4, 5, 0);
  COL_TRI(5, 1, 0);
  COL_TRI(3, 2, 6);
  COL_TRI(2, 1, 5);
  COL_TRI(2, 5, 7);
  COL_TRI(2, 7, 8);
  COL_TRI(2, 8, 6);
  COL_TRI(3, 6, 9);
  COL_TRI(10, 5, 4);
  COL_TRI(10, 7, 5);
  COL_TRI(11, 8, 7);
  COL_TRI(11, 7, 10);
  COL_TRI(9, 6, 8);
  COL_TRI(9, 8, 11);
  COL_TRI_STOP();
  COL_END();
}
