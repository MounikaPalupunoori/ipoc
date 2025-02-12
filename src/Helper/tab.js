import ChartWrapper from '@Components/ChartWrapper';
export const createTabComponentProp = (data, selectedCardInfo) => {
  return data.tabs.map((res) => {
    return {
      label: res.tabName,
      value: res.tabId,
      component: ChartWrapper,
      props: {
        dashboard: res,
        tabList: data.tabs,
        selectedCardInfo: selectedCardInfo
      },
    };
  });
};