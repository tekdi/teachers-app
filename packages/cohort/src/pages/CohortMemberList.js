import React, { useEffect, useState } from "react";
import {
  Box,
  HStack,
  VStack,
  Pressable,
  Image,
  Avatar,
  Button,
} from "native-base";
import { useTranslation } from "react-i18next";
import { generatePath, useParams } from "react-router-dom";
import {
  capture,
  Layout,
  Tab,
  overrideColorTheme,
  H3,
  IconByName,
  Widget,
  BodySmall,
  H4,
  cohortRegistryService,
} from "@shiksha/common-lib";
import moment from "moment";
import manifest from "../manifest.json";
const colors = overrideColorTheme();

// import ChooseClassActionSheet from "./Molecules/ChooseClassActionSheet";

export default function CohortMemberList({footerLinks}) {
  const { t } = useTranslation();
  const [selfAttendance, setSelfAttendance] = React.useState({});
  const [showModal, setShowModal] = React.useState(false);
  let newAvatar = localStorage.getItem("firstName");

  const [members, setMembers] = useState([]);
  const teacherId = localStorage.getItem("id");
  const { cohortId } = useParams();
  let cameraUrl = "";
  let avatarUrlObject = cameraUrl
    ? {
        source: {
          uri: cameraUrl,
        },
      }
    : {};
  useEffect(() => {
    let ignore = false;
    const getData = async () => {
      if (!ignore) {
        setMembers(
          await cohortRegistryService.getCohortMembers(
            {
              limit: "",
              page: 0,
              filters: {
                cohortId: { _eq: cohortId },
              },
            },
            {
              tenantid: process.env.REACT_APP_TENANT_ID,
            }
          )
        );
      }
    };
    getData();
  }, [teacherId]);

  return (
    <Layout
      _header={{
        title: t("MY_CLASS"),
        subHeading: moment().format("hh:mm A"),
        iconComponent: (
          <Pressable onPress={(e) => setShowModal(true)}>
            {cameraUrl ? (
              <Image
                ref={myRef}
                {...avatarUrlObject}
                rounded="lg"
                alt="Profile"
                size="50px"
              />
            ) : (
              <Avatar>{newAvatar?.toUpperCase().substr(0, 2)}</Avatar>
            )}
            {selfAttendance?.attendance ? (
              <IconByName
                name={
                  selfAttendance.attendance === PRESENT &&
                  selfAttendance?.remark !== ""
                    ? "AwardFillIcon"
                    : selfAttendance.attendance === ABSENT
                    ? "CloseCircleFillIcon"
                    : "CheckboxCircleFillIcon"
                }
                isDisabled
                color={
                  selfAttendance.attendance === PRESENT &&
                  selfAttendance?.remark !== ""
                    ? "attendance.special_duty"
                    : selfAttendance.attendance === ABSENT
                    ? "attendance.absent"
                    : "attendance.present"
                }
                position="absolute"
                bottom="-5px"
                right="-5px"
                bg="white"
                rounded="full"
              />
            ) : (
              ""
            )}
          </Pressable>
        ),
      }}
      _appBar={{ languages: manifest.languages }}
      // subHeader={<H3 textTransform="none">{t("THE_CLASS_YOU_TAKE")}</H3>}
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
      <Box pb={4} pt="30">
        <VStack space={2}>
          {members.map((item, index) => {
            return (
              <Box
                p="2"
                m="2"
                rounded={"lg"}
                key={index}
                style= {{
                  background:
                    index % 2 === 0
                      ? "linear-gradient(281.03deg, #FC5858 -21.15%, #F8AF5A 100.04%)"
                      : "linear-gradient(102.88deg, #D7BEE6 -5.88%, #B143F3 116.6%)",
                }}
                _text={{
                  fontSize: "md",
                  fontWeight: "medium",
                  color: "black",
                }}
                shadow={2}
              >
                <HStack justifyContent="space-between">
                  <VStack>
                    <H4>{item?.userDetails?.name}</H4>
                    <BodySmall>{"Student"}</BodySmall>
                  </VStack>
                  <HStack space={2}>
                    <Button
                      variant={"link"}
                      colorScheme="primary"
                      onPress={() => console.log("hello world")}
                    >
                      Take Attendance
                    </Button>
                    <Button
                      variant={"link"}
                      colorScheme="secondary"
                      onPress={() => console.log("hello world")}
                    >
                      Take Observation
                    </Button>
                  </HStack>
                </HStack>
              </Box>
            );
          })}
          ;
          {/* <Widget
            data={members.map((item, index) => {
              return {
                title: item?.userDetails?.name || "",
                subTitle: t("STUDENT"),
                // link: generatePath(item.id, { ...{ id: item.id } }),
                _box: {
                  style: {
                    background:
                      index % 2 === 0
                        ? "linear-gradient(281.03deg, #FC5858 -21.15%, #F8AF5A 100.04%)"
                        : "linear-gradient(102.88deg, #D7BEE6 -5.88%, #B143F3 116.6%)",
                  },
                },
              };
            })}
          /> */}
          {/* <HStack space={2} justifyContent={"center"}>
          <ChooseClassActionSheet />
        </HStack> */}
        </VStack>
      </Box>
    </Layout>
  );
}
