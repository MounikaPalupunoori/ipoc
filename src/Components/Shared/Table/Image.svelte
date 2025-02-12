<script>
  export let src = '';
  const handleImage = (src) => {
    return src ? src : '/static/images/no_preview.png';
  };
</script>

<style>
  img {
    height: 50px;
    width: 50px;
  }
</style>

<img
  src={handleImage(src)}
  alt=""
  class="img-fluid"
  onerror="this.src='/static/images/no_preview.png';" />
