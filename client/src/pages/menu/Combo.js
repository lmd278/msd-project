import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardCover from "@mui/joy/CardCover";
import CircularProgress from "@mui/joy/CircularProgress";
import IconButton from "@mui/joy/IconButton";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import Typography from "@mui/joy/Typography";

// Icons
import DeleteForever from "@mui/icons-material/DeleteForever";
import Edit from "@mui/icons-material/Edit";
import MoreVert from "@mui/icons-material/MoreVert";

// Custom
import { useSnackbar } from "notistack";
import { useState } from "react";
import comboApi from "../../api/comboApi";
import AlertDialog from "../../components/AlertDialog";
import status from "../../constants/status";
import ComboDialogEdit from "./ComboDialogEdit";

export default function Combo({
  id,
  name,
  description,
  price,
  image,
  fetchData,
  setLoading,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [openEdit, setOpenEdit] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [processIcon, setProcessIcon] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMore = Boolean(anchorEl);

  const handleMoreClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMoreClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    setProcessIcon(true);
    const remove = async () => {
      try {
        const response = await comboApi.delete(id);
        if (response?.data?.type === status.success) {
          setProcessIcon(false);
          fetchData();
          enqueueSnackbar(response?.data?.message, {
            variant: "success",
          });
        }
      } catch (err) {
        setProcessIcon(false);
        enqueueSnackbar(err.response?.data?.message, {
          variant: "error",
        });
      }
    };

    remove();
  };

  return (
    <Card
      sx={{
        "--Card-radius": (theme) => theme.vars.radius.sm,
        boxShadow: "none",
        aspectRatio: "4 / 3",
      }}
    >
      {image && (
        <CardCover>
          <img alt="" src={image} />
        </CardCover>
      )}
      <CardCover
        sx={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.12))",
        }}
      />
      <CardContent
        sx={{
          mt: "auto",
          flexGrow: 0,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography textColor="#fff">{name}</Typography>
          <Typography level="body3" mt={0.5} textColor="rgba(255,255,255,0.72)">
            Price: {price.toLocaleString()}đ
          </Typography>
        </Box>
        <IconButton
          id="positioned-button"
          aria-controls={openMore ? "positioned-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={openMore ? "true" : undefined}
          variant="plain"
          color="neutral"
          onClick={(e) => !processIcon && handleMoreClick(e)}
          sx={{ color: "#fff" }}
        >
          {processIcon && <CircularProgress size="sm" color="primary" />}
          {!processIcon && <MoreVert />}
        </IconButton>
        <Menu
          id="positioned-menu"
          anchorEl={anchorEl}
          open={openMore}
          onClose={handleMoreClose}
          aria-labelledby="positioned-button"
          placement="bottom-end"
        >
          <MenuItem onClick={() => setOpenEdit(true)}>
            <ListItemDecorator>
              <Edit />
            </ListItemDecorator>
            Edit combo
          </MenuItem>
          <MenuItem
            onClick={() => {
              setOpenAlert(true);
            }}
            variant="soft"
            color="danger"
          >
            <ListItemDecorator sx={{ color: "inherit" }}>
              <DeleteForever />
            </ListItemDecorator>
            Delete combo
          </MenuItem>
        </Menu>
        <ComboDialogEdit
          name={name}
          description={description}
          price={price}
          image={image}
          open={openEdit}
          setOpen={setOpenEdit}
          id={id}
          fetchData={fetchData}
          setLoading={setLoading}
        />
        <AlertDialog
          title="Confirmation"
          content={`Are you sure you want to delete "${name}"?`}
          dangerText="Delete"
          normalText="Cancel"
          open={openAlert}
          setOpen={setOpenAlert}
          handleConfirm={(e) => handleDelete(e)}
        />
      </CardContent>
    </Card>
  );
}
