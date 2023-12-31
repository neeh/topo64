
export const SurfaceType = {
  DEFAULT:                      0x0000, // Environment default
  BURNING:                      0x0001, // Lava / Frostbite (in SL), but is used mostly for Lava
  '0004':                       0x0004, // Unused, has no function and has parameters
  HANGABLE:                     0x0005, // Ceiling that Mario can climb on
  SLOW:                         0x0009, // Slow down Mario, unused
  DEATH_PLANE:                  0x000A, // Death floor
  CLOSE_CAMERA:                 0x000B, // Close camera
  WATER:                        0x000D, // Water, has no action, used on some waterboxes below
  FLOWING_WATER:                0x000E, // Water (flowing), has parameters
  INTANGIBLE:                   0x0012, // Intangible (Separates BBH mansion from merry-go-round, for room usage)
  VERY_SLIPPERY:                0x0013, // Very slippery, mostly used for slides
  SLIPPERY:                     0x0014, // Slippery
  NOT_SLIPPERY:                 0x0015, // Non-slippery, climbable
  TTM_VINES:                    0x0016, // TTM vines, has no action defined
  MGR_MUSIC:                    0x001A, // Plays the Merry go round music, see handle_merry_go_round_music in bbh_merry_go_round.inc.c for more details
  INSTANT_WARP_1B:              0x001B, // Instant warp to another area, used to warp between areas in WDW and the endless stairs to warp back
  INSTANT_WARP_1C:              0x001C, // Instant warp to another area, used to warp between areas in WDW
  INSTANT_WARP_1D:              0x001D, // Instant warp to another area, used to warp between areas in DDD, SSL and TTM
  INSTANT_WARP_1E:              0x001E, // Instant warp to another area, used to warp between areas in DDD, SSL and TTM
  SHALLOW_QUICKSAND:            0x0021, // Shallow Quicksand (depth of 10 units)
  DEEP_QUICKSAND:               0x0022, // Quicksand (lethal, slow, depth of 160 units)
  INSTANT_QUICKSAND:            0x0023, // Quicksand (lethal, instant)
  DEEP_MOVING_QUICKSAND:        0x0024, // Moving quicksand (flowing, depth of 160 units)
  SHALLOW_MOVING_QUICKSAND:     0x0025, // Moving quicksand (flowing, depth of 25 units)
  QUICKSAND:                    0x0026, // Moving quicksand (60 units)
  MOVING_QUICKSAND:             0x0027, // Moving quicksand (flowing, depth of 60 units)
  WALL_MISC:                    0x0028, // Used for some walls, Cannon to adjust the camera, and some objects like Warp Pipe
  NOISE_DEFAULT:                0x0029, // Default floor with noise
  NOISE_SLIPPERY:               0x002A, // Slippery floor with noise
  HORIZONTAL_WIND:              0x002C, // Horizontal wind, has parameters
  INSTANT_MOVING_QUICKSAND:     0x002D, // Quicksand (lethal, flowing)
  ICE:                          0x002E, // Slippery Ice, in snow levels and THI's water floor
  LOOK_UP_WARP:                 0x002F, // Look up and warp (Wing cap entrance)
  HARD:                         0x0030, // Hard floor (Always has fall damage)
  WARP:                         0x0032, // Surface warp
  TIMER_START:                  0x0033, // Timer start (Peach's secret slide)
  TIMER_END:                    0x0034, // Timer stop (Peach's secret slide)
  HARD_SLIPPERY:                0x0035, // Hard and slippery (Always has fall damage)
  HARD_VERY_SLIPPERY:           0x0036, // Hard and very slippery (Always has fall damage)
  HARD_NOT_SLIPPERY:            0x0037, // Hard and Non-slippery (Always has fall damage)
  VERTICAL_WIND:                0x0038, // Death at bottom with vertical wind
  BOSS_FIGHT_CAMERA:            0x0065, // Wide camera for BoB and WF bosses
  CAMERA_FREE_ROAM:             0x0066, // Free roam camera for THI and TTC
  THI3_WALLKICK:                0x0068, // Surface where there's a wall kick section in THI 3rd area, has no action defined
  CAMERA_8_DIR:                 0x0069, // Surface that enables far camera for platforms, used in THI
  CAMERA_MIDDLE:                0x006E, // Surface camera that returns to the middle, used on the 4 pillars of SSL
  CAMERA_ROTATE_RIGHT:          0x006F, // Surface camera that rotates to the right (Bowser 1 & THI)
  CAMERA_ROTATE_LEFT:           0x0070, // Surface camera that rotates to the left (BoB & TTM)
  CAMERA_BOUNDARY:              0x0072, // Intangible Area, only used to restrict camera movement
  NOISE_VERY_SLIPPERY_73:       0x0073, // Very slippery floor with noise, unused
  NOISE_VERY_SLIPPERY_74:       0x0074, // Very slippery floor with noise, unused
  NOISE_VERY_SLIPPERY:          0x0075, // Very slippery floor with noise, used in CCM
  NO_CAM_COLLISION:             0x0076, // Surface with no cam collision flag
  NO_CAM_COLLISION_77:          0x0077, // Surface with no cam collision flag, unused
  NO_CAM_COL_VERY_SLIPPERY:     0x0078, // Surface with no cam collision flag, very slippery with noise (THI)
  NO_CAM_COL_SLIPPERY:          0x0079, // Surface with no cam collision flag, slippery with noise (CCM, PSS and TTM slides)
  SWITCH:                       0x007A, // Surface with no cam collision flag, non-slippery with noise, used by switches and Dorrie
  VANISH_CAP_WALLS:             0x007B, // Vanish cap walls, pass through them with Vanish Cap
  PAINTING_WOBBLE_A6:           0x00A6, // Painting wobble (BoB Left)
  PAINTING_WOBBLE_A7:           0x00A7, // Painting wobble (BoB Middle)
  PAINTING_WOBBLE_A8:           0x00A8, // Painting wobble (BoB Right)
  PAINTING_WOBBLE_A9:           0x00A9, // Painting wobble (CCM Left)
  PAINTING_WOBBLE_AA:           0x00AA, // Painting wobble (CCM Middle)
  PAINTING_WOBBLE_AB:           0x00AB, // Painting wobble (CCM Right)
  PAINTING_WOBBLE_AC:           0x00AC, // Painting wobble (WF Left)
  PAINTING_WOBBLE_AD:           0x00AD, // Painting wobble (WF Middle)
  PAINTING_WOBBLE_AE:           0x00AE, // Painting wobble (WF Right)
  PAINTING_WOBBLE_AF:           0x00AF, // Painting wobble (JRB Left)
  PAINTING_WOBBLE_B0:           0x00B0, // Painting wobble (JRB Middle)
  PAINTING_WOBBLE_B1:           0x00B1, // Painting wobble (JRB Right)
  PAINTING_WOBBLE_B2:           0x00B2, // Painting wobble (LLL Left)
  PAINTING_WOBBLE_B3:           0x00B3, // Painting wobble (LLL Middle)
  PAINTING_WOBBLE_B4:           0x00B4, // Painting wobble (LLL Right)
  PAINTING_WOBBLE_B5:           0x00B5, // Painting wobble (SSL Left)
  PAINTING_WOBBLE_B6:           0x00B6, // Painting wobble (SSL Middle)
  PAINTING_WOBBLE_B7:           0x00B7, // Painting wobble (SSL Right)
  PAINTING_WOBBLE_B8:           0x00B8, // Painting wobble (Unused - Left)
  PAINTING_WOBBLE_B9:           0x00B9, // Painting wobble (Unused - Middle)
  PAINTING_WOBBLE_BA:           0x00BA, // Painting wobble (Unused - Right)
  PAINTING_WOBBLE_BB:           0x00BB, // Painting wobble (DDD - Left), makes the painting wobble if touched
  PAINTING_WOBBLE_BC:           0x00BC, // Painting wobble (Unused, DDD - Middle)
  PAINTING_WOBBLE_BD:           0x00BD, // Painting wobble (Unused, DDD - Right)
  PAINTING_WOBBLE_BE:           0x00BE, // Painting wobble (WDW Left)
  PAINTING_WOBBLE_BF:           0x00BF, // Painting wobble (WDW Middle)
  PAINTING_WOBBLE_C0:           0x00C0, // Painting wobble (WDW Right)
  PAINTING_WOBBLE_C1:           0x00C1, // Painting wobble (THI Tiny - Left)
  PAINTING_WOBBLE_C2:           0x00C2, // Painting wobble (THI Tiny - Middle)
  PAINTING_WOBBLE_C3:           0x00C3, // Painting wobble (THI Tiny - Right)
  PAINTING_WOBBLE_C4:           0x00C4, // Painting wobble (TTM Left)
  PAINTING_WOBBLE_C5:           0x00C5, // Painting wobble (TTM Middle)
  PAINTING_WOBBLE_C6:           0x00C6, // Painting wobble (TTM Right)
  PAINTING_WOBBLE_C7:           0x00C7, // Painting wobble (Unused, TTC - Left)
  PAINTING_WOBBLE_C8:           0x00C8, // Painting wobble (Unused, TTC - Middle)
  PAINTING_WOBBLE_C9:           0x00C9, // Painting wobble (Unused, TTC - Right)
  PAINTING_WOBBLE_CA:           0x00CA, // Painting wobble (Unused, SL - Left)
  PAINTING_WOBBLE_CB:           0x00CB, // Painting wobble (Unused, SL - Middle)
  PAINTING_WOBBLE_CC:           0x00CC, // Painting wobble (Unused, SL - Right)
  PAINTING_WOBBLE_CD:           0x00CD, // Painting wobble (THI Huge - Left)
  PAINTING_WOBBLE_CE:           0x00CE, // Painting wobble (THI Huge - Middle)
  PAINTING_WOBBLE_CF:           0x00CF, // Painting wobble (THI Huge - Right)
  PAINTING_WOBBLE_D0:           0x00D0, // Painting wobble (HMC & CotMC - Left), makes the painting wobble if touched
  PAINTING_WOBBLE_D1:           0x00D1, // Painting wobble (Unused, HMC & CotMC - Middle)
  PAINTING_WOBBLE_D2:           0x00D2, // Painting wobble (Unused, HMC & CotMC - Right)
  PAINTING_WARP_D3:             0x00D3, // Painting warp (BoB Left)
  PAINTING_WARP_D4:             0x00D4, // Painting warp (BoB Middle)
  PAINTING_WARP_D5:             0x00D5, // Painting warp (BoB Right)
  PAINTING_WARP_D6:             0x00D6, // Painting warp (CCM Left)
  PAINTING_WARP_D7:             0x00D7, // Painting warp (CCM Middle)
  PAINTING_WARP_D8:             0x00D8, // Painting warp (CCM Right)
  PAINTING_WARP_D9:             0x00D9, // Painting warp (WF Left)
  PAINTING_WARP_DA:             0x00DA, // Painting warp (WF Middle)
  PAINTING_WARP_DB:             0x00DB, // Painting warp (WF Right)
  PAINTING_WARP_DC:             0x00DC, // Painting warp (JRB Left)
  PAINTING_WARP_DD:             0x00DD, // Painting warp (JRB Middle)
  PAINTING_WARP_DE:             0x00DE, // Painting warp (JRB Right)
  PAINTING_WARP_DF:             0x00DF, // Painting warp (LLL Left)
  PAINTING_WARP_E0:             0x00E0, // Painting warp (LLL Middle)
  PAINTING_WARP_E1:             0x00E1, // Painting warp (LLL Right)
  PAINTING_WARP_E2:             0x00E2, // Painting warp (SSL Left)
  PAINTING_WARP_E3:             0x00E3, // Painting warp (SSL Medium)
  PAINTING_WARP_E4:             0x00E4, // Painting warp (SSL Right)
  PAINTING_WARP_E5:             0x00E5, // Painting warp (Unused - Left)
  PAINTING_WARP_E6:             0x00E6, // Painting warp (Unused - Medium)
  PAINTING_WARP_E7:             0x00E7, // Painting warp (Unused - Right)
  PAINTING_WARP_E8:             0x00E8, // Painting warp (DDD - Left)
  PAINTING_WARP_E9:             0x00E9, // Painting warp (DDD - Middle)
  PAINTING_WARP_EA:             0x00EA, // Painting warp (DDD - Right)
  PAINTING_WARP_EB:             0x00EB, // Painting warp (WDW Left)
  PAINTING_WARP_EC:             0x00EC, // Painting warp (WDW Middle)
  PAINTING_WARP_ED:             0x00ED, // Painting warp (WDW Right)
  PAINTING_WARP_EE:             0x00EE, // Painting warp (THI Tiny - Left)
  PAINTING_WARP_EF:             0x00EF, // Painting warp (THI Tiny - Middle)
  PAINTING_WARP_F0:             0x00F0, // Painting warp (THI Tiny - Right)
  PAINTING_WARP_F1:             0x00F1, // Painting warp (TTM Left)
  PAINTING_WARP_F2:             0x00F2, // Painting warp (TTM Middle)
  PAINTING_WARP_F3:             0x00F3, // Painting warp (TTM Right)
  TTC_PAINTING_1:               0x00F4, // Painting warp (TTC Left)
  TTC_PAINTING_2:               0x00F5, // Painting warp (TTC Medium)
  TTC_PAINTING_3:               0x00F6, // Painting warp (TTC Right)
  PAINTING_WARP_F7:             0x00F7, // Painting warp (SL Left)
  PAINTING_WARP_F8:             0x00F8, // Painting warp (SL Middle)
  PAINTING_WARP_F9:             0x00F9, // Painting warp (SL Right)
  PAINTING_WARP_FA:             0x00FA, // Painting warp (THI Tiny - Left)
  PAINTING_WARP_FB:             0x00FB, // Painting warp (THI Tiny - Middle)
  PAINTING_WARP_FC:             0x00FC, // Painting warp (THI Tiny - Right)
  WOBBLING_WARP:                0x00FD, // Pool warp (HMC & DDD)
  TRAPDOOR:                     0x00FF, // Bowser Left trapdoor, has no action defined
};

