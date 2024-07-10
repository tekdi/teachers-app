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

export const apiResponse = {
  result: [
    {
      label: 'Age',
      name: 'age',
      type: 'numeric',
      isEditable: true,
      isPIIField: null,
      placeholder: '',
      validation: [],
      options: [],
      isMultiSelect: false,
      maxSelections: null,
      hint: null,
      pattern: null,
      maxLength: null,
      minLength: null,
      fieldId: '57b50148-2b58-45e5-9b27-6a07c5317c18',
      dependsOn: false,
    },
    {
      label: 'Unit Name',
      name: 'unit_name',
      type: 'text',
      isEditable: false,
      isPIIField: null,
      placeholder: '',
      validation: [],
      options: [],
      isMultiSelect: false,
      maxSelections: null,
      hint: null,
      pattern: null,
      maxLength: null,
      minLength: null,
      fieldId: '2f7c44e8-5890-4f09-a759-da08b1fda38c',
      dependsOn: false,
    },
    {
      label: 'Number of Clusters I Teach',
      name: 'no_of_clusters',
      type: 'numeric',
      isEditable: true,
      isPIIField: null,
      placeholder: '',
      validation: [],
      options: [],
      isMultiSelect: false,
      maxSelections: null,
      hint: null,
      pattern: null,
      maxLength: null,
      minLength: null,
      fieldId: 'f5249ac0-931a-4136-8c82-8767263a5460',
      dependsOn: false,
    },
    {
      label: 'Year of joining SCP',
      name: 'year_of_joining_scp',
      type: 'numeric',
      isEditable: true,
      isPIIField: null,
      placeholder: '',
      validation: [],
      options: [],
      isMultiSelect: false,
      maxSelections: null,
      hint: null,
      pattern: null,
      maxLength: null,
      minLength: null,
      fieldId: 'f9fb37a4-d5d0-4f71-9ff6-cfd7d54a1611',
      dependsOn: false,
    },
    {
      label: 'State',
      name: 'state',
      type: 'drop_down',
      isEditable: true,
      isPIIField: null,
      placeholder: '',
      validation: [],
      options: [],
      isMultiSelect: true,
      maxSelections: 1,
      hint: null,
      pattern: null,
      maxLength: null,
      minLength: null,
      fieldId: 'b61edfc6-3787-4079-86d3-37262bf23a9e',
      dependsOn: false,
    },
    {
      label: 'My Main Subjects',
      name: 'main_subject',
      type: 'checkbox',
      isEditable: true,
      isPIIField: null,
      placeholder: '',
      validation: [],
      options: [
        {
          label: 'English',
          value: 'english',
        },
        {
          label: 'Home Science',
          value: 'home_science',
        },
        {
          label: 'Math',
          value: 'math',
        },
        {
          label: 'Language',
          value: 'language',
        },
        {
          label: 'Science',
          value: 'science',
        },
        {
          label: 'Social Science',
          value: 'social_science',
        },
        {
          label: 'Life Skills',
          value: 'life_skills',
        },
      ],
      isMultiSelect: true,
      maxSelections: 7,
      hint: null,
      pattern: null,
      maxLength: null,
      minLength: null,
      fieldId: '935bfb34-9be7-4676-b9cc-cec1ec4c0a2c',
      dependsOn: false,
    },
    {
      label: 'Designation',
      name: 'designation',
      type: 'radio',
      isEditable: true,
      isPIIField: null,
      placeholder: '',
      validation: [],
      options: [
        {
          label: 'Facilitator',
          value: 'facilitator',
        },
        {
          label: 'Team Leader',
          value: 'team_leader',
        },
      ],
      isMultiSelect: false,
      maxSelections: null,
      hint: null,
      pattern: null,
      maxLength: null,
      minLength: null,
      fieldId: 'cb407d11-f1c5-424c-a422-4755a1c4ab29',
      dependsOn: false,
    },
    {
      label: 'Gender',
      name: 'gender',
      type: 'radio',
      isEditable: true,
      isPIIField: null,
      placeholder: '',
      validation: [],
      options: [
        {
          label: 'Male',
          value: 'male',
        },
        {
          label: 'Female',
          value: 'female',
        },
      ],
      isMultiSelect: false,
      maxSelections: null,
      hint: null,
      pattern: null,
      maxLength: null,
      minLength: null,
      fieldId: 'a71fd390-fd67-45c3-ab1e-6994b8d967a2',
      dependsOn: false,
    },
    {
      label: 'District',
      name: 'district',
      type: 'drop_down',
      isEditable: true,
      isPIIField: null,
      placeholder: '',
      validation: [],
      options: [
        {
          label: 'English',
          value: 'english',
        },
        {
          label: 'Home Science',
          value: 'home_science',
        },
        {
          label: 'Math',
          value: 'math',
        },
      ],
      isMultiSelect: true,
      maxSelections: 1,
      hint: null,
      pattern: null,
      maxLength: null,
      minLength: null,
      fieldId: 'f2d731dd-2298-40d3-80bb-9ae6c5b38fb8',
      dependsOn: true,
    },
    {
      label: 'Block',
      name: 'block',
      type: 'drop_down',
      isEditable: true,
      isPIIField: null,
      placeholder: '',
      validation: [],
      options: [],
      isMultiSelect: true,
      maxSelections: 1,
      hint: null,
      pattern: null,
      maxLength: null,
      minLength: null,
      fieldId: '549d3575-bf01-48a9-9fff-59220fede174',
      dependsOn: true,
    },
    {
      label: 'Subjects I Teach',
      name: 'subject_taught',
      type: 'checkbox',
      isEditable: true,
      isPIIField: null,
      placeholder: '',
      validation: [],
      options: [
        {
          label: 'English',
          value: 'english',
        },
        {
          label: 'Home Science',
          value: 'home_science',
        },
        {
          label: 'Math',
          value: 'math',
        },
        {
          label: 'Language',
          value: 'language',
        },
        {
          label: 'Science',
          value: 'science',
        },
        {
          label: 'Social Science',
          value: 'social_science',
        },
        {
          label: 'Life Skills',
          value: '_lifeskills',
        },
      ],
      isMultiSelect: true,
      maxSelections: 7,
      hint: null,
      pattern: null,
      maxLength: null,
      minLength: null,
      fieldId: 'abb7f3fe-f7fa-47be-9d28-5747dd3159f2',
      dependsOn: false,
    },
  ],
};
