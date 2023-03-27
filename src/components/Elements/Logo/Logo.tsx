import { Box } from "@mui/system"
import logo from '../../../assets/logo.png';

export const Logo = ({ width, height }: { width: string, height: string }) => {
  return (
    <Box
      component="img"
      src={logo}
      alt="logo"
      sx={{ display: { xs: 'none', md: 'flex' }, width: width, height: height }} />
  )
}
