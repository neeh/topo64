
export function lll_seg7_collision_wood_piece() {
  COL_INIT();
  COL_VERTEX_INIT(0x4);
  COL_VERTEX(154, 154, -383);
  COL_VERTEX(-153, 154, -383);
  COL_VERTEX(-153, 154, 384);
  COL_VERTEX(154, 154, 384);
  COL_TRI_INIT(SURFACE_DEFAULT, 2);
  COL_TRI(0, 1, 2);
  COL_TRI(0, 2, 3);
  COL_TRI_STOP();
  COL_END();
}
