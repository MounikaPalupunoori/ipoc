<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { SIDE_BAR_LIST } from '@Store/Default.js';
  import { setLocalStorage } from '@Utils/localStorage.js';
  import { selectedLinkState } from '@Store/Sidebar.js';
  import { setExpanded } from '@Helper/charts.js';
  let dispatch = createEventDispatcher();
  export let routeChange;
  export let navDataList;
  let navLink;
  $: isNavDisplay = false;
  $: if (routeChange && navLink) {
    handleRouteChange(routeChange, navLink);
  }
  let selectedLink = JSON.parse(localStorage.getItem('selectedLink'));
  const unsubscribe = SIDE_BAR_LIST.subscribe((state) => {
    if (Object.keys(state).length) {
      setChildNavData();
    }
  });
  const unsubscribeSel = selectedLinkState.subscribe((state) => {
    if (Object.keys(state).length) {
      selectedLink = state;
      navDataList = setExpanded(navDataList,selectedLink);
    }
  })
  onMount(() => {
    showList();
    isNavDisplay = true;
  });
  function setChildNavData() {
    try{
      let obj = $SIDE_BAR_LIST?.reduce((acc, data, index) => {
        if (acc.hasOwnProperty(data.algorithmInfo.displaySection)) {
          acc[data.algorithmInfo.displaySection].push({
            id: index,
            name: data.algorithmInfo.algorithmName,
            displayName: data.algorithmInfo.algorithmDisplayLabel,
            isExpanded: false,
            link: '/analysis',
            isEnabled: true,
          });
        } else {
          acc[data.algorithmInfo.displaySection] = [
            {
              id: index,
              name: data.algorithmInfo.algorithmName,
              displayName: data.algorithmInfo.algorithmDisplayLabel,
              isExpanded: false,
              link: '/analysis',
              isEnabled: true,
            },
          ];
        }
        return acc;
      }, {});
      navDataList = navDataList.map((list) => {
        if (
          list?.key != 'preprocessing' &&
          list?.key != 'phenotype' &&
          list?.key != 'jobscreen'
        ) {
          list.children = obj[list?.key];
        }
        list['link'] = `${list.key}`;
        return list;
      });
    }catch(e){
      console.log(e);
    }
  }
  const showList = (index = null) => {
  navDataList = setExpanded(navDataList,selectedLink);
  };
  const toggleNavbar = (index = null) => {
    navDataList[index]['isExpanded'] = !navDataList[index]['isExpanded'];
    navDataList = navDataList;
  };
  function handleRouteChange(routeChange, link) {
    if (routeChange) {
      routeChange = false;
      window.location.href = link;
    }
  }
  const getClickedAction = (childNav, nav) => {
    let obj = {};
    obj = { ...childNav };
    localStorage.setItem('selectedLink', JSON.stringify(obj));
    let setOrderTest = {
      fromPatientCreate:false
    }
    setLocalStorage('patient_order_test',setOrderTest);
    dispatch('onRouteChange', childNav.link);
    navLink = childNav.link;
    handleRouteChange(routeChange, navLink);
  };
  const getActiveNavLink = (childNav) => {
    return childNav?.key == selectedLink?.key;
  };
  const routeChangeAlgo = (e) => {
    dispatch('onRouteChange', e.detail);
  };
</script>

<style src="./style.scss">
</style>

<section class="col-md-2 d-none d-md-block sidebar">
  <div class="nav" id="navbar">
    <nav class="nav__container">
      <div class="nav__list">
        {#each navDataList as nav, index}
          <div class="nav__items">
            {#if nav.hasOwnProperty('link')}
              <div class="nav_item_wrapper" on:click={() => toggleNavbar(index)}>
                <a href="{nav.link}" class="nav__subtitle">{nav.title}</a>
              </div>
            {:else}
              <div class="nav_item_wrapper" on:click={() => toggleNavbar(index)}>
                <h3 class="nav__subtitle">{nav.title}</h3>
                <i class={nav.isExpanded ? 'up arrow' : 'down arrow'} />
              </div>
              {#each nav.children as childNav, childIndex}
                <div
                  class={nav.isExpanded ? 'nav__dropdown display-block' : 'hide'}
                  on:click={(event) => {
                    nav.children[childIndex]['isChildrenExpanded'] = nav.children[childIndex].isChildrenExpanded ? !nav.children[childIndex].isChildrenExpanded : true;
                  }}>
                  <a
                    class={!childNav?.isEnabled ? 'disabled-links' : 'nav__link'}>
                    <span
                      class={getActiveNavLink(childNav) ? `nav__name selected-link` : `nav__name`}
                      on:click={() => getClickedAction(childNav, nav)}>{childNav.displayName}
                    </span>
                  </a>
                  {#if childNav.hasOwnProperty('children')}
                    <div>
                      {#each childNav.children as childrenItem}
                        <div
                          class={nav.children[childIndex]['isChildrenExpanded'] ? 'nav__dropdown-collapse display-block' : 'hide'}>
                          <div class="nav__dropdown-content">
                            <a
                              href={nav.link}
                              class="nav__dropdown-item"
                              on:click={() => getClickedAction(childrenItem, nav)}>
                              {childrenItem.name}
                            </a>
                          </div>
                        </div>
                      {/each}
                    </div>
                  {/if}
                </div>
              {/each}
            {/if}
          </div>
        {/each}
      </div>
    </nav>
  </div>
</section>
