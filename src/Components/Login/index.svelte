<script>
  import { StudyService } from '@Services/Study.js';
  import { navigate } from 'svelte-routing';
  import { onMount } from 'svelte';
  import { checkTokenExpire } from '@Utils/validateToken.js';
  import queryString from 'query-string';
  //local state
  let username = '';
  let password = '';
  let noData = false;
  onMount(() => {
    validateAuthToken();
  });
  // methods
  const validateAuthToken = () => {
    const launchUrlToken = queryString.parse(location.search)?.token;
    if (launchUrlToken) {
      const secretKey = myapp.env.SECRET_KEY;
      let tokenValidity = checkTokenExpire(launchUrlToken, secretKey);
      if (tokenValidity.isValid) {
        localStorage.setItem('autoDirectToSubjectList', "Y");
        setStudyDetail(tokenValidity);
        navigate(myapp.env.INIT_PAGE, { replace: false });
      } else {
        navigate(myapp.env.ICORE_CONSOLE, { replace: true });
      }
    } else {
      const token = localStorage.getItem('token');
      if (token) {
        navigate(myapp.env.INIT_PAGE, { replace: false });
      }
    }
  };
  const checkIsValidToken = async (param) => {
    try {
      let getUserApplication = await StudyService.getUserApplications(param);
    } catch (e) {
      console.log(e);
    }
  };
  const setStudyDetail = (tokenDetail) => {
    const { token, userName, roleId, userId } = tokenDetail;
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', userName);
    localStorage.setItem('userRole', roleId);
  };
  async function handleLogin() {
    try {
      let param = {
        username,
        password,
      };
      let loginResponse = await StudyService.getValidToken(param);
      localStorage.setItem('token', loginResponse);
      noData = false;
      navigate(myapp.env.INIT_PAGE, { replace: false });
    } catch (e) {
      noData = true;
      console.log(e);
    }
  }
</script>

<style src="./style.scss">
</style>

<section>loading....</section>
<!-- <div class="login-form">
  {#if noData}
    <Alert
      config={{ type: 'danger', title: 'Error in login', message: 'Invalid login detail' }}
      close={true} />
  {/if}
  <form action="" method="post" on:submit|preventDefault={handleLogin}>
    <h2 class="text-center">Log in</h2>
    <div class="form-group">
      <input
        type="text"
        class="form-control"
        placeholder="Username"
        bind:value={username}
        required="required" />
    </div>
    <div class="form-group">
      <input
        type="password"
        class="form-control"
        placeholder="Password"
        bind:value={password}
        required="required" />
    </div>
    <div class="form-group">
      <button type="submit" class="btn btn-primary btn-block">Log in</button>
    </div>
  </form>
</div> -->
