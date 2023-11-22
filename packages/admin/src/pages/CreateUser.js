import {
  H3,
  Layout,
  overrideColorTheme,
  fieldsRegistryService,
} from "@shiksha/common-lib";
import React, { useCallback, useEffect, useState } from "react";
import manifest from "../manifest.json";
import { useTranslation } from "react-i18next";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { Box, Container } from "native-base";

let schema = {
  title: "Add Users",
  type: "object",
  required: ["username", "name", "role", "password"],
  properties: {
    username: { type: "string", title: "Username", default: "" },
    name: { type: "string", title: "Name", default: "" },
    role: { type: "string", title: "Role", default: "" },
    password: { type: "string", title: "Password", default: "" },
    email: { type: "string", title: "Email", default: "" },
  },
};

let uiSchema = {
  name: {
    "ui:classNames": "custom-class-name",
    "ui:placeholder": "Enter a name of the cohort",
  },
  password: {
    "ui:widget": "password",
  }
};

function CreateUser({ footerLinks, appName }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [formSchema, setFormSchema] = useState({
    schema: schema,
    uiSchema: uiSchema,
  });
  const [fields, setFields] = useState([]);
  let userIdentifier = localStorage.getItem("id");

  useEffect(() => {
    fieldsRegistryService
      .getFields(
        {
          limit: "",
          page: 0,
          filters: {
            contextId: { _is_null: true },
            context: { _eq: "Users" },
          },
        },
        {
          tenantid: "31d1cc30-da56-4c6a-90d7-8bc4fc51bc70" || process.env.REACT_APP_TENANT_ID,
        }
      )
      .then((response) => {
        console.log("response", response);
        let extraFields = [];
        response.forEach((field) => {
          if (field.render) {
            extraFields.push(JSON.parse(field.render));
          }
        });
        setFields(extraFields);
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

  const log = (type) => console.log.bind(console, type);
  const handleChange = useCallback((event) => {
    console.log(event);
    setFormData((prev) => {
      return { ...prev, ...event };
    });
  });

  const handleSubmit = (data) => {
    console.log("data", data);
    // cohortService
    //   .createCohort(data, {
    //     tenantid: process.env.REACT_APP_TENANT_ID,
    //   })
    //   .then((response) => {
    //     console.log("response", response);
    //   });
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

export default CreateUser;
