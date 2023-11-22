import {
  H3,
  Layout,
  overrideColorTheme,
  fieldsRegistryService,
  cohortRegistryService,
} from "@shiksha/common-lib";
import React, { useCallback, useEffect, useState } from "react";
import manifest from "../manifest.json";
import { useTranslation } from "react-i18next";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { Box, Container, useToast } from "native-base";
import { useNavigate } from "react-router-dom";

let schema = {
  title: "Add Cohort",
  type: "object",
  required: ["name", "type", "status", "createdBy", "updatedBy"],
  properties: {
    name: { type: "string", title: "Name", default: "" },
    type: { type: "string", title: "Type", default: "" },
    status: {
      type: "string",
      anyOf: [
        {
          title: "Published",
          enum: ["published"],
        },
        {
          title: "Draft",
          enum: ["draft"],
        },
      ],
    },
    // class: {
    //   type: "string",
    //   title: "Class",
    //   enum: ["1-4", "5-8", "9-10", "11-12"],
    // },
    createdBy: { type: "string", title: "Created By", default: "" },
    updatedBy: { type: "string", title: "Updated By", default: "" },
  },
};

let uiSchema = {
  name: {
    "ui:classNames": "custom-class-name",
    "ui:placeholder": "Enter a name of the cohort",
  },
  type: {
    "ui:classNames": "custom-class-type",
    "ui:placeholder": "Enter the type of Cohort",
  },
  createdBy: {
    "ui:widget": "hidden",
  },
  updatedBy: {
    "ui:widget": "hidden",
  },
};

function CreateCohort({ footerLinks, appName }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();
  const [formData, setFormData] = useState({ name: "My First Cohort" });
  const [showForm, setShowForm] = useState(false);
  const [formSchema, setFormSchema] = useState({
    schema: schema,
    uiSchema: uiSchema,
  });
  const [fields, setFields] = useState([]);
  const [fieldResponse, setFieldResponse] = useState({});
  let userIdentifier = localStorage.getItem("id");

  useEffect(() => {
    if (userIdentifier) {
      setFormData((prev) => ({
        ...prev,
        createdBy: userIdentifier,
        updatedBy: userIdentifier,
      }));
    }

    fieldsRegistryService
      .getFields(
        {
          limit: "",
          page: 0,
          filters: {
            contextId: { _is_null: true },
            context: { _eq: "Cohort" },
          },
        },
        {
          tenantid: process.env.REACT_APP_TENANT_ID,
        }
      )
      .then((response) => {
        console.log("response", response);
        let extraFields = [];
        let fieldRes = {};
        response.forEach((field) => {
          if (field.render) {
            extraFields.push(JSON.parse(field.render));
            fieldRes[field.name] = field;
          }
        });
        setFields(extraFields);
        setFieldResponse(fieldRes);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    console.log("Fields", fields);
    createFormSchema();
  }, [fields]);

  const createFormSchema = () => {
    fields.forEach((renderJSON) => {
      for (const key in renderJSON) {
        const field = renderJSON[key];
        setFormSchema((prev) => ({
          ...prev,
          schema: {
            ...prev.schema,
            properties: {
              ...prev.schema.properties,
              [key]: field.coreSchema,
            },
            required: field.hasOwnProperty("required")
              ? [...prev.schema.required, key]
              : [...prev.schema.required],
          },
          uiSchema: {
            ...prev.uiSchema,
            [key]: field.uiSchema,
          },
        }));
      }
    });
    console.log("formSchema", formSchema);
    setShowForm(true);
  };

  const createFormSchema1 = () => {
    if (fields.length) {
      fields.forEach((field) => {
        const item = Object.keys(field)[0];
        let schema = { ...formSchema.schema };
        let uiSchema = { ...formSchema.uiSchema };
        schema.properties[item] = field[item].schema;
        if (field[item].required) {
          schema.required.push(item);
        }

        uiSchema[item] = field[item].uiSchema;
        setFormSchema({ schema, uiSchema });
      });
      schema = { ...schema, properties: { ...schema.properties } };
    }

    setShowForm(true);
  };

  const log = (type) => console.log.bind(console, type);
  const handleChange = useCallback((event) => {
    console.log(event);
    setFormData((prev) => {
      return { ...prev, ...event };
    });
  });

  const handleSubmit = (data) => {
    console.log("data", data);
    const fieldKeys = fields.map((obj) => Object.keys(obj)[0]);
    let corePayload = {};
    let fieldsPayload = "";
    const formData = new FormData();
    for (let key in data) {
      if (fieldKeys.includes(key)) {
        if (fieldsPayload === "") {
          fieldsPayload = `${fieldResponse[key].fieldId}:${data[key]}`;
        } else {
          fieldsPayload = `${fieldsPayload}|${fieldResponse[key].fieldId}:${data[key]}`;
        }
      } else {
        corePayload[key] = data[key];
        formData.append(key, data[key]);
      }
    }
    formData.append("fieldValues", fieldsPayload);
    cohortRegistryService
      .create(formData, {
        tenantid: process.env.REACT_APP_TENANT_ID,
      })
      .then((response) => {
        console.log("response", response);
        if (!toast.isActive("cohort-created")) {
          toast.show({
            id: "cohort-created",
            title: "Cohort created successfully!",
          });
        }
        navigate("/admin");
      });
  };
  const colors = overrideColorTheme();
  return (
    <Layout
      _header={{
        title: "Create New Cohort",
      }}
      _appBar={{ languages: manifest.languages }}
      subHeader={
        <H3 textTransform="none">{t("Submit the below given form")}</H3>
      }
      _subHeader={{
        bg: colors?.cardBg,
        _text: {
          fontSize: "16px",
          fontWeight: "600",
          textTransform: "inherit",
        },
      }}
      _footer={footerLinks}
    >
      {showForm && (
        <Box mx={"30px"}>
          <Form
            schema={formSchema.schema}
            uiSchema={formSchema.uiSchema}
            validator={validator}
            formData={formData}
            onChange={(e) => handleChange(e.formData)}
            onSubmit={(e) => handleSubmit(e.formData)}
            onError={log("errors")}
          />
        </Box>
      )}
    </Layout>
  );
}

export default CreateCohort;
