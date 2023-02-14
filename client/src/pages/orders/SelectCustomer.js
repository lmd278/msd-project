import Autocomplete from "@mui/joy/Autocomplete";
import AutocompleteOption from "@mui/joy/AutocompleteOption";
import CircularProgress from "@mui/joy/CircularProgress";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";

export function SelectCustomer({ customer, setCustomer, customers, loading }) {
  return (
    <Autocomplete
      placeholder="Apply event to discount"
      value={customer}
      onChange={(e, newValue) => {
        setCustomer(newValue);
      }}
      slotProps={{
        input: {
          autoComplete: "new-password", // disable autocomplete and autofill
        },
      }}
      options={customers}
      autoHighlight
      getOptionLabel={(option) => option?.name || ""}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      loading={loading}
      endDecorator={
        loading ? (
          <CircularProgress size="sm" sx={{ bgcolor: "background.surface" }} />
        ) : null
      }
      renderOption={(props, option) => (
        <AutocompleteOption {...props}>
          <ListItemContent sx={{ fontSize: "sm" }}>
            {option.name}
            <Typography level="body3">Phone: {option.phone}</Typography>
          </ListItemContent>
        </AutocompleteOption>
      )}
    />
  );
}
