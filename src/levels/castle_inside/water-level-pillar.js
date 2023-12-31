
export function inside_castle_seg7_collision_water_level_pillar() {
  COL_INIT();
  COL_VERTEX_INIT(0x8);
  COL_VERTEX(-153, 0, -153);
  COL_VERTEX(-153, -409, 154);
  COL_VERTEX(-153, 0, 154);
  COL_VERTEX(154, 0, -153);
  COL_VERTEX(154, 0, 154);
  COL_VERTEX(154, -409, 154);
  COL_VERTEX(154, -409, -153);
  COL_VERTEX(-153, -409, -153);
  COL_TRI_INIT(SURFACE_DEFAULT, 10);
  COL_TRI(0, 1, 2);
  COL_TRI(2, 3, 0);
  COL_TRI(2, 4, 3);
  COL_TRI(2, 5, 4);
  COL_TRI(2, 1, 5);
  COL_TRI(4, 5, 6);
  COL_TRI(4, 6, 3);
  COL_TRI(0, 7, 1);
  COL_TRI(3, 6, 7);
  COL_TRI(3, 7, 0);
  COL_TRI_STOP();
  COL_END();
}
