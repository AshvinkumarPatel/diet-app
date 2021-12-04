import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Typography from '@mui/material/Typography';
import Title from '../../shared/component/title';
import { DATE_LONG_FORMAT } from '../../shared/utils/constants';

const TotalCaloriesConsumed = ({ foodsList }) => {
    const [totalCalories, setTotalCalories] = useState(0);

    useEffect(() => {
        let calories = 0;
        foodsList.forEach((item) => {
            calories += item.calorie;
        });
        setTotalCalories(calories);
    }, [foodsList]);

    return (
        <React.Fragment>
            <Title>Total Calories</Title>
            <Typography component='p' variant='h4'>
                {totalCalories}
            </Typography>
            <Typography color='text.secondary' sx={{ flex: 1 }}>
                on {moment().format(DATE_LONG_FORMAT)}
            </Typography>
        </React.Fragment>
    );
};

export default React.memo(TotalCaloriesConsumed);
