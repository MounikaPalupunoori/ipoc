<script>
  import { getContext, onMount,onDestroy } from 'svelte';
  const { open } = getContext('simple-modal');
  import { fade } from 'svelte/transition';
  import Icon from 'svelte-awesome';
  import { signOut, user, info } from 'svelte-awesome/icons';
  import { navigate } from 'svelte-routing';
  import { ROUTER } from 'svelte-routing/src/contexts';
  import { ENABLE_SIDEBAR } from '@Store/Sidebar.js';
  import { StudyController } from '@Controller/StudyController.js';
  import Fa from 'svelte-fa';
  import { faAlignJustify } from '@fortawesome/free-solid-svg-icons';
  const { activeRoute } = getContext(ROUTER);
  import About from './About.svelte';
  let routePath;
  let userName = '';
  let isMenuDisplay = false;
  let sidebarStatus = true;
  $: {
    routePath = $activeRoute?.uri;
  }
  onMount(() => {
    getUserNameEvent();
    getUserName();
  });
  onDestroy(() => {
    window.removeEventListener('poc-get-username');
  });
  async function handleSignout() {
    try {
      let revokeToken = await StudyController.revokeToken();
      localStorage.clear();
      // navigate(myapp.env.ICORE_CONSOLE, { replace: true });
      window.location.href = myapp.env.ICORE_CONSOLE;

    } catch (error) {
      console.log(error);
    }
  }
  async function showAboutPage() {
    console.log('About iCore');
    open(
      About,
      {
        appName: 'iPOC',
        version: myapp.env.BUILD_VERSION,
        build: myapp.env.BUILD_NUMBER,
        buildDate: myapp.env.BUILD_DATE,
        appDescription: 'Precision Oncology Console'
      },
      {
        closeButton: true,
        closeOnEsc: true,
        closeOnOuterClick: true,
        styleCloseButton: {
          borderRadius: 0,
          boxShadow: 'none',
        },
        styleWindow: {
          borderRadius: '0.3rem!important',
          width: 'max-content!important',
          positon: 'relative!important',
          backgroundClip: ' padding-box',
          border: '1px solid rgba(0,0,0,.2)',
        },
        styleContent: {
          padding: '1rem!important',
        }
      }
    );
  }
  const handleMouseover = () => {
    isMenuDisplay = !isMenuDisplay;
  };
  const handleMouseleave = () => {
    isMenuDisplay = false;
  };
  /**
   * @name getUserName
   * @param
   * @returns
   * @description This getUserName used for get current logged in username from localstorage.
   * @example getUserName();
   */
  const getUserName = () => {
    userName = localStorage.getItem('userName');
    userName = userName && userName != 'null' ? userName : '';
  };
   /**
   * @name getUserNameEvent
   * @param
   * @returns
   * @description This getUserNameEvent used to get current logged in reactive way from localstorage.
   * @example getUserNameEvent();
   */
   const getUserNameEvent = () => {
    window.addEventListener('poc-get-username', (event) => {
      userName = event.detail.storage;
    });
  }
  const handleSidebar = () =>{
    sidebarStatus = !sidebarStatus;
    ENABLE_SIDEBAR.set(sidebarStatus)
  }
  /**
   * Launch iCore Console
   */
   const launchiCoreConsole = () => {
    let url = myapp.env.ICORE_CONSOLE + '/#/welcome';
    window.open(url, '_blank');
  };
</script>

<style src="./style.scss">
</style>

<nav
  class="navbar navbar-white sticky-top flex-md-nowrap px-3 shadow navbar-expand-lg navbar-light">
  <span role="sidebaricon" title={!sidebarStatus ? "Show Menu" : "Hide Menu"} class="" on:click={handleSidebar}><Fa icon={faAlignJustify} scale={1.0} /></span>
  <a class="navbar-brand d-flex align-items-center px-3" href="#" on:click={launchiCoreConsole}>
    <span class="icore logo-container">
      <i class="logo"></i>
      <span class="icare-logo-txt">
        <span class="text-style-2">i</span>Care
      </span>
    </span>
  </a>
  <!-- <button
    class="navbar-toggler"
    type="button"
    data-toggle="collapse"
    data-target="#navbarSupportedContent"
    aria-controls="navbarSupportedContent"
    aria-expanded="false"
    aria-label="Toggle navigation">
    <span class="navbar-toggler-icon" />
  </button> -->

  <div class="collapse navbar-collapse">
    <ul class="navbar-nav ml-auto">
      <li class="nav-item dropdown nav_hover">
        <a
          on:click={handleMouseover}
          transition:fade
          class="nav-link dropdown-toggle d-flex align-items-center "
          href="#"
          id="navbarDropdown"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false">
          <Icon data={user} scale="1" style={'fill:#fff'} />
          <span>{userName}</span>
        </a>
        <div
          class="dropdown-menu dropdown-menu-right listMenu"
          aria-labelledby="navbarDropdown"
          class:show={isMenuDisplay}
          class:hide={!isMenuDisplay}>
          <a class="dropdown-item itemCursor" on:click={handleSignout}>
            <Icon data={signOut} scale="1" style={'margin-right:10.5px'} /><span>Logout</span></a>
          <a class="dropdown-item itemCursor" on:click={showAboutPage}>
            <Icon data={info} scale="1" style={'margin-right:10.5px'} /><span>About iCore</span></a>
        </div>
      </li>
    </ul>
  </div>
</nav>
