import React, { useEffect } from "react";
import styles from "./AdminHomeStyles.css";
import { H2, Heading, BodyLarge, Widget } from "@shiksha/common-lib";
import { Layout, NameTag } from "@shiksha/common-lib";
import { Box, Stack, VStack, HStack, Avatar, Image, Button } from "native-base";
import { useTranslation } from "react-i18next";
import moment from "moment";
import manifest from "../manifest.json";

function AdminHome({footerLinks, appName}) {
  const [loading, setLoading] = React.useState(false);
  const { t } = useTranslation();

  const widgetData = [
    {
      link: "/",
      data: [
        {
          link: "/admin/cohorts/add",
          title: <H2>Manage Cohort</H2>,
          _box: {
            style: {
              background:
                "linear-gradient(102.88deg, #D7BEE6 -5.88%, #B143F3 116.6%)",
            },
          },
        },
      ],
    },
    {
      link: "/",
      data: [
        {
          link: "/admin/users/add",
          title: <H2>Manage Teacher</H2>,

          _box: {
            style: {
              background:
                "linear-gradient(281.03deg, #FC5858 -21.15%, #F8AF5A 100.04%)",
            },
          },
        },
      ],
    },

    {
      link: "/",
      data: [
        {
          link: "/admin/users/add",

          title: <H2>Manage Student</H2>,

          _box: {
            style: {
              background:
                "linear-gradient(100.88deg, #90c7ef -21.15%, #145788 80.4%)",
            },
          },
        },
      ],
    }
  ];

  return (
    <div className={styles.mainDiv}>
      <Layout
        loading={loading}
        _header={{
          title: t("ADMIN PANEL"),
          subHeading: moment().format("hh:mm:ss A"),
        }}
        _appBar={{
          languages: manifest.languages,
          isLanguageIcon: true,
          // isShowNotificationButton: false,
          // titleComponent: <NameTag />,
          // _text_logo: <HStack></HStack>
        }}
        _footer={footerLinks}
      >
        <Box bg="white" rounded={"2x1"} py={6} px={4} mb={5} shadow={3}>
          <Stack>
            <VStack space={6}>
              <Box display={"inline"}>
                Welcome to the Admin Panel. Please choose one of the following
                entities to manage records. Within each entity, you have the
                capability to perform various operations.
              </Box>
              <div className={styles.gridContainer}>
                {widgetData.map((item, index) => {
                  return (
                    <div className={styles.gridItem} key={index}>
                      <Widget {...item} />
                    </div>
                  );
                })}
              </div>
            </VStack>
          </Stack>
        </Box>
      </Layout>
    </div>
  );
}

export default AdminHome;