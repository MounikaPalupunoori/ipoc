import { faEdit } from '@fortawesome/free-solid-svg-icons';
export const PATIENT_GRID_CONSTANTS = {
  buttons: [
    {
      key: 'editPatient',//event name 
      title: 'Edit Patient',
      style: { color: '#007bff' },
      icon: faEdit,
      showCondition: { key: 'all', values: [] },
    },
  ],
  columnConfig:  {
    first_name: "first_name",
    date_of_birth: "date_of_birth",
    gender: "gender",
    email_id: "email_id",
    marital_status: "marital_status",
    city: "city",
    phone: "phone",
    button: "button"
  },
  columnAlias: {
    first_name: "Name",
    date_of_birth: "DOB(DD/MM/YYYY)",
    gender: "Gender",
    email_id: "Email",
    marital_status: "Marital Status",
    city: "City",
    phone: "Phone",
    button: "Actions",
  }
}