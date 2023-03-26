import './App.css';
import React from 'react';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Box, Button, Card, CardActions, CardContent, CardMedia, Container, CssBaseline, Grid, IconButton, Input, Link, Menu, Stack, Toolbar } from '@mui/material';
import JSZip from 'jszip';
import { AccountCircle, Download, GitHub } from '@mui/icons-material';
import logo from './logo.png';

// Types
type IconPattern = {
  size: number,
  ext: string,
  type: string,
}
type Icon = {
  name: string,
  url: string,
  pattern: IconPattern,
}

// Constraints
const theme = createTheme({
  palette: {
    primary: {
      main: '#1c1c1c',
    },
  },
});
const iconPatterns: Map<string, IconPattern> = new Map([
  ['favicon.ico', { size: 16, ext: 'ico', type: 'image/x-icon' }],
  ['favicon-16x16.png', { size: 16, ext: 'png', type: 'image/png' }],
  ['favicon-32x32.png', { size: 32, ext: 'png', type: 'image/png' }],
  ['favicon-96x96.png', { size: 96, ext: 'png', type: 'image/png' }],
  ['favicon-128x128.png', { size: 128, ext: 'png', type: 'image/png' }],
  ['favicon-192x192.png', { size: 192, ext: 'png', type: 'image/png' }],
  ['favicon-512x512.png', { size: 512, ext: 'png', type: 'image/png' }],
  ['apple-touch-icon.png', { size: 180, ext: 'png', type: 'image/png' }],
  ['android-chrome-192x192.png', { size: 192, ext: 'png', type: 'image/png' }],
])

// Function Components
const LogoImage = ({width, height}: { width: string, height: string }) => {
  return (
    <Box
      component="img"
      src={logo}
      alt="logo"
      sx={{ display: { xs: 'none', md: 'flex' }, width: width, height: height }} />
  )
}

const Header = ({ title }: { title: string }) => {
  return (
    <AppBar position="relative">
      <Toolbar>
        <Grid justifyContent={'space-between'} container spacing={24}>
          <Grid item>
            <Typography variant="h6" color="inherit" display='flex' alignItems='center' flexWrap='wrap' noWrap>
              <LogoImage width='2rem' height='2rem' /> {title}
            </Typography>
          </Grid>
          <Grid item>
            <Button variant='contained' href='https://github.com/corrupt952/picturnize' startIcon={<GitHub />}>
              GitHub
            </Button>
            <Button variant='contained' href='https://zuki.dev' startIcon={<AccountCircle />}>
              Developer
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
      <Typography variant="body2" color="textSecondary" align="center">
        {`@ 2023- K@zuki. All rights reserved.`}
      </Typography>
    </Box>
  )
}

const PreviewGridView = ({ icons }: { icons: Icon[] }) => {
  return (
    <Grid container spacing={4}>
      {icons.map((icon) => {
        if (!icon || !icon.name) return null;
        const pattern = icon.pattern;

        return (
          <Grid item key={icon.name} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia component="img" image={icon.url} alt={icon.name} className="preview-image" />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {icon.name}
                </Typography>
                <Typography>
                  {`Size: ${pattern.size}x${pattern.size}`}
                </Typography>
                <Typography>
                  {`Format: ${pattern.type}`}
                </Typography>
              </CardContent>
              <CardActions >
                <IconButton size="small" href={icon.url} download={icon.name} >
                  <Download />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        )
      })}
    </Grid>
  )
}

const DownloadButton = ({ icons }: { icons: Icon[] }) => {
  const handleDownload = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    const zip = new JSZip()
    const promises = icons.map((icon) => {
      return fetch(icon.url)
        .then((response) => response.blob())
        .then((blob) => {
          zip.file(icon.name, blob)
        })
    })
    Promise.all(promises).then(() => {
      zip.generateAsync({ type: 'blob' }).then((blob) => {
        const date = new Date();
        const dateStr = date.toISOString().replace(/[^0-9]/g, '').slice(0, -5);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `icons-${dateStr}.zip`;
        link.click();
      })
    })
  }

  return (
    <Button variant="contained" onClick={handleDownload}>
      DOWNLOAD ALL
    </Button>
  )
}

const App = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [icons, setIcons] = React.useState<Icon[]>([])

  const handleBrowse = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    const fileInput = document.getElementById('ImageAttachment');
    if (fileInput) {
      fileInput.click();
    }
  }

  const handleSelectedFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const fileInput = document.getElementById('ImageAttachment') as HTMLInputElement;

    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      setFile(file);
      const nameInput = document.getElementById('ImageAttachmentName') as HTMLInputElement;
      nameInput.value = file.name;

      setIcons([]);
      iconPatterns.forEach((pattern, name) => {
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          canvas.width = pattern.size;
          canvas.height = pattern.size;
          ctx.drawImage(image, 0, 0, pattern.size, pattern.size);
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              setIcons((icons) => {
                let _icons = [...icons, { name: name, url: url, pattern: pattern }];
                _icons.sort((a, b) => a.name > b.name ? -1 : 1);
                return _icons;
              })
            }
          }, `image/${pattern.type}`)
        }
        image.src = URL.createObjectURL(file);
      })
    }
  }

  const title = 'Picturnize';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header title={title} />
      <main>
        <Box sx={{ bgcolor: 'background.paper', pt: 8, pb: 6 }} className="cover">
          <Container maxWidth="sm">
            <Stack sx={{ pt: 4 }} direction="row" spacing={2} justifyContent="center">
              <LogoImage width='4rem' height='4rem' />
              <Typography component="h1" variant="h2" align="center" color="white" gutterBottom>
                {title}
              </Typography>
            </Stack>
            <Typography variant="h5" align="center" color="white" paragraph>
              Generate the icons needed to create the service.
              <br />
              Communication to the server does not involve uploading files, but converting files on the browser.
            </Typography>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          <Stack sx={{ pt: 4 }} direction="row" spacing={2} justifyContent="center">
            <Input type="file"
              id="ImageAttachment"
              style={{ display: 'none' }}
              inputProps={{ accept: 'image/jpeg, image/png' }}
              onChange={handleSelectedFile} />
            <Input type="text" id="ImageAttachmentName" readOnly />
            <Button variant="contained" onClick={handleBrowse}>BROWSE</Button>
            <DownloadButton icons={icons} />
          </Stack>
        </Container>
        <Container sx={{ py: 8 }} maxWidth="md">
          <Typography variant="h4" align="center" color="text.primary" gutterBottom>
            Preview
          </Typography>
        </Container>
        <Container sx={{ py: 8 }} maxWidth="md">
          <PreviewGridView icons={Array.from(iconPatterns).map(([name, _]) => {
            return icons.find((icon) => icon.name === name)!
          })} />
        </Container>
      </main>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
