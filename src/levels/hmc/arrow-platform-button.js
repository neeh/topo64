
export function hmc_seg7_collision_controllable_platform_sub() {
  COL_INIT();
  COL_VERTEX_INIT(0x8);
  COL_VERTEX(38, 11, 38);
  COL_VERTEX(-37, 11, 38);
  COL_VERTEX(-50, 0, 51);
  COL_VERTEX(51, 0, 51);
  COL_VERTEX(38, 11, -37);
  COL_VERTEX(-37, 11, -37);
  COL_VERTEX(51, 0, -50);
  COL_VERTEX(-50, 0, -50);
  COL_TRI_INIT(SURFACE_NOT_SLIPPERY, 10);
  COL_TRI(0, 1, 2);
  COL_TRI(0, 2, 3);
  COL_TRI(0, 4, 5);
  COL_TRI(1, 0, 5);
  COL_TRI(4, 0, 3);
  COL_TRI(6, 4, 3);
  COL_TRI(5, 4, 6);
  COL_TRI(7, 5, 6);
  COL_TRI(1, 5, 7);
  COL_TRI(1, 7, 2);
  COL_TRI_STOP();
  COL_END();
}
