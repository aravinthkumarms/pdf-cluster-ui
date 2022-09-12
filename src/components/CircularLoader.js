import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function CircularLoader() {
    return (
        <>
            <Box sx={{
                display: 'flex', justifyContent: "center", margin: '20%'
            }}>
                <CircularProgress size={100} thickness={2} sx={{ color: '#02a0c7' }} />
            </Box>
        </>
    );
}
