import { create } from 'zustand';

interface ConnectionState {
  isConnecting: boolean;
  fromNodeId: string | null;
  fromPinId: string | null;
  toNodeId: string | null;
  toPinId: string | null;
}

interface ConnectionStore extends ConnectionState {
  startConnection: (nodeId: string, pinId: string) => void;
  endConnection: (nodeId: string, pinId: string) => void;
  cancelConnection: () => void;
}

export const useConnectionStore = create<ConnectionStore>((set) => ({
  isConnecting: false,
  fromNodeId: null,
  fromPinId: null,
  toNodeId: null,
  toPinId: null,

  startConnection: (nodeId, pinId) =>
    set({
      isConnecting: true,
      fromNodeId: nodeId,
      fromPinId: pinId,
    }),

  endConnection: (nodeId, pinId) =>
    set({
      toNodeId: nodeId,
      toPinId: pinId,
    }),

  cancelConnection: () =>
    set({
      isConnecting: false,
      fromNodeId: null,
      fromPinId: null,
      toNodeId: null,
      toPinId: null,
    }),
}));
