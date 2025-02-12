export const saveCSV = (data, fileName) => {
  let headers = Object.keys(data[0]).filter((ele) => {
    return ele !== 'color';
  });
  let rows = [];
  rows.push(headers.join(','));
  data.forEach((ele) => {
    let row = [];
    headers.forEach((key) => {
      if (ele[key] === null) {
        row.push('null');
      } else {
        row.push(ele[key]);
      }
    });
    rows.push(row.join(','));
  });
  let csvContent = rows.join(',\r\n');
  var file = new Blob([csvContent], { type: 'text/plain' });
  var btn = document.createElement('a');
  btn.setAttribute('href', URL.createObjectURL(file));
  btn.setAttribute('download', `${fileName}.csv`);
  document.body.appendChild(btn);
  btn.click();
  document.body.removeChild(btn);
};
export const saveSvg = (containerId, name) => {
  // get the svg from the children of the containerID
  var svgEl = document
    .getElementById(`${containerId}`)
    .getElementsByClassName('layercake-layout-svg')[0];
  svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  var svgData = svgEl.outerHTML;
  var preface = '<?xml version="1.0" standalone="no"?>\r\n';
  var svgBlob = new Blob([preface, svgData], {
    type: 'image/svg+xml;charset=utf-8',
  });
  var svgUrl = URL.createObjectURL(svgBlob);
  var downloadLink = document.createElement('a');
  downloadLink.href = svgUrl;
  downloadLink.download = name;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

export const viewFile = (fileName ="Report", url, ) => {
  try {
    fetch(url, {
      method: 'GET',
      responseType: 'blob',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then((response) => {
        let headerDetail = response.headers.get('Content-Disposition');
        let index = headerDetail?.indexOf('filename');
        let substring = headerDetail?.substr(index, headerDetail.length - 1);
        let newFileName = substring?.replace(/['"]+/g, '')?.split('=')[1];
        if (newFileName) {
          fileName = newFileName;
        }
        return response.blob();
      })
      .then((blob) => {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.title = 'view report';
        a.click();
        return true;
      });
  } catch (e) {
    console.log(e);
  }

}