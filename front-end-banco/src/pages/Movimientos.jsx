import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Avatar
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const cuentas = [
  { numero: '652732736823', saldo: 75.45 },
  { numero: '657687687686', saldo: 232.0 },
  { numero: '652799896343', saldo: 12.67 }
];

export default function MovimientoPage() {
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState(cuentas[0]);
  const [imprimir, setImprimir] = useState('si');

  return (
    <Box sx={{ bgcolor: '#e0e0e0', minHeight: '100vh', p: 4 }}>
      <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img src="/logo.png" alt="Banco de Agricultura" width={64} />
            <Typography variant="h5" color="green">Movimiento</Typography>
          </Box>
          <Avatar><AccountCircleIcon /></Avatar>
        </Box>

        {/* Contenido */}
        <Grid container spacing={4}>
          {/* Selección de cuentas */}
          <Grid item xs={12} md={6}>
            <Typography gutterBottom>Seleccione una cuenta:</Typography>
            {cuentas.map((cuenta) => (
              <Paper
                key={cuenta.numero}
                sx={{
                  p: 2,
                  mb: 2,
                  bgcolor: cuenta.numero === cuentaSeleccionada.numero ? '#ccc' : '#f5f5f5',
                  cursor: 'pointer'
                }}
                onClick={() => setCuentaSeleccionada(cuenta)}
              >
                <Typography variant="caption">Número de cuenta:</Typography>
                <Typography variant="h6">{cuenta.saldo.toFixed(2)} US</Typography>
                <Typography variant="caption" color="text.secondary">{cuenta.numero}</Typography>
              </Paper>
            ))}
          </Grid>

          {/* Monto y acciones */}
          <Grid item xs={12} md={6}>
            <Typography gutterBottom>MONTO</Typography>
            <Paper sx={{ p: 3, mb: 2, textAlign: 'center', fontSize: 24, fontWeight: 'bold' }}>
              {cuentaSeleccionada.saldo.toFixed(2)} US
            </Paper>

            <Typography gutterBottom>Imprimir comprobante</Typography>
            <FormControl component="fieldset">
              <RadioGroup row value={imprimir} onChange={(e) => setImprimir(e.target.value)}>
                <FormControlLabel value="si" control={<Radio />} label="Sí" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="contained" sx={{ bgcolor: 'green', color: '#fff' }}>
                RECARGAR
              </Button>
              <Button variant="contained" sx={{ bgcolor: 'darkred', color: '#fff' }}>
                RETIRAR
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
