
export function wdw_seg7_collision_express_elevator_platform() {
  COL_INIT();
  COL_VERTEX_INIT(0x8);
  COL_VERTEX(512, 0, -64);
  COL_VERTEX(-357, 0, -64);
  COL_VERTEX(-357, 51, -64);
  COL_VERTEX(512, 51, -64);
  COL_VERTEX(512, 0, 384);
  COL_VERTEX(-357, 0, 384);
  COL_VERTEX(512, 51, 384);
  COL_VERTEX(-357, 51, 384);
  COL_TRI_INIT(SURFACE_DEFAULT, 12);
  COL_TRI(0, 1, 2);
  COL_TRI(0, 2, 3);
  COL_TRI(0, 4, 5);
  COL_TRI(0, 5, 1);
  COL_TRI(6, 4, 0);
  COL_TRI(6, 0, 3);
  COL_TRI(5, 4, 6);
  COL_TRI(5, 6, 7);
  COL_TRI(1, 5, 7);
  COL_TRI(1, 7, 2);
  COL_TRI(2, 7, 6);
  COL_TRI(2, 6, 3);
  COL_TRI_STOP();
  COL_END();
}
