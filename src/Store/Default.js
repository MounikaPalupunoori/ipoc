
import { writable } from 'svelte/store';
import {SORT_ORDER} from '@Constants/default.js'
export const SELECTED_STUDIES = writable([]);
export const fromSelectedStudies = writable([]);
export const toSelectedStudies = writable([]);
export const SIDE_BAR_LIST = writable([]);
export const copyFromOtherStudy = writable({});
export const paginationState = writable({});
export const searchInputState = writable({
    searchInput:""
});
export const sortState = writable({
    sortInput:""
});
export const importedData = writable({})
export const entityStateList = writable([])
export const aclState = writable([])
export const auditTableState = writable({})
export const enableAuditState = writable(false)
export const aclSortOrder = writable(SORT_ORDER.aclTable)

