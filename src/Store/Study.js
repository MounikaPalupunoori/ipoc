import { writable, derived } from 'svelte/store';
const STUDY = [];
const { subscribe, set, update } = writable(STUDY);
const setStudies = (studyList) =>  update(() => {
  return [...studyList];
});
const getStudies = () => {
  let studyList;
  derived(STUDY, study => study).subscribe(study => studyList = study);
  return [...studyList];
}
const reset = () => {
  set(STUDY);
};
export { subscribe, setStudies, getStudies, reset};