const global = window;
for (const name in SurfaceType) {
  global['SURFACE_' + name] = SurfaceType[name];
}

export const SurfaceColors = [
  '#4d3595', '#8ef7ec', '#061683', '#876330', '#c09496', '#15efbc', '#8a200c', '#acbbbc', '#27c374', '#1cc303', '#a5b639', '#e6745c', '#ba0bcf', '#24a988', '#180b75', '#1fc438', '#d69245', '#51be5f', '#78ab1b', '#a2c3a1', '#6fcbad', '#e6dc2c', '#499b5f', '#d1ccca', '#be9b6c', '#77cdea', '#5f4c23', '#8920f1', '#e43014', '#b89ff5', '#80e6d7', '#b88659', '#9b6a8f', '#81b5c9', '#1c85b2', '#78f501', '#0e9ad4', '#fbc91f', '#9ca0e0', '#76c466', '#707e73', '#982767', '#2c96bd', '#872c42', '#46b9b9', '#80f6a4', '#5fcb91', '#862776', '#34feb3', '#b483dc', '#42195d', '#d6a3d6', '#c2da4e', '#5de400', '#041271', '#751fa6', '#aa4d6d', '#0210ab', '#818302', '#60b057', '#4462c5', '#51aefa', '#776324', '#975a97', '#61367d', '#323e69', '#2281b6', '#ec061d', '#e2eed6', '#cdba7d', '#94a649', '#824b83', '#6f31ba', '#881120', '#6b033b', '#838f20', '#42f983', '#48b870', '#77c6c8', '#645f44', '#1999d6', '#abf3f7', '#5deea7', '#26d4e1', '#0fa808', '#1d1a78', '#c6e8b7', '#4223bd', '#418055', '#dc813f', '#9a42a8', '#696286', '#1f5f0f', '#47611e', '#8bda47', '#5f768f', '#3ab549', '#adb543', '#e35b4c', '#2d05f6', '#b1faf2', '#6c00bf', '#f424d0', '#e83c58', '#03eb64', '#40e5f1', '#994baf', '#cbe3a0', '#4a66e6', '#5bb179', '#f7a219', '#6a0b57', '#c353a6', '#45a67d', '#8ad96a', '#e44ea0', '#61ea84', '#4b47ff', '#452a00', '#1d6816', '#905e4f', '#53c30f', '#c81958', '#375405', '#1444bd', '#39da3e', '#0a9512', '#02f8b0', '#09cab4', '#0e047e', '#5ddf90', '#35d882', '#cf1f37', '#fd990e', '#a14299', '#0c0f8e', '#cdea36', '#c4acb6', '#d7045d', '#b0304b', '#348422', '#90f372', '#b742a8', '#2b5394', '#cc3178', '#32e5a9', '#e0157c', '#c0e902', '#8fb4f7', '#484256'
];
