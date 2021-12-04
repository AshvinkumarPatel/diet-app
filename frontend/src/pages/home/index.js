import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
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
    TextField,
    Button,
} from '@mui/material';
import { DateRangePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';

import LeftNavigation from './LeftNavigation';
import FoodTable from './FoodTable';

import Copyright from '../../shared/component/copyright';
import HeaderNavigation from '../../shared/component/headerNavigation';
import { Drawer } from '../../shared/component/muiComponents';
import { DATE_FORMAT } from '../../shared/utils/constants';

const mdTheme = createTheme();

function DashboardContent() {
    const [open, setOpen] = useState(true);
    const { food } = useSelector((state) => state);
    const [filteredFoodsList, setFilteredFoodsList] = useState([]);
    const [selectedDateRange, setDateRangeFilter] = React.useState([
        null,
        null,
    ]);

    const applyFilter = () => {
        if (selectedDateRange[0] && selectedDateRange[1]) {
            const fromDate = moment(selectedDateRange[0]).format(DATE_FORMAT);
            const toDate = moment(selectedDateRange[1]).format(DATE_FORMAT);
            setFilteredFoodsList([
                ...food?.foodsListByUserId.filter((item) => {
                    const timeConsumed = moment(item.timeConsumed).format(
                        DATE_FORMAT,
                    );
                    return (
                        moment(timeConsumed).isSameOrAfter(fromDate) &&
                        moment(timeConsumed).isSameOrBefore(toDate)
                    );
                }),
            ]);
        }
    };

    const clearFilter = () => {
        setDateRangeFilter([null, null]);
        setFilteredFoodsList([...food.foodsListByUserId]);
    };

    const toggleDrawer = useCallback(() => {
        setOpen(!open);
    }, [setOpen, open]);

    useEffect(() => {
        setFilteredFoodsList([...food.foodsListByUserId]);
    }, [food.foodsListByUserId]);

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <HeaderNavigation />
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
                        <LeftNavigation />
                    </List>
                    <Divider />
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
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={5}>
                                            <LocalizationProvider
                                                dateAdapter={AdapterDateFns}>
                                                <DateRangePicker
                                                    startText='Day From'
                                                    endText='Day To'
                                                    value={selectedDateRange}
                                                    onChange={(newValue) => {
                                                        setDateRangeFilter(
                                                            newValue,
                                                        );
                                                    }}
                                                    renderInput={(
                                                        startProps,
                                                        endProps,
                                                    ) => (
                                                        <React.Fragment>
                                                            <TextField
                                                                {...startProps}
                                                            />
                                                            <Box sx={{ mx: 2 }}>
                                                                {' '}
                                                                to{' '}
                                                            </Box>
                                                            <TextField
                                                                {...endProps}
                                                            />
                                                        </React.Fragment>
                                                    )}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Button
                                                variant='contained'
                                                onClick={applyFilter}>
                                                Apply
                                            </Button>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Button
                                                variant='outlined'
                                                onClick={clearFilter}>
                                                Clear
                                            </Button>
                                        </Grid>
                                        <Grid item xs={1}></Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}>
                                    <FoodTable rows={filteredFoodsList} />
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
