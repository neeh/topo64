
export function ssl_seg7_collision_grindel() {
  COL_INIT();
  COL_VERTEX_INIT(0x8);
  COL_VERTEX(224, 450, -224);
  COL_VERTEX(224, 3, -224);
  COL_VERTEX(-224, 3, -224);
  COL_VERTEX(-224, 450, -224);
  COL_VERTEX(-224, 3, 224);
  COL_VERTEX(224, 3, 224);
  COL_VERTEX(224, 450, 224);
  COL_VERTEX(-224, 450, 224);
  COL_TRI_INIT(SURFACE_DEFAULT, 12);
  COL_TRI(0, 1, 2);
  COL_TRI(0, 2, 3);
  COL_TRI(3, 2, 4);
  COL_TRI(2, 1, 5);
  COL_TRI(2, 5, 4);
  COL_TRI(6, 5, 1);
  COL_TRI(6, 1, 0);
  COL_TRI(7, 4, 5);
  COL_TRI(7, 5, 6);
  COL_TRI(3, 4, 7);
  COL_TRI(7, 6, 0);
  COL_TRI(7, 0, 3);
  COL_TRI_STOP();
  COL_END();
}
