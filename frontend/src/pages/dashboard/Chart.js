import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Label,
    ResponsiveContainer,
} from 'recharts';
import Title from '../../shared/component/title';

const Chart = ({ usersList = [], foodsList = [] }) => {
    const theme = useTheme();
    const [data, setData] = useState([]);
    useEffect(() => {
        const finalData = usersList.map((item) => {
            let totalCalories = 0;
            foodsList.forEach((food) => {
                if (food.creator.id === item.id) {
                    totalCalories += food.calorie;
                }
            });
            return {
                firstName: item.firstName,
                calorieConsumed: totalCalories,
            };
        });
        setData(finalData);
    }, [usersList, foodsList]);

    return (
        <React.Fragment>
            <Title>Today</Title>
            <ResponsiveContainer>
                <LineChart
                    data={data}
                    margin={{
                        top: 16,
                        right: 16,
                        bottom: 0,
                        left: 24,
                    }}>
                    <XAxis
                        dataKey='firstName'
                        stroke={theme.palette.text.secondary}
                        style={theme.typography.body2}
                    />
                    <YAxis
                        stroke={theme.palette.text.secondary}
                        style={theme.typography.body2}>
                        <Label
                            angle={270}
                            position='left'
                            style={{
                                textAnchor: 'middle',
                                fill: theme.palette.text.primary,
                                ...theme.typography.body1,
                            }}>
                            Calories Consumed
                        </Label>
                    </YAxis>
                    <Line
                        isAnimationActive={false}
                        type='monotone'
                        dataKey='calorieConsumed'
                        stroke={theme.palette.primary.main}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
};

export default React.memo(Chart);
