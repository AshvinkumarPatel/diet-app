import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
    Box,
    Toolbar,
    List,
    Divider,
    IconButton,
    Container,
    Grid,
    Paper,
} from '@mui/material';
import { ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';

import LeftNavigation from './LeftNavigation';
import ReportsNavigation from './ReportsNavigation';
import FoodsTable from './FoodsTable';
import Chart from './Chart';
import TotalCalories from './TotalCalories';

import Copyright from '../../shared/component/copyright';
import HeaderNavigation from '../../shared/component/headerNavigation';
import { Drawer } from '../../shared/component/muiComponents';
import { DATE_FORMAT } from '../../shared/utils/constants';
import OverlayModal from '../../shared/component/overlayModal';

import { resetUpdateFoodStatus, deleteFoodItems } from '../../reducers/food';

const mdTheme = createTheme();

function DashboardContent() {
    const [open, setOpen] = useState(true);
    const [foodDetails, setFoodDetails] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] =
        useState(false);
    const [deleteFoodIds, setDeleteFoodIds] = useState([]);
    const [whichOperation, setWhichOperation] = useState('create');
    const { user, food } = useSelector((state) => state);
    const [, setFilter] = useState('all');
    const dispatch = useDispatch();
    const [filteredFoodsList, setFilteredFoodsList] = useState([]);

    const toggleDrawer = useCallback(() => {
        setOpen(!open);
    }, [setOpen, open]);

    useEffect(() => {
        setFilteredFoodsList([...food?.foodsList]);
    }, [food?.foodsList]);

    const handleSelectFilter = useCallback(
        (filter) => {
            setFilter(filter);
            if (filter === 'all') {
                setFilteredFoodsList([...food?.foodsList]);
            } else if (filter === 'today') {
                setFilteredFoodsList([
                    ...food?.foodsList.filter((item) => {
                        return moment(item.timeConsumed).isSame(
                            moment(),
                            'day',
                        );
                    }),
                ]);
            } else if (filter === 'last 7 days') {
                const fromDate = moment().add('-7', 'days').format(DATE_FORMAT);
                const toDate = moment().format(DATE_FORMAT);
                setFilteredFoodsList([
                    ...food?.foodsList.filter((item) => {
                        const timeConsumed = moment(item.timeConsumed).format(
                            DATE_FORMAT,
                        );
                        return (
                            moment(timeConsumed).isSameOrAfter(fromDate) &&
                            moment(timeConsumed).isSameOrBefore(toDate)
                        );
                    }),
                ]);
            } else if (filter === 'older than 7 days') {
                const toDate = moment().add('-7', 'days').format(DATE_FORMAT);
                setFilteredFoodsList([
                    ...food?.foodsList.filter((item) => {
                        const timeConsumed = moment(item.timeConsumed).format(
                            DATE_FORMAT,
                        );
                        return moment(timeConsumed).isBefore(toDate);
                    }),
                ]);
            }
        },
        [setFilter, food?.foodsList],
    );

    const [addEditFoodDialog, showAddEditFoodDialog] = useState(false);

    const handleEditFood = useCallback(
        (foodDetails) => {
            dispatch(resetUpdateFoodStatus());
            setWhichOperation('edit');
            setFoodDetails(foodDetails);
            showAddEditFoodDialog(true);
        },
        [dispatch, setWhichOperation],
    );

    const handleDeleteFoodConfirmation = useCallback((foodIds) => {
        setDeleteFoodIds(foodIds);
        setShowDeleteConfirmationDialog(true);
    }, []);

    const handleDeleteFoodEntries = useCallback(() => {
        setShowDeleteConfirmationDialog(false);
        dispatch(deleteFoodItems({ foodIds: deleteFoodIds }));
    }, [dispatch, deleteFoodIds]);

    useEffect(() => {
        if (food?.foodDeleteStatus) {
            if (
                !(
                    food.foodDeleteStatus === 'PENDING' ||
                    food.foodDeleteStatus === 'SUCCESS'
                )
            ) {
                setErrorMessage(food.foodDeleteStatus);
            } else if (food.foodDeleteStatus === 'SUCCESS') {
                setShowSuccessDialog(true);
            }
        }
    }, [food?.foodDeleteStatus, dispatch]);

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <HeaderNavigation />
                {showDeleteConfirmationDialog && (
                    <OverlayModal
                        handleClose={() => {
                            setShowDeleteConfirmationDialog(false);
                            setDeleteFoodIds([]);
                        }}
                        isConfirmOverlay={true}
                        heading='Confirm'
                        message='Are you sure you want to delete these entries?'
                        handleYes={handleDeleteFoodEntries}
                    />
                )}
                {errorMessage && (
                    <OverlayModal
                        handleClose={() => {
                            setErrorMessage('');
                        }}
                        heading='Error'
                        message={errorMessage}
                    />
                )}
                {showSuccessDialog && (
                    <OverlayModal
                        handleClose={() => {
                            setShowSuccessDialog(false);
                        }}
                        heading='Success'
                        message='Food items has been deleted successfully.'
                    />
                )}
                <Drawer variant='permanent' open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}>
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List>
                        <LeftNavigation
                            addEditFoodDialog={addEditFoodDialog}
                            showAddEditFoodDialog={showAddEditFoodDialog}
                            foodDetails={foodDetails}
                            whichOperation={whichOperation}
                        />
                    </List>
                    <Divider />
                    <List>
                        <ReportsNavigation
                            onSelectFilter={handleSelectFilter}
                        />
                    </List>
                </Drawer>
                <Box
                    component='main'
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}>
                    <Toolbar />
                    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={8} lg={9}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: 240,
                                    }}>
                                    <Chart
                                        usersList={user?.usersList}
                                        foodsList={filteredFoodsList}
                                    />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4} lg={3}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: 240,
                                    }}>
                                    <TotalCalories
                                        foodsList={filteredFoodsList}
                                    />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}>
                                    <FoodsTable
                                        rows={filteredFoodsList}
                                        onEditFood={handleEditFood}
                                        onDeleteFood={
                                            handleDeleteFoodConfirmation
                                        }
                                    />
                                </Paper>
                            </Grid>
                        </Grid>
                        <Copyright sx={{ pt: 4 }} />
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default function Dashboard() {
    return <DashboardContent />;
}
