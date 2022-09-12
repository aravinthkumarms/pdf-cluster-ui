import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import CircularLoader from './CircularLoader';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import { INITIAL_STATE, tableReducer } from '../reducer/tableReducer';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { updateFileName, updateVal } from '../reducer/imageReducer';

const columns = [
    { id: 'fileId', label: 'FILE ID', minWidth: 170 },
    { id: 'fileName', label: 'FILE NAME', minWidth: 100 },
    {
        id: 'fileSize',
        label: 'FILE SIZE',
        minWidth: 170,
        align: 'right',
    },
    {
        id: 'totalPages',
        label: 'TOTAL PAGES',
        minWidth: 170,
        align: 'right',
    },
    {
        id: 'uploadedOn',
        label: 'UPLODED ON',
        minWidth: 170,
        align: 'right',
    },
];




function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead >
            <TableRow>
                {columns.map((column) => (
                    <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth, fontWeight: "bold" }}
                        sortDirection={orderBy === column.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === column.id}
                            direction={orderBy === column.id ? order : 'asc'}
                            onClick={createSortHandler(column.id)}
                        >
                            {column.label}
                            {orderBy === column.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {

    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    rowCount: PropTypes.number.isRequired,
    orderBy: PropTypes.string.isRequired,
};

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function HybridTable() {
    const imageDispatch = useDispatch();
    const [orderBy, setOrderBy] = React.useState("");
    const [state, dispatch] = React.useReducer(tableReducer, INITIAL_STATE)
    const [order, setOrder] = React.useState('asc');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const { promiseInProgress } = usePromiseTracker();
    const [tableErr, setTableErr] = React.useState(false);


    React.useEffect(() => {
        let mounted = true;
        trackPromise(
            fetch("http://localhost:8000/UI/input/")
                .then((response) => response.json())
                .then((data) =>
                    dispatch({ type: "FETCH_SUCCESS", payload: data })
                ).catch(err => {
                    setTableErr(true);
                    dispatch({ type: "SNACK_BAR_OPEN" })
                    console.log("Caught It!", err)
                })
        )
        console.log(mounted)
        return () => mounted = false;
    }, [])

    let navigate = useNavigate();
    const routeChange = (fileId) => {
        fetch("http://localhost:8000/image/response/" + fileId)
            .then((response) => {
                const jsonPromise = response.json();
                jsonPromise.then((data) =>
                    imageDispatch(updateVal(data))
                )
            }).catch(err => {
                setTableErr(true);
                dispatch({ type: "SNACK_BAR_OPEN" })
                console.log("Caught It!", err)
            })
        fetch("http://localhost:8000/blob/response/v1?fileId=" + fileId).
            then((response) => {
                const jsonPromise = response.json();
                jsonPromise.then((data) =>
                    imageDispatch(updateFileName(data.fileName))
                )
            })
        let path = `/cluster`;

        navigate(path)
    }
    console.log(state.imageList)
    const rows = []
    for (let i = 0; i < state.apiData.length; i++) {
        const data = state.apiData[i]
        rows.push(data)
    }


    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleClose = () => {
        dispatch({ type: "SNACK_BAR_CLOSE" })
        dispatch({ type: "FETCH_SUCCESS_CLOSE" })
    };

    // const vertical = state.vertical;
    const horizontal = state.horizontal;
    const vertical = "bottom";

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
    const tableComp =
        <>
            < Box sx={{ width: '100%', marginTop: 8 }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <TableContainer>
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size='small'
                        >
                            <EnhancedTableHead
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                rowCount={rows.length}
                            />
                            <TableBody>
                                {stableSort(rows, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell sx={{ cursor: "pointer" }} onClick={() => routeChange(row.fileId)}>{row.fileId}</TableCell>
                                                <TableCell >{row.fileName}</TableCell>
                                                <TableCell align="right">{row.fileSize}</TableCell>
                                                <TableCell align="right">{row.totalPages}</TableCell>
                                                <TableCell align="right">{row.uploadedOn}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: 33 * emptyRows,
                                        }}
                                    >
                                        <TableCell colSpan={5} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Box >
            <Snackbar open={state.fetchSuccess} autoHideDuration={6000} onClose={handleClose}
                anchorOrigin={{ vertical, horizontal }}
                key={state.vertical + state.horizontal}>
                <Alert onClose={handleClose} severity="success" variant='filled'>
                    Table fetched successfully!
                </Alert>
            </Snackbar>
        </>

    const tableCompLoader = <CircularLoader />

    return (
        promiseInProgress ? tableCompLoader : (!tableErr ? tableComp :
            <Snackbar open={state.open} autoHideDuration={6000} onClose={handleClose}
                anchorOrigin={{ vertical, horizontal }}
                key={state.vertical + state.horizontal} >
                <Alert onClose={handleClose} severity="error" variant='filled'>
                    Something went wrong! Please try again
                </Alert>
            </Snackbar >)
    );
}
