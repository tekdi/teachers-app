import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { useRouter } from "next/router";
import { Box, Typography } from "@mui/material";

const Dashboard = () => {
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState<string>("create");

  useEffect(() => {
    const key = router.query.slug ? (router.query.slug as string) : "create";
    setSelectedKey(key);
  }, [router.query]);

  const renderContent = () => {
    switch (selectedKey) {
      case "create":
        return (
          <Box p={3}>
            <Typography variant="h4">Create Content</Typography>
            <Typography>Here you can create new content.</Typography>
          </Box>
        );
      case "allContents":
        return (
          <Box p={3}>
            <Typography variant="h4">All My Contents</Typography>
            <Typography>Here are all your contents.</Typography>
          </Box>
        );
      // Add cases for other keys as needed
      default:
        return (
          <Box p={3}>
            <Typography variant="h4">Default Content</Typography>
            <Typography>Select an option from the sidebar.</Typography>
          </Box>
        );
    }
  };

  return (
    <Layout selectedKey={selectedKey} onSelect={setSelectedKey}>
      {renderContent()}
    </Layout>
  );
};

export default Dashboard;
