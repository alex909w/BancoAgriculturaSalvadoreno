import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Avatar,
  Paper
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export default function TipoMovimientoPage() {
  return (
    <Box sx={{ bgcolor: '#e0e0e0', minHeight: '100vh', p: 4 }}>
      <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
        {/* Encabezado */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img src="/logo.png" alt="Banco de Agricultura" width={64} />
            <Typography variant="h5" color="green">Banco de Agricultura</Typography>
          </Box>
          <Avatar><AccountCircleIcon /></Avatar>
        </Box>

        {/* Título */}
        <Typography variant="h6" align="center" gutterBottom>
          Selecciona que tipo de movimiento quieres realizar
        </Typography>

        {/* Opciones de acción */}
        <Grid container spacing={4} justifyContent="center" mt={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center', cursor: 'pointer', boxShadow: 3 }}>
              <PersonAddIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography fontWeight="bold">Registrar<br />Nuevo Cliente</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center', cursor: 'pointer', boxShadow: 3 }}>
              <MonetizationOnIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography fontWeight="bold">PRESTAMOS</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center', cursor: 'pointer', boxShadow: 3 }}>
              <ArrowDownwardIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography fontWeight="bold">TRANSACCIÓN</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
