import { writable } from 'svelte/store';

export const faces = writable(true);
export const edges = writable(true);
export const seams = writable(true);
export const bounds = writable(true);
export const gaps = writable(true);
export const folds = writable(true);