import { create } from 'zustand'

export const useVenueStore = create((set) => ({
  activePlatform: null,
  overlayOpen: false,
  portalOpen: false,

  setActivePlatform: (platform) =>
    set({ activePlatform: platform, overlayOpen: true, portalOpen: true }),

  closeOverlay: () =>
    set({ overlayOpen: false, portalOpen: false }),

  clearActivePlatform: () =>
    set((state) => state.overlayOpen ? {} : { activePlatform: null }),
}))
