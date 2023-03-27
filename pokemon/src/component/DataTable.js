import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Collapse from "@mui/material/Collapse";
import FormControl from '@mui/material/FormControl';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
    </Box>
  );
}

export default function DataTable() {
  const [selectType, setSelectType] = useState(null);
  const [typesData, setTypesData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [imagesData, setImagesData] = useState([]);
  const [thumbnailsData, setthumbnailsData] = useState([]);

  useEffect(() => {
    fetch(
      "http://127.0.0.1:3000/tableData"
      )
      .then((data) => data.json())
      .then((data) => {
        setTableData(data);
        let typesSet = new Set(["all"]);
        data.forEach((it) => {
          it.type?.forEach((x) => typesSet.add(x));
        });
        setTypesData([...typesSet]);
      });
    fetch("http://127.0.0.1:3000/thumbnails").then(data => data.json()).then(data => {
      setthumbnailsData(data);
    }).catch(err => {
      console.log(err);
    })
    console.log('1', thumbnailsData)
    fetch("http://127.0.0.1:3000/images").then(data => data.json()).then(data => {
      setImagesData(data);
    }).catch(err => {
      console.log(err);
    })
  }, []);

  const filterTableData = useMemo(
    () =>
      tableData.filter(
        (it) =>
          !selectType || selectType === "all" || it.type.includes(selectType)
      ),
    [tableData, selectType]
  );

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableData.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSelectType(event.target.value);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>ID</TableCell>
            <TableCell>thumbnails</TableCell>

            <TableCell>Name</TableCell>
            <TableCell>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-standard-label">
                  Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={selectType}
                  onChange={handleChange}
                  label="Age"
                >
                  {typesData.map((it, index) => (
                    <MenuItem key={index} value={it}>
                      {it}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </TableCell>
            <TableCell>HP</TableCell>
            <TableCell>Attack</TableCell>
            <TableCell>Defense</TableCell>
            <TableCell>Speed</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? filterTableData.slice(
              page * rowsPerPage,
              page * rowsPerPage + rowsPerPage
            )
            : filterTableData
          ).map((filterTableData, index) => (
            <Row filterTableData={filterTableData} key={index} url={imagesData[index]} />
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={8} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[10, 25, { label: "All", value: -1 }]}
              colSpan={3}
              count={filterTableData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  "aria-label": "rows per page",
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

function Row({ filterTableData, url, ThumbnailsUrl }) {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow
        key={filterTableData.name}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell scope="row">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {filterTableData.id}
        </TableCell>
        <TableCell>
          < img src={url} style={{ width: '20px', height: '20px' }} />
        </TableCell>

        <TableCell>{filterTableData.name.english}</TableCell>
        <TableCell>{filterTableData.type}</TableCell>
        <TableCell>{filterTableData.base.HP}</TableCell>
        <TableCell>{filterTableData.base.Attack}</TableCell>
        <TableCell>{filterTableData.base.Defense}</TableCell>
        <TableCell>{filterTableData.base.Speed}</TableCell>
      </TableRow>
      <TableRow key={filterTableData.id}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Detailed information
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Image</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableCell component="th" scope="row">
                    {filterTableData.id}
                  </TableCell>
                  <TableCell>{filterTableData.name.english}</TableCell>
                  <TableCell>
                    <img src={url} />
                  </TableCell>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
