import { Drawer } from "@mui/material";
import CategoriesFilter from "./CategoriesFilter";
import RangeFilter from "./RangeFilter";
import InstructorsFilter from "./InstructorsFilter";
import ReviewFilter from "./ReviewFilter";

export default function Filters({ openFilters, setOpenFilters }) {
  const toggleDrawer = (newOpen) => () => {
    setOpenFilters(newOpen);
  };

  return (
    <div>
      <Drawer
        open={openFilters}
        onClose={toggleDrawer(false)}
        anchor="right"
        sx={{
          "& .MuiDrawer-paper": {
            width: "20%",
          },
        }}
      >
        <CategoriesFilter />
        <RangeFilter />
        <InstructorsFilter />
        <ReviewFilter />
      </Drawer>
    </div>
  );
}
