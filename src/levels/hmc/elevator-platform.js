
export function hmc_seg7_collision_elevator() {
  COL_INIT();
  COL_VERTEX_INIT(0x8);
  COL_VERTEX(-255, 0, 256);
  COL_VERTEX(-255, 102, 256);
  COL_VERTEX(-255, 102, -255);
  COL_VERTEX(256, 102, 256);
  COL_VERTEX(256, 102, -255);
  COL_VERTEX(256, 0, 256);
  COL_VERTEX(256, 0, -255);
  COL_VERTEX(-255, 0, -255);
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
