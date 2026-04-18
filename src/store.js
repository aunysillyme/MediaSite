import { create } from 'zustand'

export const useVenueStore = create((set) => ({
  activePlatform: null,
  overlayOpen: false,

  setActivePlatform: (platform) =>
    set({ activePlatform: platform, overlayOpen: true }),

  closeOverlay: () =>
    set({ activePlatform: null, overlayOpen: false }),
}))
