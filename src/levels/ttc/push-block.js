
export function ttc_seg7_collision_sliding_surface() {
  COL_INIT();
  COL_VERTEX_INIT(0x8);
  COL_VERTEX(102, 102, -450);
  COL_VERTEX(-101, 102, 10);
  COL_VERTEX(102, 102, 10);
  COL_VERTEX(-101, -101, 10);
  COL_VERTEX(102, -101, 10);
  COL_VERTEX(102, -101, -450);
  COL_VERTEX(-101, -101, -450);
  COL_VERTEX(-101, 102, -450);
  COL_TRI_INIT(SURFACE_NO_CAM_COLLISION, 10);
  COL_TRI(0, 1, 2);
  COL_TRI(2, 1, 3);
  COL_TRI(2, 3, 4);
  COL_TRI(2, 4, 5);
  COL_TRI(2, 5, 0);
  COL_TRI(4, 6, 5);
  COL_TRI(4, 3, 6);
  COL_TRI(0, 7, 1);
  COL_TRI(7, 6, 3);
  COL_TRI(7, 3, 1);
  COL_TRI_STOP();
  COL_END();
}
