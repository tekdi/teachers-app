export const schema = {
  title: 'A registration form',
  description: 'A simple form example',
  type: 'object',
  required: ['firstName', 'lastName', 'age', 'skills'],
  properties: {
    firstName: {
      type: 'string',
      title: 'First Name',
      default: '',
      errorMessage:
        'First name is required and should be less than 50 characters',
    },
    lastName: { type: 'string', title: 'Last Name', default: '' },
    age: { type: 'number', title: 'Age', default: 0 },
    gender: {
      type: 'string',
      title: 'Gender',
      enum: ['Male', 'Female'],
      default: 'Male',
    },
    country: {
      type: 'string',
      title: 'Country',
      enum: ['USA', 'Canada', 'UK'],
      default: 'USA',
    },
    acceptTerms: { type: 'boolean', title: 'Accept Terms', default: false },
    skills: {
      type: 'array',
      title: 'Skills',
      items: {
        type: 'string',
        enum: ['JavaScript', 'React', 'Node.js', 'Python', 'Java'],
      },
      uniqueItems: true,
    },
    experience: {
      type: 'string',
      title: 'Experience',
      enum: ['Less than 1 year', '1-2 years', 'More than 2 years'],
    },
    details: {
      type: 'string',
      title: 'Details',
    },
  },
  dependencies: {
    experience: {
      oneOf: [
        {
          properties: {
            experience: { enum: ['Less than 1 year'] },
            details: {
              type: 'string',
              title: 'Details about your learning path',
            },
          },
        },
        {
          properties: {
            experience: { enum: ['1-2 years'] },
            details: { type: 'string', title: 'Details about your projects' },
          },
        },
        {
          properties: {
            experience: { enum: ['More than 2 years'] },
            details: {
              type: 'string',
              title: 'Details about your professional experience',
            },
          },
        },
      ],
    },
  },
};

export const uiSchema = {
  acceptTerms: {
    'ui:widget': 'CustomCheckboxWidget',
    'ui:options': {
      label: 'I accept the terms and conditions',
    },
  },
  gender: {
    'ui:widget': 'CustomRadioWidget',
  },
  country: {
    'ui:widget': 'select',
  },
  skills: {
    'ui:widget': 'MultiSelectCheckboxes',
  },
};

const formReadResponse = {
  formName: 'facilitator-create',
  formId: 'UUID', //optional
  endpoint: '/user/v1/add-facilitator',
  schema: [
    {
      label: 'FIRST_NAME',
      name: 'first_name',
      type: 'text',
      isRequired: true,
      isEditable: true,
      isPIIField: false,
      placeholder: 'ENTER_FIRST_NAME',
      validation: ['string'],
    },
    {
      label: 'EMAIL',
      name: 'email',
      type: 'text',
      isRequired: true,
      isEditable: true,
      isPIIField: false,
      isMultiSelect: false, //optional
      maxSelections: 3, //optional
      placeholder: 'ENTER_EMAIL',
      hint: 'IT_SHOULD_BE_GMAIL', //optional
      validation: ['email'],
      pattern: ['regex'],
    },
    {
      label: 'PASSWORD',
      name: 'password',
      type: 'text',
      isRequired: true,
      isEditable: true,
      isPIIField: false,
      placeholder: 'ENTER_STRONG_PASSWORD',
      hint: 'IT_SHOULD_BE_7_CHARACTER_LONG', //optional
      validation: ['password'],
    },
    {
      label: 'GENDER',
      name: 'gender',
      type: 'radio',
      isRequired: true,
      isEditable: true,
      isPIIField: true,
    },
    {
      label: 'ADDRESS',
      name: 'Address',
      type: 'textArea',
      isRequired: true,
      isEditable: true,
      isPIIField: false,
      placeholder: 'ENTER_ADDRESS',
      maxLength: 25,
      minLength: 5,
      validation: ['string'],
    },
    {
      label: 'CONTACT_NUMBER',
      name: 'Contact Number',
      type: 'text',
      isRequired: true,
      isEditable: true,
      isPIIField: false,
      placeholder: 'ENTER_CONTACT_NUMBER',
      maxLength: 10,
      validation: ['numeric'],
    },
    {
      label: 'SUBJECT',
      name: 'subject',
      type: 'select',
      isRequired: true,
      isEditable: true,
      isPIIField: false,
      isMultiSelect: true, //optional
      //   maxSelections: 3, //optional
      placeholder: 'SELECT_SUBJECTS',
      hint: 'SELECT_TEACHING_SUBJECTS', //optional
      fieldId: '2323', // optional
      options: [
        {
          label: 'ENGLISH',
          value: 'english',
        },
        {
          label: 'MATHS',
          value: 'mathematics',
        },
      ],
    },
    {
      label: 'CENTER',
      name: 'center',
      type: 'checkbox',
      isRequired: true,
      isEditable: true,
      isPIIField: false,
      isMultiSelect: true, //optional
      maxSelections: 2, //optional
      placeholder: 'SELECT_CENTERS',
      hint: 'SELECT_TEACHING_CENTERS', //optional
      fieldId: '2323', // optional
      options: [
        {
          label: 'Kamptee',
          value: 'kamptee',
        },
        {
          label: 'Khapri Dharmu',
          value: 'Khapri Dharmu',
        },
      ],
    },
  ],
};
