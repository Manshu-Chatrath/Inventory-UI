import { Box, Button } from "@mui/material";

export default function HorizontalScroll({
  rows,
  onClick,
  selectedItem,
  setSelectedItem,
}) {
  return (
    <Box display={"flex"} justifyContent={"center"}>
      <Box
        display="flex"
        justifyContent={"space-between"}
        style={{ width: "80%", overflowX: "auto" }}>
        <Box key={222}>
          <Button
            onClick={() => {
              setSelectedItem(null);
              onClick(null);
            }}
            style={{
              color: !selectedItem ? "black" : "silver",
              fontWeight: !selectedItem ? "bold" : "default",
            }}>
            ALL
          </Button>
        </Box>
        {rows.map((row) => (
          <Box key={row.id}>
            <Button
              onClick={() => {
                setSelectedItem(row);
                onClick(row.id);
              }}
              style={{
                color: selectedItem?.id === row.id ? "black" : "silver",
                fontWeight: selectedItem?.id === row.id ? "bold" : "default",
              }}>
              {row.name}
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
