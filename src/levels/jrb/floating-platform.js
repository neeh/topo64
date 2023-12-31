
export function jrb_seg7_collision_floating_platform() {
  COL_INIT();
  COL_VERTEX_INIT(0x8);
  COL_VERTEX(256, -63, 640);
  COL_VERTEX(-255, 64, 640);
  COL_VERTEX(-255, -63, 640);
  COL_VERTEX(-255, -63, -639);
  COL_VERTEX(-255, 64, -639);
  COL_VERTEX(256, 64, -639);
  COL_VERTEX(256, -63, -639);
  COL_VERTEX(256, 64, 640);
  COL_TRI_INIT(SURFACE_DEFAULT, 12);
  COL_TRI(0, 1, 2);
  COL_TRI(0, 2, 3);
  COL_TRI(2, 4, 3);
  COL_TRI(2, 1, 4);
  COL_TRI(3, 4, 5);
  COL_TRI(5, 4, 1);
  COL_TRI(0, 3, 6);
  COL_TRI(3, 5, 6);
  COL_TRI(0, 7, 1);
  COL_TRI(5, 1, 7);
  COL_TRI(6, 5, 7);
  COL_TRI(6, 7, 0);
  COL_TRI_STOP();
  COL_END();
}
