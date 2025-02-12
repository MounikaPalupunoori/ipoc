
import { v4 as uuidv4 } from 'uuid';
export const strToClassName = (str) => {
  if (typeof str === 'string' && str) {
    return str?.replace(/[^A-Z0-9]/gi, '_').toLowerCase();
  }
  return str;
};
export const printPage = () => {
  document.body.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.keyCode === 80) {
      window.print();
      event.preventDefault();
    }
  });
};

export const pathToObject = function (resultReference, path, sep) {
  // split path on dots
  // e.g. data.location.degree.text=sometexthere
  // -> ["data", "location", "degree", "text=sometexthere"]
  var splitPathParts = path.split(sep);

  // if there is only one part, we're at the end of our path expression
  // e.g. ["text=sometexthere"]
  if (splitPathParts.length === 1) {
    // split "text=sometexthere" into ["text", "sometexthere"]
    var keyAndValue = splitPathParts[0].split('=');

    // set foo = bar on our result object reference
    resultReference[keyAndValue.shift()] = keyAndValue.join('=');
    return;
  }

  // the first element of the split array is our current key
  // e.g. for ["data", "location", "degree", "text=sometexthere"],
  // the currentKey would be "data";
  var currentKey = splitPathParts.shift();

  // if our object does not yet contain the current key, set it to an empty object
  resultReference[currentKey] || (resultReference[currentKey] = {});

  // recursively call ourselves, passing in
  // the nested scope and the rest of the path.
  // e.g. { data : {} } and 'location.degree.text=sometexthere'
  pathToObject(resultReference[currentKey], splitPathParts.join(sep));
};
export const triggerEvnt = (ID) => {
  document.getElementById(ID).click();
};

export const getExtFromStr = (str) => {
  let re = /(?:\.([^.]+))?$/;
  return re.exec(str)[1];
};
export const humanFileSize = (bytes, si = false, dp = 1) => {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + ' ' + units[u];
};
export const getFileName = (filename, fileNameLimit) => {
  if (filename.length > fileNameLimit) {
    filename = filename.substring(0, fileNameLimit) + '...';
  }
  return filename;
};

export const getDownloadFileName = (name = null) => {
  //downloadType can be single/multiple
  let fileName = '';
  if (name !== null) {
    fileName =
      name.lastIndexOf('.') !== -1
        ? name.substring(0, name.lastIndexOf('.'))
        : name;
    fileName = fileName + '.zip';
  } else {
    const date = new Date();
    let dt = date.getDate();
    let mon = date.getMonth() + 1;
    let yr = date.getFullYear();
    let hrs = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    fileName = `icore-download-${dt}${mon}${yr}-${hrs}${min}${sec}.zip`;
  }
  return fileName;
};

export function generateUniqueId(type) {
  let max = 100;
  if (type == 'time') {
    return Date.now();
  } else if (type == 'uuid') {
    return uuidv4();
  } else {
    return Math.floor(Math.random() * Math.floor(max));
  }
}

export const updateProgress = (fileNumber, percent) => {
  let uploadProgress = [];
  uploadProgress[fileNumber] = percent;
  let total =
    uploadProgress.reduce((tot, curr) => tot + curr, 0) / uploadProgress.length;
  return total;
};

export const getDateFromDateTime = (dateTimeString) => {
  return `${dateTimeString}`.split('T').slice(0, 1); // just to get the date and not time from GMT
};

export const arrayToObj = (arr) =>{
  return arr.reduce((a, d) => {
    a[d] = d;
    return a;
  }, {});
}
export const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
}
/**
 * @name isRequired
 * @description helper function for alphabeticalSort
 */
const isRequired = () => {
  throw Error('Argument key is required!');
};
/**
 * @name alphabeticalSort
 * @param {*} arr 
 * @param {*} key 
 * @description when using array of object, pass key, for normal arrays pass key as null
 * @returns sorted array in alphabetical order.
 */
export const alphabeticalSort = (arr, key=isRequired()) => {
  let sortedArray = arr;
  console.log("inside sort", arr);
  if(key !== null) {
    sortedArray = arr.sort((a, b) => a[key].localeCompare(b[key]))
  } else if(key === null) {
    sortedArray = arr.sort((a, b) => a.localeCompare(b));
  }
  return sortedArray;
}

export const getTitleCaseString = (str = null) => {
  if (str) {
    return str.replace(/([A-Z])/g, " $1");
  } else {
    return null;
  }
}

export const scrollToDom = (dom) =>{
  let selectedDOM = document.querySelector(dom);
  if(selectedDOM){
    selectedDOM.scrollIntoView(true);
  }
}

export const getDate = (dateString, sep="/", formatDate="dd-mm-yyyy") => {
  try {
    const date = dateString.split("-");
    let dd = date[1]
    let mm = date[0];
    let yyyy = date[2];
    if(date[0]?.length > 2) {
      yyyy = date[0];
      dd=date[2];
      mm=date[1];
    }
    let finalDate = `${dd}${sep}${mm}${sep}${yyyy}`;
    if(formatDate == "yyyy-mm-dd") {
      finalDate = `${yyyy}${sep}${mm}${sep}${dd}`;
    }
    if(formatDate == "mm-dd-yyyy") {
      finalDate = `${mm}${sep}${dd}${sep}${yyyy}`;
    }
    return finalDate;
  } catch(e){
    return dateString;
  }
}

export const getISTDateTime = (dateString) => {
  try {
    const dateObj = new Date(dateString);
    let finalDate = '';
    if (dateString) {
      if (dateObj && dateObj.getDate()) {
        let month = dateObj.toLocaleString('default', { month: 'short' });
        let date = `${dateObj.getDate()} ${month} ${dateObj.getFullYear()}`;
        let time = `${('0' + dateObj.getHours()).slice(-2)}:${('0' + dateObj.getMinutes()).slice(-2)}`;
        finalDate = `${date} ${time}`;
      }else{
        finalDate = dateString.replace(/-/g, "/");
      }
    } else {
      finalDate = ''
    }
    return finalDate;    
  } catch (error) {
    return getDate(dateString);
  }
}

export const checkUrlExist = (url) =>{
  let getUrl = window.location.pathname;
  let ifUrlExist = getUrl.includes(url);
  return ifUrlExist
}