import { useColorScheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectProps } from '@mui/material/Select';

export default function ColorModeSelect(props: SelectProps) {
  const { mode, setMode } = useColorScheme();
  if (!mode) {
    return null;
  }
  return (
    <Select
      value={mode}
      onChange={(event) =>
        setMode(event.target.value as 'system' | 'light' | 'dark')
      }
      size="small"
      {...props}
    >
      <MenuItem value="system">Sistema</MenuItem>
      <MenuItem value="light">Claro</MenuItem>
      <MenuItem value="dark">Escuro</MenuItem>
    </Select>
  );
}
