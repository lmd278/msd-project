import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";

// Icons
import Add from "@mui/icons-material/Add";

// Custom
import { useContext, useState } from "react";
import Header from "../../components/Header";
import Layout from "../../components/Layout";
import SideBar from "../../components/SideBar";
import SideDrawer, { SideDrawerContext } from "../../components/SideDrawer";

export default function Report() {
  const { drawerOpen } = useContext(SideDrawerContext);
  const [openAdd, setOpenAdd] = useState(false);

  return (
    <>
      {drawerOpen && <SideDrawer />}
      <Layout.Root
        sx={{
          ...(drawerOpen && {
            height: "100vh",
            overflow: "hidden",
          }),
        }}
      >
        <Header />
        <Layout.SideNav>
          <SideBar />
        </Layout.SideNav>
        <Layout.Main
          sx={{
            bgcolor: "background.surface",
          }}
        >
          <Box
            sx={{
              pt: 1,
              bgcolor: "background.surface",
              position: "sticky",
              top: 64, // TODO: Fix hard code
              zIndex: 1100,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography fontWeight="bold" level="h3" component="h1">
                Report
              </Typography>
            </Box>
            <Box
              sx={{
                my: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Button startDecorator={<Add />} onClick={() => setOpenAdd(true)}>
                Add report
              </Button>
            </Box>
          </Box>
        </Layout.Main>
      </Layout.Root>
    </>
  );
}
