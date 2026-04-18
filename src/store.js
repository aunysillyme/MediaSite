import { create } from 'zustand'
import { ENTRANCE_CAMERA } from './data/platforms.js'

export const useVenueStore = create((set) => ({
  activePlatform: null,
  isTransitioning: false,
  cameraPos: ENTRANCE_CAMERA.pos,
  cameraLook: ENTRANCE_CAMERA.look,
  overlayOpen: false,

  setActivePlatform: (platform) =>
    set({
      activePlatform: platform,
      isTransitioning: true,
      cameraPos: platform ? platform.cameraPos : ENTRANCE_CAMERA.pos,
      cameraLook: platform ? platform.cameraLook : ENTRANCE_CAMERA.look,
    }),

  openOverlay: () => set({ overlayOpen: true, isTransitioning: false }),

  closeOverlay: () =>
    set({
      overlayOpen: false,
      activePlatform: null,
      cameraPos: ENTRANCE_CAMERA.pos,
      cameraLook: ENTRANCE_CAMERA.look,
      isTransitioning: true,
    }),

  finishTransition: () => set({ isTransitioning: false }),
}))
