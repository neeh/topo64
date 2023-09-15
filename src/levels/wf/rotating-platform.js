
export function wf_seg7_collision_rotating_platform() {
  COL_INIT();
  COL_VERTEX_INIT(0xD);
  COL_VERTEX(-442, 0, -255);
  COL_VERTEX(0, 0, 512);
  COL_VERTEX(256, 0, 443);
  COL_VERTEX(-255, 0, 443);
  COL_VERTEX(-442, 0, 256);
  COL_VERTEX(-511, 0, 0);
  COL_VERTEX(443, 0, 256);
  COL_VERTEX(0, 0, -511);
  COL_VERTEX(-255, 0, -442);
  COL_VERTEX(256, 0, -442);
  COL_VERTEX(443, 0, -255);
  COL_VERTEX(512, 0, 0);
  COL_VERTEX(0, -255, 0);
  COL_TRI_INIT(SURFACE_DEFAULT, 12);
  COL_TRI(8, 12, 0);
  COL_TRI(8, 7, 12);
  COL_TRI(10, 11, 12);
  COL_TRI(9, 10, 12);
  COL_TRI(7, 9, 12);
  COL_TRI(0, 12, 5);
  COL_TRI(11, 6, 12);
  COL_TRI(4, 5, 12);
  COL_TRI(3, 4, 12);
  COL_TRI(1, 3, 12);
  COL_TRI(2, 1, 12);
  COL_TRI(6, 2, 12);
  COL_TRI_INIT(SURFACE_NOISE_DEFAULT, 10);
  COL_TRI(0, 1, 2);
  COL_TRI(0, 3, 1);
  COL_TRI(0, 4, 3);
  COL_TRI(0, 5, 4);
  COL_TRI(0, 2, 6);
  COL_TRI(0, 7, 8);
  COL_TRI(0, 9, 7);
  COL_TRI(0, 10, 9);
  COL_TRI(0, 11, 10);
  COL_TRI(0, 6, 11);
  COL_TRI_STOP();
  COL_END();
}