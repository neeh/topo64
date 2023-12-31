
export function jrb_seg7_collision_floating_box() {
  COL_INIT();
  COL_VERTEX_INIT(0x8);
  COL_VERTEX(-101, 0, 77);
  COL_VERTEX(-101, 0, -76);
  COL_VERTEX(102, 0, -76);
  COL_VERTEX(102, 0, 77);
  COL_VERTEX(102, 154, 77);
  COL_VERTEX(-101, 154, 77);
  COL_VERTEX(102, 154, -76);
  COL_VERTEX(-101, 154, -76);
  COL_TRI_INIT(SURFACE_DEFAULT, 12);
  COL_TRI(0, 1, 2);
  COL_TRI(0, 2, 3);
  COL_TRI(3, 4, 5);
  COL_TRI(4, 6, 7);
  COL_TRI(4, 7, 5);
  COL_TRI(2, 6, 4);
  COL_TRI(2, 4, 3);
  COL_TRI(1, 6, 2);
  COL_TRI(1, 7, 6);
  COL_TRI(0, 5, 7);
  COL_TRI(0, 7, 1);
  COL_TRI(3, 5, 0);
  COL_TRI_STOP();
  COL_END();
}
