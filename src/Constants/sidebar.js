export const SIDE_BAR_NAV = [
  
  {
    id: 1,
    title: 'Patient',
    icon: 'download',
    key: 'patient_view',
    isExpanded:false,
    children: [
      {
        id: 2,
        name: 'List',
        displayName: "List",
        key: 'patient_list',
        isEnabled: true,
        isExpanded: false,
        parent:"patient_view",
        link: 'patient/list',
      },
      {
        id: 3,
        name: 'Vega Report',
        displayName: "Vega Report",
        key: 'vega_report',
        isEnabled: true,
        isExpanded: false,
        parent:"patient_view",
        link: '/icare/vegatest',
      }
    ],
  },{
    id: 1,
    title: 'Orders',
    icon: 'download',
    key: 'order_view',
    isExpanded:false,
    children: [
      {
        id: 2,
        name: 'List',
        displayName: "List",
        key: 'order_list',
        isEnabled: true,
        isExpanded: false,
        parent:"order_view",
        link: 'order/list',
      },
      // {
      //   id: 2,
      //   name: 'Order Test',
      //   displayName: "Order Test",
      //   key: 'Order_Test',
      //   isEnabled: true,
      //   isExpanded: false,
      //   parent:"order_view",
      //   link: 'order/test/create',
      // },
      // {
      //   id: 2,
      //   name: 'Sample Collection',
      //   displayName: "Sample Collection",
      //   key: 'Order Test',
      //   isEnabled: true,
      //   isExpanded: false,
      //   link: '/order/sample/create',
      // }
      // {
      //   id: 2,
      //   name: 'Order Accession Test',
      //   displayName: "Accession",
      //   key: 'Accession',
      //   isEnabled: true,
      //   isExpanded: false,
      //   parent:"order_view",
      //   link: 'order/accession/create',
      // }
    ],
  },
  {
    id: 1,
    title: 'Barcode',
    icon: 'download',
    key: 'barcode',
    isExpanded:false,
    children: [
      {
        id: 2,
        name: 'Generate Barcode',
        displayName: "Generate Barcode",
        key: 'Generate_Barcode',
        isEnabled: true,
        parent:'barcode',
        isExpanded: false,
        link: 'barcode/generate',
      }
    ],
  },
  {
    id: 1,
    title: 'Worklist',
    icon: 'worklist',
    key: 'worklist_view',
    isExpanded:false,
    link: '/icare/'
  }
]