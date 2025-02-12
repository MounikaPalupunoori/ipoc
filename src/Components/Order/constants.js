import { faEdit,faHandHoldingMedical, faFileMedicalAlt } from '@fortawesome/free-solid-svg-icons';
export const ORDER_GRID_CONSTANTS = {
  buttons: [
    {
      key: 'editTest',//event name 
      title: 'Edit Test',
      style: { color: '#007bff' },
      icon: faEdit,
      showCondition: { key: 'status', values: ["Ordered"] },
    },
    {
      key: 'accession',//event name
      title: 'Accession',
      style: { color: '#007bff' },
      icon: faHandHoldingMedical,
      showCondition: { key: 'status', values: ["Ordered", "Accessioned","Closed"] },
    },
    {
      key: 'viewReport',//event name
      title: 'View Report',
      style: { color: '#007bff' },
      icon: faFileMedicalAlt,
      showCondition: { key: 'reportid', values: ["notNull"] },
    },
    {
      key: 'launchActiveReport',//event name
      title: 'View Report',
      style: { color: '#007bff' },
      icon: faFileMedicalAlt,
      showCondition: { key: 'status', values: ["Closed"] },
    }
  ],
  columnConfig:  {
    accessionNumber: "accessionNumber",
    first_name: "first_name",
    date_of_birth: "date_of_birth",
    gender: "gender",
    status: "status",
    physician_name: "physician_name",
    collection_date: "collection_date",
    disease_name: "disease_name",
    button: "button"
  },
  columnAlias: {
    accessionNumber: "Order No.",
    first_name: "Patient Name",
    date_of_birth: "DOB(DD/MM/YYYY)",
    gender: "Gender",
    status: "Order Status",
    physician_name: "Requesting Physician",
    collection_date: "Collection Date",
    disease_name: "Disease Type",
    button: "Actions"
  }
}