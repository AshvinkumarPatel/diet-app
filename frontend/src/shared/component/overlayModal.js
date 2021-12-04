import * as React from 'react';
import { Modal, Button, Box, Grid } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

export default function OverlayModal({
    handleClose,
    heading,
    message,
    isConfirmOverlay,
    handleYes,
}) {
    return (
        <Modal
            open={true}
            onClose={handleClose}
            aria-labelledby='parent-modal-title'
            aria-describedby='parent-modal-description'>
            <Box sx={{ ...style, width: 400 }}>
                <h2 id='parent-modal-title'>{heading}</h2>
                <p id='parent-modal-description'>{message}</p>
                <Grid container>
                    <Grid
                        item
                        xs={isConfirmOverlay ? 6 : 12}
                        textAlign='center'>
                        <Button variant='outlined' onClick={handleClose}>
                            {isConfirmOverlay ? 'No' : 'Ok'}
                        </Button>
                    </Grid>
                    {isConfirmOverlay && (
                        <Grid item xs={6} textAlign='center'>
                            <Button variant='contained' onClick={handleYes}>
                                Yes
                            </Button>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </Modal>
    );
}
