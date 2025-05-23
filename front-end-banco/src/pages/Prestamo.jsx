import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  MenuItem,
  Select,
  Button,
  Avatar
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function NuevoPrestamoPage() {
  const [cobrosAutomaticos, setCobrosAutomaticos] = useState('si');
  const [seguroVida, setSeguroVida] = useState('si');
  const [tipoPrestamo, setTipoPrestamo] = useState('');
  const [cuentaVinculada, setCuentaVinculada] = useState('');

  return (
    <Box sx={{ bgcolor: '#e0e0e0', minHeight: '100vh', p: 4 }}>
      <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img src="/logo.png" alt="Banco de Agricultura" width={64} />
            <Typography variant="h5" color="green">Nuevo Préstamo</Typography>
          </Box>
          <Avatar><AccountCircleIcon /></Avatar>
        </Box>

        <Grid container spacing={4}>
          {/* Formulario */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Typography variant="caption">Tipo de préstamo*</Typography>
                <Select value={tipoPrestamo} onChange={(e) => setTipoPrestamo(e.target.value)} displayEmpty>
                  <MenuItem value=""><em>Seleccione</em></MenuItem>
                  <MenuItem value="agricola">Agrícola</MenuItem>
                  <MenuItem value="personal">Personal</MenuItem>
                </Select>
              </FormControl>

              <TextField fullWidth label="Monto de Préstamo" variant="outlined" sx={{ mb: 2 }} />

              <Typography gutterBottom>Cobros automáticos</Typography>
              <RadioGroup row value={cobrosAutomaticos} onChange={(e) => setCobrosAutomaticos(e.target.value)}>
                <FormControlLabel value="si" control={<Radio />} label="Sí" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <Typography variant="caption">Cuenta vinculada</Typography>
                <Select value={cuentaVinculada} onChange={(e) => setCuentaVinculada(e.target.value)} displayEmpty>
                  <MenuItem value=""><em>Seleccione</em></MenuItem>
                  <MenuItem value="cuenta1">Cuenta 1</MenuItem>
                  <MenuItem value="cuenta2">Cuenta 2</MenuItem>
                </Select>
              </FormControl>

              <TextField fullWidth label="Fecha de finalización" placeholder="__/__/____" sx={{ mb: 2 }} />

              <TextField
                fullWidth
                label="Firma de validación"
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />

              <Typography gutterBottom>Activar seguro de vida</Typography>
              <RadioGroup row value={seguroVida} onChange={(e) => setSeguroVida(e.target.value)}>
                <FormControlLabel value="si" control={<Radio />} label="Sí" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Paper>
          </Grid>

          {/* Información del cliente */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 1 }} />
              <Typography variant="subtitle1" fontWeight="bold">JOSE ALEXANDER RAMOS HERNANDEZ</Typography>
              <Box sx={{ textAlign: 'left', mt: 2 }}>
                <Typography><strong>TIPO DE CUENTA:</strong> PRESTAMISTA</Typography>
                <Typography><strong>ID. DE CLIENTE:</strong> 15093293JR</Typography>
                <Typography><strong>PROFESIÓN:</strong> AGRICULTOR</Typography>
                <Typography><strong>CUENTAS EN POSESIÓN:</strong> 2</Typography>
              </Box>
            </Paper>

            {/* Botones */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="contained" sx={{ bgcolor: 'white', border: '1px solid green', color: 'green' }}>
                ✔ Crear
              </Button>
              <Button variant="contained" sx={{ bgcolor: 'white', border: '1px solid red', color: 'red' }}>
                ✖ Cancelar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
