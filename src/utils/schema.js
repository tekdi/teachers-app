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
  "formid": "a1af6b98-73d4-439f-8537-6f3a901ad462",
  "title": "CREATE LEARNER",
  "fields": [
      {
          "hint": null,
          "name": "name",
          "type": "text",
          "label": "FULL_NAME",
          "order": "0",  // change it to number
          "fieldId": "null",
          "options": [],
          "coreField": 1,
          "dependsOn": null,
          "maxLength": null, // need to add
          "minLength": null, 
          "isEditable": true,
          "isPIIField": null,
          "validation": [
              "string"
          ],
          "placeholder": "ENTER_FULL_NAME",
          "isMultiSelect": true, //false
          "maxSelections": 1, //0
          "sourceDetails": {},
          "required": true,
          "pattern": "/[a-zA-Z]+/"
      },
      {
          "hint": null,
          "name": "mobile",
          "type": "text", // text
          "label": "CONTACT_NUMBER",
          "order": "1",
          "fieldId": "null",
          "options": [],
          "coreField": 1,
          "dependsOn": null,
          "maxLength": 10,
          "minLength": 10,
          "isEditable": true,
          "isPIIField": true,
          "validation": [
              "numeric"
          ],
          "placeholder": "ENTER_CONTACT_NUMBER",
          "isMultiSelect": false,
          "maxSelections": 0,
          "sourceDetails": {},
          "pattern": "^\\d*$/"
      },
      // {
      //     "label": "How Was the Learner Mobilised?", //HOW_WAS_LEARNER_MOBILISED
      //     "name": "mobilisation_method",
      //     "type": "drop_down",
      //     "coreField": 0,
      //     "isEditable": true,
      //     "isPIIField": null,
      //     "placeholder": "",
      //     "validation": [],
      //     "options": [
      //         {
      //             "label": "Second Chance Alumni", //SECOND_CHANCE_ALUMNI
      //             "value": "second_chance_alumni"
      //         },
      //         {
      //             "label": "Pratham Team Member", //PRATHAM_TEAM_MEMBER
      //             "value": "pratham_team_member"
      //         },
      //         {
      //             "label": "Other",//OTHER
      //             "value": "other"
      //         }
      //     ],
      //     "isMultiSelect": true, // false
      //     "maxSelections": 1,
      //     "hint": null,
      //     "pattern": null,
      //     "maxLength": null,
      //     "minLength": null,
      //     "fieldId": "7adad9b7-0cf2-4a48-bc60-56a80dc02107",
      //     "dependsOn": false,
      //     "order": "2"
      // },
      // {
      //     "label": "Age", //AGE
      //     "name": "age",
      //     "type": "numeric", //TEXT
      //     "coreField": 0,
      //     "isEditable": true,
      //     "isPIIField": null,
      //     "placeholder": "",
      //     "validation": [], //NUMERIC
      //     "options": [],
      //     "isMultiSelect": false,
      //     "maxSelections": null,
      //     "hint": null,
      //     "pattern": null,
      //     "maxLength": null,
      //     "minLength": null,
      //     "fieldId": "2f07caa6-61b8-4a6a-92f4-94b5596a4864",
      //     "dependsOn": false,
      //     "order": "3"
      // },
      // {
      //     "label": "Gender", //GENDER
      //     "name": "gender",
      //     "type": "radio",
      //     "coreField": 0,
      //     "isEditable": true,
      //     "isPIIField": null,
      //     "placeholder": "",
      //     "validation": [],
      //     "options": [
      //         {
      //             "label": "Male", //MALE
      //             "value": "male"
      //         },
      //         {
      //             "label": "Female", //FEMALE
      //             "value": "female"
      //         }
      //     ],
      //     "isMultiSelect": false,
      //     "maxSelections": null,
      //     "hint": null,
      //     "pattern": null,
      //     "maxLength": null,
      //     "minLength": null,
      //     "fieldId": "c81e50d4-87a2-4dc1-9de6-85591c581f5c",
      //     "dependsOn": false,
      //     "order": "4"
      // },
      // {
      //     "label": "Learner's Primary Work", //LEARNERS_PRIMARY_WORK
      //     "name": "primary_work",
      //     "type": "drop_down",
      //     "coreField": 0,
      //     "isEditable": true,
      //     "isPIIField": null,
      //     "placeholder": "",
      //     "validation": [],
      //     "options": [
      //         {
      //             "label": "Enrolled in educational institute", //ENROLLED_IN_EDUCATIONAL_INSTITUTE
      //             "value": "enrolled_in_educational_institute"
      //         },
      //         {
      //             "label": "Own farming", //OWN_FARMING
      //             "value": "own_farming"
      //         },
      //         {
      //             "label": "Agricultural farm laborer", //AGRICULTURAL_FARM_LABORER
      //             "value": "agricultural_farm_laborer"
      //         },
      //         {
      //             "label": "Non-agricultural laborer", //NON_AGRICULTURAL_LABORER
      //             "value": "non_agricultural_laborer"
      //         },
      //         {
      //             "label": "Salaried work", //SALARIED_WORK
      //             "value": "salaried_work"
      //         },
      //         {
      //             "label": "Self-employment", //SELF_EMPLOYMENT
      //             "value": "self_employment"
      //         },
      //         {
      //             "label": "Unemployed", //UNEMPLOYED
      //             "value": "unemployed"
      //         },
      //         {
      //             "label": "Involved in domestic work", //INVOLVED_IN_DOMESTIC_WORK
      //             "value": "involved_in_domestic_work"
      //         }
      //     ],
      //     "isMultiSelect": true, //false
      //     "maxSelections": 1,
      //     "hint": null,
      //     "pattern": null,
      //     "maxLength": null,
      //     "minLength": null,
      //     "fieldId": "2914814c-2a0f-4422-aff8-6bd3b09d3069",
      //     "dependsOn": false,
      //     "order": "5"
      // },
      // {
      //     "label": "Father’s Name", //FATHER_NAME
      //     "name": "father_name",
      //     "type": "text",
      //     "coreField": 0,
      //     "isEditable": true,
      //     "isPIIField": null,
      //     "placeholder": "", //ENTER_YOUR_FATHER_NAME
      //     "validation": [], //string
      //     "options": [],
      //     "isMultiSelect": false,
      //     "maxSelections": null,
      //     "hint": null,
      //     "pattern": null,
      //     "maxLength": null,
      //     "minLength": null,
      //     "fieldId": "f3fac0c3-bc8b-4260-8b56-1608fd31c237",
      //     "dependsOn": false,
      //     "order": "6"
      // },
      // {
      //     "label": "Class (Last passed grade)", //CLASS_OR_LAST_PASSED_GRADE
      //     "name": "class",
      //     "type": "drop_down",
      //     "coreField": 0,
      //     "isEditable": true,
      //     "isPIIField": null,
      //     "placeholder": "",
      //     "validation": [
      //         ""
      //     ],
      //     "options": [
      //         {
      //             "label": "0",
      //             "value": "0"
      //         },
      //         {
      //             "label": "1",
      //             "value": "1"
      //         },
      //         {
      //             "label": "2",
      //             "value": "2"
      //         },
      //         {
      //             "label": "3",
      //             "value": "3"
      //         },
      //         {
      //             "label": "4",
      //             "value": "4"
      //         },
      //         {
      //             "label": "5",
      //             "value": "5"
      //         },
      //         {
      //             "label": "6",
      //             "value": "6"
      //         },
      //         {
      //             "label": "7",
      //             "value": "7"
      //         },
      //         {
      //             "label": "8",
      //             "value": "8"
      //         },
      //         {
      //             "label": "9",
      //             "value": "9"
      //         },
      //         {
      //             "label": "No Schooling", //NO_SCHOOLING
      //             "value": "no_schooling"
      //         }
      //     ],
      //     "isMultiSelect": true, //false
      //     "maxSelections": 1,
      //     "hint": null,
      //     "pattern": null,
      //     "maxLength": null,
      //     "minLength": null,
      //     "fieldId": "9a4ad601-023b-467f-bbbe-bda1885f87c7",
      //     "dependsOn": false,
      //     "order": "7"
      // },
      // {
      //     "label": "Reason for Drop Out From School", //REASON_FOR_DROPOUT_FROM_SCHOOL
      //     "name": "drop_out_reason",
      //     "type": "drop_down",
      //     "coreField": 0,
      //     "isEditable": true,
      //     "isPIIField": null,
      //     "placeholder": "",
      //     "validation": [],
      //     "options": [
      //         {
      //             "label": "School inaccessible", //SCHOOL_INACCESSIBLE
      //             "value": "school_inaccessible"
      //         },
      //         {
      //             "label": "Financial Constraints", //FINANCIAL_CONSTRAINTS
      //             "value": "financial_constraints"
      //         },
      //         {
      //             "label": "Lack of Interest", //LACK_OF_INTEREST
      //             "value": "lack_of_interest"
      //         },
      //         {
      //             "label": "Family responsibilities", //FAMILY_RESPONSIBILITIES
      //             "value": "family_responsibilities"
      //         },
      //         {
      //             "label": "Failed", //FAILED
      //             "value": "failed"
      //         },
      //         {
      //             "label": "Illness", //ILLNESS
      //             "value": "illness"
      //         },
      //         {
      //             "label": "Marriage", //MARRIAGE
      //             "value": "marriage"
      //         },
      //         {
      //             "label": "Migration", //MIGRATION
      //             "value": "migration"
      //         },
      //         {
      //             "label": "Started vocational course", //STARTED_VOCATIONAL_COURSE
      //             "value": "started_vocational_course"
      //         },
      //         {
      //             "label": "Started a job", //STARTED_A_JOB
      //             "value": "started_a_job"
      //         },
      //         {
      //             "label": "School closure due to covid",  //SCHOOL_CLOSURE_DUE_TO_COVID
      //             "value": "school_closure_due_to_covid"
      //         }
      //     ],
      //     "isMultiSelect": true, //false
      //     "maxSelections": 1,
      //     "hint": null,
      //     "pattern": null,
      //     "maxLength": null,
      //     "minLength": null,
      //     "fieldId": "4f48571b-88fd-43b9-acb3-91afda7901ac",
      //     "dependsOn": false,
      //     "order": "8"
      // },
      // {
      //     "label": "Marital Status", //MARITAL_STATUS
      //     "name": "marital_status",
      //     "type": "drop_down",
      //     "coreField": 0,
      //     "isEditable": true,
      //     "isPIIField": null,
      //     "placeholder": "",
      //     "validation": [],
      //     "options": [
      //         {
      //             "label": "Unmarried", //UNMARRIED
      //             "value": "unmarried"
      //         },
      //         {
      //             "label": "Married", //MARRIED
      //             "value": "married"
      //         },
      //         {
      //             "label": "Divorced", //DIVORCED
      //             "value": "divorced"
      //         }
      //     ],
      //     "isMultiSelect": true, //false
      //     "maxSelections": 1,
      //     "hint": null,
      //     "pattern": null,
      //     "maxLength": null,
      //     "minLength": null,
      //     "fieldId": "ff472647-6c40-42e6-b200-dc74b241e915",
      //     "dependsOn": false,
      //     "order": "9"
      // },
      // {
      //     "label": "Type of Phone Available", //PHONE_TYPE_AVAILABLE
      //     "name": "phone_type_available",
      //     "type": "drop_down",
      //     "coreField": 0,
      //     "isEditable": true,
      //     "isPIIField": null,
      //     "placeholder": "",
      //     "validation": [],
      //     "options": [
      //         {
      //             "label": "Smartphone", //SMARTPHONE
      //             "value": "smartphone"
      //         },
      //         {
      //             "label": "Keypad", //KEYPAD
      //             "value": "keypad"
      //         },
      //         {
      //             "label": "No Phone", //NO_PHONE
      //             "value": "no_phone"
      //         }
      //     ],
      //     "isMultiSelect": true, //false
      //     "maxSelections": 1,
      //     "hint": null,
      //     "pattern": null,
      //     "maxLength": null,
      //     "minLength": null,
      //     "fieldId": "da594b2e-c645-4a96-af15-6e2d24587c9a",
      //     "dependsOn": false,
      //     "order": "10"
      // },
      // {
      //     "label": "Is it your own phone?", //IS_IT_YOUR_OWN_PHONE
      //     "name": "own_phone_check",
      //     "type": "radio",
      //     "coreField": 0,
      //     "isEditable": true,
      //     "isPIIField": null,
      //     "placeholder": "",
      //     "validation": [],
      //     "options": [
      //         {
      //             "label": "Yes", //YES
      //             "value": "yes"
      //         },
      //         {
      //             "label": "No", //NO
      //             "value": "no"
      //         }
      //     ],
      //     "isMultiSelect": false,
      //     "maxSelections": null,
      //     "hint": null,
      //     "pattern": null,
      //     "maxLength": null,
      //     "minLength": null,
      //     "fieldId": "d119d92f-fab7-4c7d-8370-8b40b5ed23dc",
      //     "dependsOn": false,
      //     "order": "11"
      // }
  ]
}

