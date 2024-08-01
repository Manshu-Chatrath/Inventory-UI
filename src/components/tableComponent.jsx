import Table from "@mui/material/Table";
import InfoIcon from "@mui/icons-material/Info";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import {
  Box,
  Button,
  Typography,
  Toolbar,
  Tooltip,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { capitalizeFirstLetter } from "../util";
import AddIcon from "@mui/icons-material/Add";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";

const TableComponent = ({
  title,
  handleModal,
  setSelectedItem,
  rows,
  page,
  rowsPerPage,
  setRowsPerPage,
  setPage,
  toolTipDescription,
  setOpenDeleteModal,
  total,
}) => {
  const handlePageChange = (e, newPage) => {
    setPage(newPage);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setOpenDeleteModal(true);
  };
  const mobileWidth = useMediaQuery("(max-width:500px)");
  const handleRowChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    handleModal();
  };

  return (
    <>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          paddinBottom: "20px",
          marginTop: "30px",
        }}>
        <Paper
          sx={{
            width: mobileWidth ? "100%" : "80%",
            overflowX: "auto",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}>
          <Toolbar
            sx={{
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Typography variant="h5" component="div">
              {title}
            </Typography>
            <Tooltip title={toolTipDescription}>
              <IconButton onClick={handleModal}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
          {rows.length === 0 ? (
            <Box style={{ textAlign: "center", fontSize: 16 }}>
              <Typography style={{ fontWeight: "bold" }}>
                There are no {title}!
              </Typography>
            </Box>
          ) : (
            <TableContainer
              sx={{
                overflowX: "auto",
                width: "100%",
              }}>
              <Table
                aria-label="a dense table"
                size="small"
                sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell style={{ fontWeight: "bold" }} align="right">
                      {title === "Categories" ? "Dishes (Qty) " : "Quantity"}
                    </TableCell>
                    <TableCell
                      style={{ fontWeight: "bold" }}
                      align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      style={{
                        backgroundColor:
                          row?.threshold >= row?.quantity ? "#FFCDD2" : "",
                      }}
                      key={row.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}>
                      <TableCell component="th" scope="row">
                        {row?.threshold >= row?.quantity ? (
                          <Tooltip title={"Low in stock"}>
                            <Button
                              variant="text"
                              sx={{
                                borderRadius: "20px",
                                textTransform: "none", // This makes the text appear as normal, not uppercase
                                boxShadow: "none",
                                fontWeight: "bold",
                                color: "black",
                                padding: "0", // Sets padding to 0
                              }}
                              startIcon={<InfoIcon style={{ color: "red" }} />}>
                              {capitalizeFirstLetter(row.name)}
                            </Button>{" "}
                          </Tooltip>
                        ) : (
                          capitalizeFirstLetter(row.name)
                        )}
                      </TableCell>
                      <TableCell align="right">{row.quantity}</TableCell>
                      <TableCell align="right">
                        <Box
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}>
                          <Box>
                            <Button
                              onClick={() => handleEdit(row)}
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
                              onClick={() => handleDelete(row)}
                              variant="contained"
                              startIcon={<DeleteIcon />}
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
                <TableFooter>
                  <TableRow
                    style={{ borderTop: "1px solid rgba(224, 224, 224, 1)" }}>
                    <TablePagination
                      count={total}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handlePageChange}
                      onRowsPerPageChange={handleRowChange}
                      rowsPerPageOptions={[5, 10, 20]}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    </>
  );
};
export default TableComponent;
