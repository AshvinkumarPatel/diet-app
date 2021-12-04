import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import AssignmentIcon from '@mui/icons-material/Assignment';

const ReportsNavigation = ({ onSelectFilter }) => {
    return (
        <div>
            <ListSubheader inset>Saved reports</ListSubheader>
            <ListItem button onClick={() => onSelectFilter('all')}>
                <ListItemIcon>
                    <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary='All Days' />
            </ListItem>
            <ListItem button onClick={() => onSelectFilter('today')}>
                <ListItemIcon>
                    <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary='Today' />
            </ListItem>
            <ListItem button onClick={() => onSelectFilter('last 7 days')}>
                <ListItemIcon>
                    <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary='Last 7 Days' />
            </ListItem>
            <ListItem
                button
                onClick={() => onSelectFilter('older than 7 days')}>
                <ListItemIcon>
                    <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary='Older than 7 Days' />
            </ListItem>
        </div>
    );
};

export default ReportsNavigation;
