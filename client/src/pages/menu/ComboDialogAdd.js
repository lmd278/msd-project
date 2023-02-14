import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import CircularProgress from "@mui/joy/CircularProgress";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import Stack from "@mui/joy/Stack";
import Textarea from "@mui/joy/Textarea";
import Typography from "@mui/joy/Typography";

// Icons
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

// Custom
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import comboApi from "../../api/comboApi";
import diskApi from "../../api/diskApi";
import status from "../../constants/status";
import { useDebounce } from "../../hooks";
import ComboDiskList from "./ComboDiskList";

export default function ComboDialogAdd({
  open,
  setOpen,
  setLoading,
  fetchData,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [openSubModal, setOpenSubModal] = useState(false);
  const [search, setSearch] = useState("");
  const [disks, setDisks] = useState([]);
  const [preview, setPreview] = useState();
  const [selectedDisks, setSelectedDisks] = useState([]);
  const [progressIcon, setProgressIcon] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = () => {
    const save = async () => {
      setLoading(true);
      try {
        const response = await comboApi.create({
          name,
          description,
          price,
          image,
          disks: selectedDisks,
        });
        if (response?.data?.type === status.success) {
          fetchData();
          enqueueSnackbar(response?.data?.message, {
            variant: "success",
          });
        }
      } catch (err) {
        setLoading(false);
        enqueueSnackbar(err.response?.data?.message, {
          variant: "error",
        });
      }
    };

    save();
    setName("");
    setDescription("");
    setPrice("");
    setImage("");
    setOpenSubModal(false);
    setSearch("");
    setPreview();
    setSelectedDisks([]);
  };

  const debouncedValue = useDebounce(search, 500);
  useEffect(() => {
    const fetchApi = async () => {
      setProgressIcon(true);
      try {
        const response = await diskApi.search(debouncedValue);
        if (response?.data?.type === status.success) {
          setDisks(() => {
            return response.data.disks.map((item) => {
              item.quantity = 0;
              return item;
            });
          });
        }
      } catch (err) {
        setDisks([]);
      }
      setProgressIcon(false);
    };

    fetchApi();
  }, [debouncedValue]);

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!image) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setImage(undefined);
      return;
    }
    // I've kept this example simple by using the first image instead of multiple
    setImage(e.target.files[0]);
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog
        sx={{
          width: "95%",
          maxWidth: 550,
          maxHeight: "95vh",
          overflowY: "auto",
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
        }}
      >
        <ModalClose />
        <Typography
          component="h2"
          level="inherit"
          fontSize="1.25em"
          mb="0.25em"
        >
          Add new combo
        </Typography>
        <Stack
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
            setOpen(false);
          }}
        >
          <Stack direction="row" spacing={3}>
            <Stack className="col-1" flex={1}>
              <Stack spacing={2}>
                <FormControl required>
                  <FormLabel>Name</FormLabel>
                  <Input
                    name="name"
                    placeholder="Name"
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    minRows={2}
                    maxRows={2}
                    placeholder="This is a combo composed of..."
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </FormControl>
                <FormControl required>
                  <FormLabel>
                    {"Price (Original: "}
                    {disks
                      .reduce((sum, cur) => sum + cur.price * cur.quantity, 0)
                      .toLocaleString()}
                    {"đ)"}
                  </FormLabel>
                  <Input
                    name="price"
                    placeholder="Combo price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </FormControl>
                <FormControl sx={{ display: { xs: "flex", sm: "none" } }}>
                  <FormLabel>Disks</FormLabel>
                  <Button
                    variant="outlined"
                    onClick={() => setOpenSubModal(true)}
                  >
                    Select disks
                  </Button>
                </FormControl>
                <FormControl>
                  <FormLabel>Image</FormLabel>
                  <IconButton component="label">
                    <AddPhotoAlternateRoundedIcon />
                    <input type="file" hidden onChange={onSelectFile} />
                  </IconButton>
                  {image && (
                    <AspectRatio
                      ratio="4 / 3"
                      maxHeight={175}
                      objectFit="cover"
                      sx={{ marginTop: 1 }}
                    >
                      <img src={preview} alt="Preview" />
                    </AspectRatio>
                  )}
                </FormControl>
              </Stack>
            </Stack>

            <Stack
              className="col-2"
              sx={{ display: { xs: "none", sm: "flex" } }}
              flex={1}
            >
              <ComboDiskSelect
                search={search}
                setSearch={setSearch}
                progressIcon={progressIcon}
                disks={disks}
                setDisks={setDisks}
                setSelectedDisks={setSelectedDisks}
              />
            </Stack>
          </Stack>

          <Box mt={3} display="flex" gap={2} sx={{ width: "100%" }}>
            <Button
              type="submit"
              startDecorator={<SaveRoundedIcon />}
              sx={{ flex: 1 }}
            >
              Save
            </Button>
            <Button
              type="button"
              variant="soft"
              onClick={() => setOpen(false)}
              sx={{ flex: 1 }}
            >
              Cancel
            </Button>
          </Box>

          <Modal open={openSubModal} onClose={() => setOpenSubModal(false)}>
            <ModalDialog layout="fullscreen">
              <ModalClose />
              <Typography component="h2" fontSize="1.25em" mb={2}>
                Select disks
              </Typography>
              <ComboDiskSelect
                search={search}
                setSearch={setSearch}
                progressIcon={progressIcon}
                disks={disks}
                setDisks={setDisks}
                setSelectedDisks={setSelectedDisks}
              />
            </ModalDialog>
          </Modal>
        </Stack>
      </ModalDialog>
    </Modal>
  );
}

function ComboDiskSelect({
  search,
  setSearch,
  progressIcon,
  disks,
  setDisks,
  setSelectedDisks,
}) {
  return (
    <>
      <Box>
        <FormControl>
          <FormLabel>Search</FormLabel>
          <Input
            name="search"
            placeholder="Search dishes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            endDecorator={
              progressIcon ? (
                <CircularProgress size="sm" color="primary" />
              ) : (
                <SearchRoundedIcon color="neutral" />
              )
            }
            sx={{ width: "95%" }}
          />
        </FormControl>
      </Box>
      <Stack
        flexBasis={0}
        flexGrow={1}
        sx={{
          mt: 2,
          pb: 2,
          maxHeight: { xs: "100%" },
          overflow: "auto",
        }}
      >
        <ComboDiskList
          diskList={disks}
          setDiskList={setDisks}
          setSelectedDisks={setSelectedDisks}
        />
      </Stack>
    </>
  );
}