// export const apiResponse = {
//   result: [
//     {
//       label: 'Age',
//       name: 'age',
//       type: 'numeric',
//       isEditable: true,
//       isPIIField: null,
//       placeholder: '',
//       validation: [],
//       options: [],
//       isMultiSelect: false,
//       maxSelections: null,
//       hint: null,
//       pattern: null,
//       maxLength: null,
//       minLength: null,
//       fieldId: '57b50148-2b58-45e5-9b27-6a07c5317c18',
//       dependsOn: false,
//     },
//     {
//       label: 'Unit Name',
//       name: 'unit_name',
//       type: 'text',
//       isEditable: false,
//       isPIIField: null,
//       placeholder: '',
//       validation: [],
//       options: [],
//       isMultiSelect: false,
//       maxSelections: null,
//       hint: null,
//       pattern: null,
//       maxLength: null,
//       minLength: null,
//       fieldId: '2f7c44e8-5890-4f09-a759-da08b1fda38c',
//       dependsOn: false,
//     },
//     {
//       label: 'Number of Clusters I Teach',
//       name: 'no_of_clusters',
//       type: 'numeric',
//       isEditable: true,
//       isPIIField: null,
//       placeholder: '',
//       validation: [],
//       options: [],
//       isMultiSelect: false,
//       maxSelections: null,
//       hint: null,
//       pattern: null,
//       maxLength: null,
//       minLength: null,
//       fieldId: 'f5249ac0-931a-4136-8c82-8767263a5460',
//       dependsOn: false,
//     },
//     {
//       label: 'Year of joining SCP',
//       name: 'year_of_joining_scp',
//       type: 'numeric',
//       isEditable: true,
//       isPIIField: null,
//       placeholder: '',
//       validation: [],
//       options: [],
//       isMultiSelect: false,
//       maxSelections: null,
//       hint: null,
//       pattern: null,
//       maxLength: null,
//       minLength: null,
//       fieldId: 'f9fb37a4-d5d0-4f71-9ff6-cfd7d54a1611',
//       dependsOn: false,
//     },
//     {
//       label: 'State',
//       name: 'state',
//       type: 'drop_down',
//       isEditable: true,
//       isPIIField: null,
//       placeholder: '',
//       validation: [],
//       options: [],
//       isMultiSelect: true,
//       maxSelections: 1,
//       hint: null,
//       pattern: null,
//       maxLength: null,
//       minLength: null,
//       fieldId: 'b61edfc6-3787-4079-86d3-37262bf23a9e',
//       dependsOn: false,
//     },
//     {
//       label: 'My Main Subjects',
//       name: 'main_subject',
//       type: 'checkbox',
//       isEditable: true,
//       isPIIField: null,
//       placeholder: '',
//       validation: [],
//       options: [
//         {
//           label: 'English',
//           value: 'english',
//         },
//         {
//           label: 'Home Science',
//           value: 'home_science',
//         },
//         {
//           label: 'Math',
//           value: 'math',
//         },
//         {
//           label: 'Language',
//           value: 'language',
//         },
//         {
//           label: 'Science',
//           value: 'science',
//         },
//         {
//           label: 'Social Science',
//           value: 'social_science',
//         },
//         {
//           label: 'Life Skills',
//           value: 'life_skills',
//         },
//       ],
//       isMultiSelect: true,
//       maxSelections: 7,
//       hint: null,
//       pattern: null,
//       maxLength: null,
//       minLength: null,
//       fieldId: '935bfb34-9be7-4676-b9cc-cec1ec4c0a2c',
//       dependsOn: false,
//     },
//     {
//       label: 'Designation',
//       name: 'designation',
//       type: 'radio',
//       isEditable: true,
//       isPIIField: null,
//       placeholder: '',
//       validation: [],
//       options: [
//         {
//           label: 'Facilitator',
//           value: 'facilitator',
//         },
//         {
//           label: 'Team Leader',
//           value: 'team_leader',
//         },
//       ],
//       isMultiSelect: false,
//       maxSelections: null,
//       hint: null,
//       pattern: null,
//       maxLength: null,
//       minLength: null,
//       fieldId: 'cb407d11-f1c5-424c-a422-4755a1c4ab29',
//       dependsOn: false,
//     },
//     {
//       label: 'Gender',
//       name: 'gender',
//       type: 'radio',
//       isEditable: true,
//       isPIIField: null,
//       placeholder: '',
//       validation: [],
//       options: [
//         {
//           label: 'Male',
//           value: 'male',
//         },
//         {
//           label: 'Female',
//           value: 'female',
//         },
//       ],
//       isMultiSelect: false,
//       maxSelections: null,
//       hint: null,
//       pattern: null,
//       maxLength: null,
//       minLength: null,
//       fieldId: 'a71fd390-fd67-45c3-ab1e-6994b8d967a2',
//       dependsOn: false,
//     },
//     {
//       label: 'District',
//       name: 'district',
//       type: 'drop_down',
//       isEditable: true,
//       isPIIField: null,
//       placeholder: '',
//       validation: [],
//       options: [
//         {
//           label: 'English',
//           value: 'english',
//         },
//         {
//           label: 'Home Science',
//           value: 'home_science',
//         },
//         {
//           label: 'Math',
//           value: 'math',
//         },
//       ],
//       isMultiSelect: true,
//       maxSelections: 1,
//       hint: null,
//       pattern: null,
//       maxLength: null,
//       minLength: null,
//       fieldId: 'f2d731dd-2298-40d3-80bb-9ae6c5b38fb8',
//       dependsOn: true,
//     },
//     {
//       label: 'Block',
//       name: 'block',
//       type: 'drop_down',
//       isEditable: true,
//       isPIIField: null,
//       placeholder: '',
//       validation: [],
//       options: [],
//       isMultiSelect: true,
//       maxSelections: 1,
//       hint: null,
//       pattern: null,
//       maxLength: null,
//       minLength: null,
//       fieldId: '549d3575-bf01-48a9-9fff-59220fede174',
//       dependsOn: true,
//     },
//     {
//       label: 'Subjects I Teach',
//       name: 'subject_taught',
//       type: 'checkbox',
//       isEditable: true,
//       isPIIField: null,
//       placeholder: '',
//       validation: [],
//       options: [
//         {
//           label: 'English',
//           value: 'english',
//         },
//         {
//           label: 'Home Science',
//           value: 'home_science',
//         },
//         {
//           label: 'Math',
//           value: 'math',
//         },
//         {
//           label: 'Language',
//           value: 'language',
//         },
//         {
//           label: 'Science',
//           value: 'science',
//         },
//         {
//           label: 'Social Science',
//           value: 'social_science',
//         },
//         {
//           label: 'Life Skills',
//           value: '_lifeskills',
//         },
//       ],
//       isMultiSelect: true,
//       maxSelections: 7,
//       hint: null,
//       pattern: null,
//       maxLength: null,
//       minLength: null,
//       fieldId: 'abb7f3fe-f7fa-47be-9d28-5747dd3159f2',
//       dependsOn: false,
//     },
//   ],
// };
