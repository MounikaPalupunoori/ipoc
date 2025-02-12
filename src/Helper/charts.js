import { quantile } from 'd3-array';
export const getFilterObj = (filters) => {
  if (!filters || filters?.length === 0) return {}
  return filters.reduce((acc, data) => {
    const { value } = data
    acc[value] = value
    return acc
  }, {})
}

export const getFirstDigit = (num) => {
  while (num > 9) {
    num = Math.floor(num / 10);
  }
  return parseInt(num);
}

export const getTicks = (domain) => {
  let ticks = [];
  let numOfTicks = 6;// in future need to increase as chart size increase.
  let firstDigit = getFirstDigit(domain);
  let upperRange = (firstDigit + 1) * (Math.pow(10, (domain.toString().length - 1)));
  for (let i = 0; i < numOfTicks; i++) {
    let tick = upperRange / 5 * i
    ticks.push(Math.round(tick));
  }
  return ticks;
}
/**
 * @name getSortedArray
 * @param {Array} array unsorted array.
 * @returns sorted array in ascending order.
 * @example = let sortedArray = getSortedArray(Array);
 */
export const getSortedArray = (array) => {
  return array.sort(function (a, b) {
    return a - b;
  });
}
/**
 * @name getDataForHistogram
 * @param {Array} data
 * @param {string} value
 * @returns array of all values present in raw data.
 * @example let histogramData = getDataForHistogram(data, key);
 */

export const getDataForHistogram = (data, key) => {
  let middleRecord = data[parseInt(data.length / 2)];
  let interval = middleRecord.end - middleRecord.start;
  return data.map((ele, i) => {
    let x0 = ele.start, x1 = ele.end, label = ele.label;
    if (ele.label === "NA") {
      x0 = data[i - 1].start + (interval);
      x1 = x0 + interval;
      label = "NA" + "_" + x0;
    } else {
      if (ele.start === null) {
        x0 = ele.end - interval
      }
      if (ele.end === null) {
        x1 = ele.start + interval
      }
    }
    return {
      x0: x0,
      x1: x1,
      y: ele.count,
      label: label
    }
  })
}

/**
 * @name getRawDataForBoxPlot
 * @param {Array} data - takes in the raw data passed down from the config.
 * @returns returns and array of object that contains key and values(q1, q3, median, min, max) required
 * plot box Plot chart.
 * @description this methods take th raw data from the config and processes and return an array of objects
 *  with values formatted to draw box plot chart.
 * @example let RawDataForBoxPlot = getRawDataForBoxPlot(data, xKey, yKey);
 */
export const getRawDataForBoxPlot = (data, xKey, yKey) => {
  let boxPlotDataObj = {};
  data.forEach((ele) => {
    if (!boxPlotDataObj[ele[xKey]]) {
      boxPlotDataObj[ele[xKey]] = { [xKey]: ele[xKey], [yKey]: [ele[yKey]] };
    } else {
      boxPlotDataObj[ele[xKey]][yKey].push(ele[yKey]);
    }
  });
  return Object.values(boxPlotDataObj);
};

/**
   * @name getDataForBoxPlot
   * @param {Array} data - takes in the raw data passed down from the config.
   * @returns returns and array of object that contains key and values(q1, q3, median, min, max) required
   * plot box Plot chart.
   * @description this methods take th raw data from the config and processes and return an array of objects
   *  with values formatted to draw box plot chart.
   * @example let boxPlotData = getDataForBoxPlot(rawData);
   */
export const getDataForBoxPlot = (rawData, xKey, yKey) => {
  return rawData.map((ele) => {
    let sorted = getSortedArray(ele.value);
    let obj = {
      q1: quantile(sorted, 0.25),
      q3: quantile(sorted, 0.75),
      interQuatileRange: quantile(sorted, 0.75) - quantile(sorted, 0.25),
      median: quantile(sorted, 0.5),
      min: sorted[0],
      max: sorted[sorted.length - 1],
      sortedValues: sorted,
    };
    return { [xKey]: ele[xKey], [yKey]: obj };
  });
};

export const setExpanded = (navDataList,selectedLink) =>{
    navDataList.forEach((item, i) => {
    if (
      item?.key?.toLowerCase() === selectedLink?.parent?.toLowerCase() ||
      item?.key.includes(selectedLink?.link) 
    ) {
      navDataList[i]['isExpanded'] = true;
    } else {
      navDataList[i]['isExpanded'] = false;
    }
  });
  return navDataList
}