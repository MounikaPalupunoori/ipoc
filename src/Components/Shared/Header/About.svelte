<script>
  export let version = '5.0.0';
  export let build = '666';
  export let buildDate = '20-08-2022';
  export let appName = 'iPOC';
  export let appDescription = 'Precision Oncology Console';
</script>

<style>
  h3 {
    color: rgb(46, 50, 54);
  }
  img {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  .copyright {
    font-size: 0.8rem;
    color: rgb(92, 104, 115);
  }

  .container {
    color: rgb(46, 50, 54);
    margin-top: 1rem;
  }

  .GeneratedTable {
    color: rgb(46, 50, 54);
  }

  .description{
    font-size: 0.9rem;
    text-align: center;
  }

  table.GeneratedTable {
  width: 60%;
  background-color: transparent;
  border-collapse: collapse;
  border-width: 0em;
  border-color: transparent;
  border-style: solid;
  color: #4b4444;
}

table.GeneratedTable td {
  border-width: 0em;
  border-style: solid;
  padding: 0em;
}
table.GeneratedTable tr {
  background-color: transparent;
}

</style>

<div class="container" width="50%" >
  <img width="80em" src="static/images/itracker.svg" alt="iPOC" />
  <h3 style="text-align: center;">{appName}</h3>
  <p class="description">
    {appDescription}
  </p>

  <br />
  <div align="center" width="80%">
    <table class="GeneratedTable">
      <tbody>
        <tr>
          <td>Product version:</td>
          <td>{version}</td>
        </tr>
        <tr>
          <td>Build Number:</td>
          <td>{build}</td>
        </tr>
        <tr>
          <td>Build Date:</td>
          <td>{buildDate}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <br />
  <br />
  <br />
  <p class="copyright" style="text-align: center;">
    Coyright 2022 iNDX.Ai. 20380 Town Center Lane #218, Cupertino, CA 95014. All
    rights reserved. Email: support@indxtechnology.com
  </p>
</div>
