
export function wdw_seg7_collision_rect_floating_platform() {
  COL_INIT();
  COL_VERTEX_INIT(0x8);
  COL_VERTEX(256, -63, 640);
  COL_VERTEX(-255, -63, 640);
  COL_VERTEX(-255, -63, -639);
  COL_VERTEX(256, -63, -639);
  COL_VERTEX(256, 64, 640);
  COL_VERTEX(-255, 64, 640);
  COL_VERTEX(-255, 64, -639);
  COL_VERTEX(256, 64, -639);
  COL_TRI_INIT(SURFACE_DEFAULT, 12);
  COL_TRI(0, 1, 2);
  COL_TRI(0, 2, 3);
  COL_TRI(0, 4, 5);
  COL_TRI(0, 5, 1);
  COL_TRI(3, 4, 0);
  COL_TRI(1, 5, 6);
  COL_TRI(1, 6, 2);
  COL_TRI(2, 6, 7);
  COL_TRI(2, 7, 3);
  COL_TRI(3, 7, 4);
  COL_TRI(7, 5, 4);
  COL_TRI(7, 6, 5);
  COL_TRI_STOP();
  COL_END();
}
