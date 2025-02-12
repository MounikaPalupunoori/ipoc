
import { writable } from 'svelte/store';
export const SIDE_BAR_LIST = writable([]);
export const ENABLE_SIDEBAR = writable(true);
export const selectedLinkState = writable({})