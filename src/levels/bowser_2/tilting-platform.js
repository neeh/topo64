
export function bowser_2_seg7_collision_tilting_platform() {
  COL_INIT();
  COL_VERTEX_INIT(0x12);
  COL_VERTEX(1176, 784, 2838);
  COL_VERTEX(-1175, 784, 2838);
  COL_VERTEX(0, -306, 0);
  COL_VERTEX(2838, 784, 1176);
  COL_VERTEX(1176, 1229, 2838);
  COL_VERTEX(-1175, 1229, 2838);
  COL_VERTEX(0, 1229, 0);
  COL_VERTEX(2838, 1229, 1176);
  COL_VERTEX(-2837, 1229, 1176);
  COL_VERTEX(-2837, 784, 1176);
  COL_VERTEX(2838, 784, -1175);
  COL_VERTEX(2838, 1229, -1175);
  COL_VERTEX(1176, 784, -2837);
  COL_VERTEX(1176, 1229, -2837);
  COL_VERTEX(-1175, 784, -2837);
  COL_VERTEX(-2837, 784, -1175);
  COL_VERTEX(-1175, 1229, -2837);
  COL_VERTEX(-2837, 1229, -1175);
  COL_TRI_INIT(SURFACE_DEFAULT, 32);
  COL_TRI(0, 1, 2);
  COL_TRI(3, 0, 2);
  COL_TRI(3, 4, 0);
  COL_TRI(0, 5, 1);
  COL_TRI(0, 4, 5);
  COL_TRI(5, 4, 6);
  COL_TRI(4, 7, 6);
  COL_TRI(3, 7, 4);
  COL_TRI(8, 5, 6);
  COL_TRI(1, 5, 8);
  COL_TRI(2, 1, 9);
  COL_TRI(1, 8, 9);
  COL_TRI(10, 3, 2);
  COL_TRI(10, 7, 3);
  COL_TRI(7, 11, 6);
  COL_TRI(10, 11, 7);
  COL_TRI(12, 10, 2);
  COL_TRI(12, 11, 10);
  COL_TRI(11, 13, 6);
  COL_TRI(12, 13, 11);
  COL_TRI(14, 12, 2);
  COL_TRI(14, 13, 12);
  COL_TRI(13, 16, 6);
  COL_TRI(14, 16, 13);
  COL_TRI(15, 14, 2);
  COL_TRI(15, 16, 14);
  COL_TRI(16, 17, 6);
  COL_TRI(15, 17, 16);
  COL_TRI(9, 15, 2);
  COL_TRI(9, 17, 15);
  COL_TRI(17, 8, 6);
  COL_TRI(9, 8, 17);
  COL_TRI_STOP();
  COL_END();
}
