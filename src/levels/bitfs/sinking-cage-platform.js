
export function bitfs_seg7_collision_sinking_cage_platform() {
  COL_INIT();
  COL_VERTEX_INIT(0xA);
  COL_VERTEX(307, 0, 307);
  COL_VERTEX(307, 0, -306);
  COL_VERTEX(307, 152, 307);
  COL_VERTEX(307, 152, -306);
  COL_VERTEX(-306, 0, -306);
  COL_VERTEX(307, 154, -306);
  COL_VERTEX(-306, 154, -306);
  COL_VERTEX(-306, 0, 307);
  COL_VERTEX(-306, 154, 307);
  COL_VERTEX(307, 154, 307);
  COL_TRI_INIT(SURFACE_DEFAULT, 10);
  COL_TRI(0, 1, 2);
  COL_TRI(1, 3, 2);
  COL_TRI(1, 4, 5);
  COL_TRI(6, 4, 7);
  COL_TRI(4, 6, 5);
  COL_TRI(8, 6, 7);
  COL_TRI(3, 6, 8);
  COL_TRI(9, 7, 0);
  COL_TRI(9, 8, 7);
  COL_TRI(3, 8, 2);
  COL_TRI_STOP();
  COL_END();
}
