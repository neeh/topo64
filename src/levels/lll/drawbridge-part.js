
export function lll_seg7_collision_drawbridge() {
  COL_INIT();
  COL_VERTEX_INIT(0x4);
  COL_VERTEX(0, 0, -191);
  COL_VERTEX(-639, 0, -191);
  COL_VERTEX(-639, 0, 192);
  COL_VERTEX(0, 0, 192);
  COL_TRI_INIT(SURFACE_DEFAULT, 2);
  COL_TRI(0, 1, 2);
  COL_TRI(0, 2, 3);
  COL_TRI_STOP();
  COL_END();
}
