import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";

const CalegConfirm = ({ innerRef, open, setUtils }) => {
  const onClose = (isTrue) => {
    setUtils((prev) => ({
      ...prev,
      openConfirm: false,
      confirm: Boolean(isTrue),
      currentId: Boolean(isTrue) ? prev.currentId : null,
    }));
  };
  return (
    <Dialog
      ref={innerRef}
      open={open}
      onClose={() => onClose()}
      aria-labelledby="responsive-dialog-title"
      className="confirmation-dialog"
    >
      <DialogContent>
        <Box textAlign="center" pt={2}>
          <Typography variant="h5">Yakin Hapus Data</Typography>
        </Box>
      </DialogContent>
      <DialogActions className="px-20 pb-20 justify-content-center">
        <Box
          mb={2}
          width="100%"
          display="flex"
          justifyContent="center"
          p={1}
          textAlign="center"
        >
          <Box mx={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => onClose(true)}
            >
              Yes
            </Button>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => onClose(false)}
          >
            No
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CalegConfirm;
