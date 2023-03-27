import React from 'react';
import Typography from '@mui/material/Typography';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Container, Grid, IconButton, Input, Stack } from '@mui/material';
import JSZip from 'jszip';
import { Download, Link } from '@mui/icons-material';
import { Logo } from '../../../components/Elements/Logo';
import { APP_TITLE } from '../../../config';

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
const IconPatterns: Map<string, IconPattern> = new Map([
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
const Hero = ({ title }: { title: string }) => {
  return (
    <Box sx={{ bgcolor: 'background.paper', pt: 8, pb: 6 }} className="hero">
      <Container maxWidth="sm">
        <Stack sx={{ pt: 4 }} direction="row" spacing={2} justifyContent="center">
          <Logo width='4rem' height='4rem' />
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
  )
}

const Preview = ({ icons }: { icons: Icon[] }) => {
  return (
    <Container sx={{ py: 8 }} maxWidth="md">
      <Typography variant="h2" align="center" color="text.primary" gutterBottom>
        Preview
      </Typography>
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
                  <IconButton size="small" href={icon.url} target='_blank'>
                    <Link />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Container>
  )
}

const DownloadButton = ({ icons }: { icons: Icon[] }) => {
  const handleDownload = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    const zip = new JSZip()
    const promises = icons.map((icon) => {
      return fetch(icon.url)
        .then((response) => response.blob())
        .then((blob) => zip.file(icon.name, blob))
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

export const Home = () => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const nameInputRef = React.useRef<HTMLInputElement>(null);
  const [file, setImageFile] = React.useState<File | undefined>(undefined);
  const [icons, setIcons] = React.useState<Icon[]>([])

  React.useEffect(() => {
    if (!file) return;
    setIcons([]);
    IconPatterns.forEach((pattern, name) => {
      const image = new Image();
      image.onload = () => {
        const canvas = makeIconCanvas(image, pattern);
        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          setIcons((icons) => [...icons, { name: name, url: url, pattern: pattern }])
        }, `image/${pattern.type}`)
      }
      image.src = URL.createObjectURL(file);
    })
  }, [file])

  const makeIconCanvas = (image: HTMLImageElement, pattern: IconPattern) => {
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    canvas.width = pattern.size;
    canvas.height = pattern.size;
    ctx.drawImage(image, 0, 0, pattern.size, pattern.size);
    return canvas;
  }

  const handleBrowseFile = () => fileInputRef.current?.click();
  const handleFileChange = () => {
    const input = fileInputRef.current;
    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];
      setImageFile(file)
      if (nameInputRef.current) nameInputRef.current.value = file.name
    }
  }

  return (
    <>
      <Hero title={APP_TITLE} />
      <Container sx={{ py: 8 }} maxWidth="md">
        <Stack sx={{ pt: 4 }} direction="row" spacing={2} justifyContent="center">
          <Input type="file"
            inputRef={fileInputRef}
            style={{ display: 'none' }}
            inputProps={{ accept: 'image/jpeg, image/png' }}
            onChange={handleFileChange} />
          <Input inputRef={nameInputRef} type="text" readOnly />
          <Button variant="contained" onClick={handleBrowseFile}>BROWSE</Button>
          <DownloadButton icons={icons} />
        </Stack>
      </Container>
      <Preview icons={Array.from(IconPatterns).map(([name, _]) => {
        return icons.find((icon) => icon.name === name)!
      })} />
    </>
  )
}
