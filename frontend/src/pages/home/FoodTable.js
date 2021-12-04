import * as React from 'react';
import moment from 'moment';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';
import Title from '../../shared/component/title';
import { DATE_TIME_FORMAT } from '../../shared/utils/constants';

export default function foodConsumedHistory({ rows = [] }) {
    return (
        <React.Fragment>
            <Title>Food Consumed History</Title>
            <Table size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell>Date/Time Consumed</TableCell>
                        <TableCell>Food Name</TableCell>
                        <TableCell>Is Cheat Food?</TableCell>
                        <TableCell align='right'>Calories</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>
                                {moment(row.timeConsumed).format(
                                    DATE_TIME_FORMAT,
                                )}
                            </TableCell>
                            <TableCell>{row.productName}</TableCell>
                            <TableCell>
                                {row.isCheatFood ? 'Yes' : 'No'}
                            </TableCell>
                            <TableCell align='right'>{row.calorie}</TableCell>
                        </TableRow>
                    ))}
                    {rows.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4}>No records found.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </React.Fragment>
    );
}
