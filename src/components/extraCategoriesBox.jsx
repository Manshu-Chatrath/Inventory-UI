import { Box, Typography, Button } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const ExtraCategoriesBox = ({
  setOpenModal,
  extraCategories,
  setExtraCategories,

  removeExtraCategories,
  setRemoveExtraCategories,
  isEdit,
  setSelectedExtraCategory,
}) => {
  const handleEdit = (data, index) => {
    data.index = index;
    setSelectedExtraCategory(data);
    setOpenModal(true);
  };

  const handleDelete = (_, index) => {
    let arr = [];
    if (isEdit) {
      arr = [...removeExtraCategories, extraCategories[index].id];
      setRemoveExtraCategories(arr);
    }
    arr = extraCategories.filter((_, i) => i !== index);
    setExtraCategories(arr);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "200px",
        border: "2px dotted black",
        color: "green",
        display: "flex",
        borderRadius: "5px",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
      {extraCategories.length === 0 ? (
        <>
          <Typography
            variant="label"
            style={{
              color: "black",
              fontWeight: "bold",
              fontSize: "20px",
              textAlign: "center",
            }}>
            Click {"'ADD' or +"} to create extras
          </Typography>
          <Button
            onClick={() => setOpenModal(true)}
            sx={{
              border: "2px solid green",
              bgcolor: "transparent",
              color: "green",
              marginTop: "5px",
              fontWeight: "bold",
              "&:hover": {
                bgcolor: "transparent",
                opacity: 0.8,
              },
            }}>
            Add
          </Button>
        </>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bold" }}>Categories</TableCell>
                <TableCell style={{ fontWeight: "bold" }} align="right">
                  Items
                </TableCell>
                <TableCell
                  style={{ fontWeight: "bold" }}
                  align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {extraCategories.map((row, index) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.items.length}</TableCell>
                  <TableCell align="right">
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}>
                      <Box>
                        <Button
                          onClick={() => handleEdit(row, index)}
                          variant="contained"
                          startIcon={<EditIcon />}
                          sx={{
                            backgroundColor: "green",
                            borderRadius: "20px",
                            textTransform: "none",
                            boxShadow: "none",
                            fontWeight: "bold",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "#045d04", // Darker shade of green on hover
                            },
                          }}>
                          Edit
                        </Button>
                      </Box>
                      <Box>
                        <Button
                          variant="contained"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDelete(row, index)}
                          sx={{
                            backgroundColor: "red",
                            textTransform: "none",
                            color: "white",
                            borderRadius: "20px",
                            fontWeight: "bold",
                            boxShadow: "none",
                            marginLeft: "8px", // Add some space between the buttons
                            "&:hover": {
                              backgroundColor: "#a30000", // Darker shade of red on hover
                            },
                          }}>
                          Delete
                        </Button>
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ExtraCategoriesBox;
