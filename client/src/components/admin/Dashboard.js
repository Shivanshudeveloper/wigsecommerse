import React, { useContext } from "react";
import { DataContext } from "./context/dataContext";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { mainListItems } from "./listItems";
import AddIcon from "@material-ui/icons/Add";
import queryString from "query-string";
import { API_SERVICE } from "../../config/URI";
import axios from "axios";
import { Alert, AlertTitle } from "@material-ui/lab";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import { v4 as uuid4 } from "uuid";
import Dropzone from "react-dropzone";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";

// Firebase
import { firestore, storage } from "../../Firebase/index";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
  pos: {
    marginBottom: 12,
    color: "#000000",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "3vh",
  },
  cardroot: {
    minWidth: 230,
  },
}));

export default function Dashboard({ location }) {
  const [currentData, setCurrentData] = useContext(DataContext);
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [name, setname] = React.useState(currentData?.name);
  const [price, setprice] = React.useState(currentData?.price);
  const [url, seturl] = React.useState(currentData?.url);
  const [category, setCategory] = React.useState(currentData?.category);
  const [file, setFile] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [openSnack, setOpenSnack] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState("");
  const [bookUploaded, setbookUploaded] = React.useState(false);

  const [rating, setrating] = React.useState(currentData.rating);
  const [brand, setbrand] = React.useState(currentData?.brand);
  const [instocks, setinstocks] = React.useState(currentData?.instocks);
  const [onsale, setonsale] = React.useState(currentData?.onsale);
  const [freeshipping, setfreeshipping] = React.useState(
    currentData?.freeshipping
  );
  const [freereturn, setfreereturn] = React.useState(currentData?.freereturn);
  const [shipfrom, setshipfrom] = React.useState(currentData?.shipfrom);
  const [length, setlength] = React.useState(currentData?.length);
  const [color, setcolor] = React.useState(currentData?.color);
  const [blackowned, setblackowned] = React.useState(currentData?.blackowned);
  const [producttype, setproducttype] = React.useState(
    currentData?.producttype
  );
  const [origin, setorigin] = React.useState(currentData?.origin);
  const [texture, settexture] = React.useState(currentData?.texture);
  const [basematerial, setbasematerial] = React.useState(
    currentData?.basematerial
  );
  const [lacetype, setlacetype] = React.useState(currentData?.lacetype);
  const [preplucked, setpreplucked] = React.useState(currentData?.preplucked);
  const [bleachedKnots, setbleachedKnots] = React.useState(
    currentData?.bleachedKnots
  );
  const [babyHairs, setbabyHairs] = React.useState(currentData?.babyHairs);
  const [parting, setparting] = React.useState(currentData?.parting);
  const [closureSize, setclosureSize] = React.useState(
    currentData?.closureSize
  );
  const [frontalSize, setfrontalSize] = React.useState(
    currentData?.frontalSize
  );
  const [density, setdensity] = React.useState(currentData?.density);

  React.useEffect(() => {
    if (file.length > 0) {
      onSubmit();
    } else {
      console.log("N");
    }
  }, [file]);

  const handleChangeCategory = (event) => {
    setCategory(event.target.value);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const handleClick = () => {
    setOpenSnack(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
  };

  const onSubmit = () => {
    if (file.length > 0) {
      file.forEach((file) => {
        const timeStamp = Date.now();
        var uniquetwoKey = uuid4();
        uniquetwoKey = uniquetwoKey + timeStamp;
        const uploadTask = storage
          .ref(`pictures/products/${uniquetwoKey}/${file.name}`)
          .put(file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            handleClick();
            setMessage(`Uploading ${progress} %`);
          },
          (error) => {
            setMessage(error);
            handleClick();
          },
          async () => {
            // When the Storage gets Completed
            const filePath = await uploadTask.snapshot.ref.getDownloadURL();
            handleClick();
            setMessage("File Uploaded");
            setDownloadUrl(filePath);
            setbookUploaded(true);
          }
        );
      });
    } else {
      setMessage("No File Selected Yet");
    }
  };

  const handleDrop = async (acceptedFiles) => {
    setFile(acceptedFiles.map((file) => file));
  };

  const clearForm = () => {
    setname("");
    setprice("");
    seturl("");
    setCategory("");
    setDownloadUrl("");
    setbookUploaded(false);
    setrating("");
    setbrand("");
    setinstocks("");
    setonsale("");
    setfreeshipping("");
    setfreereturn("");
    setshipfrom("");
    setlength("");
    setcolor("");
    setblackowned("");
    setproducttype("");
    setorigin("");
    settexture("");
    setbasematerial("");
    setlacetype("");
    setpreplucked("");
    setbleachedKnots("");
    setbabyHairs("");
    setparting("");
    setclosureSize("");
    setfrontalSize("");
    setdensity("");
  };

  const addProduct = () => {
    var uploadData = {
      name,
      url,
      rating,
      category,
      brand,
      instocks,
      onsale,
      freeshipping,
      freereturn,
      shipfrom,
      length,
      color,
      blackowned,
      producttype,
      origin,
      texture,
      basematerial,
      lacetype,
      preplucked,
      bleachedKnots,
      babyHairs,
      parting,
      closureSize,
      frontalSize,
      density,
      price,
      downloadUrl,
    };
    axios
      .post(`${API_SERVICE}/api/v1/main/addproduct`, uploadData)
      .then((response) => {})
      .catch((err) => console.log(err));
    // setTimeout(function () {
    //   window.location.href = "/admindashboard?a=s";
    // }, 1800);
  };

  const updateProduct = () => {
    const _id = currentData._id;
    var uploadData = {
      name,
      url,
      rating,
      category,
      brand,
      instocks,
      onsale,
      freeshipping,
      freereturn,
      shipfrom,
      length,
      color,
      blackowned,
      producttype,
      origin,
      texture,
      basematerial,
      lacetype,
      preplucked,
      bleachedKnots,
      babyHairs,
      parting,
      closureSize,
      frontalSize,
      density,
      downloadUrl,
      price,
    };
    axios
      .patch(`${API_SERVICE}/api/v1/main/editproduct/${_id}`, uploadData)
      .then((response) => {})
      .catch((err) => console.log(err));
  };

  return (
    <div className={classes.root}>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={openSnack}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            
            {currentData?.name?.length > 0 ? "Dashboard" : "Edit Product"}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>{mainListItems}</List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                required
                value={name}
                fullWidth
                label="Name"
                onChange={(event) => setname(event.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                // required
                fullWidth
                label="URL"
                value={url}
                onChange={(event) => seturl(event.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Rating Out of 10"
                value={rating}
                onChange={(event) => setrating(event.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select-outlined"
                value={category}
                onChange={handleChangeCategory}
                fullWidth
              >
                <MenuItem value="brazilian">Brazilian Hair</MenuItem>
                <MenuItem value="cambodian">Cambodian Hair</MenuItem>
                <MenuItem value="european">European Hair</MenuItem>
                <MenuItem value="indian">Indian Hair</MenuItem>
                <MenuItem value="malaysian">Malaysian Hair</MenuItem>
                <MenuItem value="mongolian">Mongolian Hair</MenuItem>
                <MenuItem value="peruvian">Peruvian Hair</MenuItem>
                <MenuItem value="vietnamese">Vietnamese Hair</MenuItem>
                <MenuItem value="synthetic">Synthetic Hair</MenuItem>
                <MenuItem value="bodywave">Body Wave</MenuItem>
                <MenuItem value="deepwave">Deep Wave</MenuItem>
                <MenuItem value="loosedeepwave">Loose Deep Wave</MenuItem>
                <MenuItem value="loosewave">Loose Wave</MenuItem>
                <MenuItem value="naturalwave">Natural Wave</MenuItem>
                <MenuItem value="kinkycurly">Kinky Curly</MenuItem>
                <MenuItem value="jerrycurly">Jerry Curl</MenuItem>
                <MenuItem value="deepcurly">Deep Curly</MenuItem>
                <MenuItem value="kinkystright">Kinky Straight</MenuItem>
                <MenuItem value="afrohair">Afro Hair</MenuItem>
                <MenuItem value="44closures">4 x 4 Closures</MenuItem>
                <MenuItem value="55closures">5 x 5 Closures</MenuItem>
                <MenuItem value="66closures">6 x 6 Closures</MenuItem>
                <MenuItem value="77closures">7 x 7 Closures</MenuItem>
                <MenuItem value="134frontals">13 x 4 Frontals</MenuItem>
                <MenuItem value="136frontals">13 x 6 Frontals</MenuItem>
                <MenuItem value="360frontals">360 Frontals</MenuItem>
                <MenuItem value="singlebundle">Single Bundle</MenuItem>
                <MenuItem value="2bundle">2 Bundles</MenuItem>
                <MenuItem value="3bundle">3 Bundles</MenuItem>
                <MenuItem value="4bundle">4 Bundles</MenuItem>
                <MenuItem value="3bw44c">3 Bundles with 4 x 4 closure</MenuItem>
                <MenuItem value="3bw55c">3 Bundles with 5 x 5 closure</MenuItem>
                <MenuItem value="3bw66c">3 Bundles with 6 x 6 closure</MenuItem>
                <MenuItem value="3bw134c">
                  3 Bundles with 13 x 4 frontal
                </MenuItem>
                <MenuItem value="3bw136c">
                  3 Bundles with 13 x 6 frontal
                </MenuItem>
                <MenuItem value="4bw44c">4 Bundles with 4 x 4 closure</MenuItem>
                <MenuItem value="4bw55c">4 Bundles with 5 x 5 closure</MenuItem>
                <MenuItem value="4bw66c">4 Bundles with 6 x 6 closure</MenuItem>
                <MenuItem value="4bw134c">
                  4 Bundles with 13 x 4 frontal
                </MenuItem>
                <MenuItem value="4bw136c">
                  4 Bundles with 13 x 6 frontal
                </MenuItem>
                <MenuItem value="44cw">4 x 4 Closure Wigs</MenuItem>
                <MenuItem value="55cw">5 x 5 Closure Wigs</MenuItem>
                <MenuItem value="66cw">6 x 6 Closure Wigs</MenuItem>
                <MenuItem value="lacefrontwigs">Lace Front Wigs</MenuItem>
                <MenuItem value="fulllacewigs">Full Lace Wigs</MenuItem>
                <MenuItem value="360">360</MenuItem>
                <MenuItem value="upartwigs">U Part Wigs</MenuItem>
                <MenuItem value="clipins">Clip Ins</MenuItem>
                <MenuItem value="ponytails">Ponytails</MenuItem>
                <MenuItem value="microlinks">Microlinks</MenuItem>
                <MenuItem value="nanorings">Nano rings</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                // required
                fullWidth
                label="Brand"
                value={brand}
                onChange={(event) => setbrand(event.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel id="demo-simple-select-label">In Stock</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select-outlined"
                fullWidth
                value={instocks}
                onChange={(event) => setinstocks(event.target.value)}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6}>
              <InputLabel id="demo-simple-select-label">On Sale</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select-outlined"
                fullWidth
                value={onsale}
                onChange={(event) => setonsale(event.target.value)}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6}>
              <InputLabel id="demo-simple-select-label">
                Free Shipping
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select-outlined"
                fullWidth
                value={freeshipping}
                onChange={(event) => setfreeshipping(event.target.value)}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6}>
              <InputLabel id="demo-simple-select-label">Free Return</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select-outlined"
                fullWidth
                value={freereturn}
                onChange={(event) => setfreereturn(event.target.value)}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6}>
              <InputLabel id="demo-simple-select-label">Ship From</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select-outlined"
                fullWidth
                value={shipfrom}
                onChange={(event) => setshipfrom(event.target.value)}
              >
                <MenuItem value="UK">UK</MenuItem>
                <MenuItem value="USA">USA</MenuItem>
                <MenuItem value="China">China</MenuItem>
                <MenuItem value="France">France</MenuItem>
                <MenuItem value="Belgium">Belgium</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                // required
                fullWidth
                label="Length"
                value={length}
                onChange={(event) => setlength(event.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
            <InputLabel id="demo-simple-select-label">Color</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select-outlined"
                  fullWidth
                  value={color}
                  onChange={(event) => setcolor(event.target.value)}
                >
                  <MenuItem value="natural black">natural black</MenuItem>
                  <MenuItem value="natural brown">natural brown</MenuItem>
                  <MenuItem value="Blonde">Blonde</MenuItem>
                  <MenuItem value="Burgundy">Burgundy</MenuItem>
                  <MenuItem value="Ginger">Ginger</MenuItem>
                </Select>
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                // required
                fullWidth
                label="Price"
                value={price}
                onChange={(event) => setprice(event.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel id="demo-simple-select-label">Black Owned</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select-outlined"
                fullWidth
                value={blackowned}
                onChange={(event) => setblackowned(event.target.value)}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6}>
              <InputLabel id="demo-simple-select-label">
                Product Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select-outlined"
                fullWidth
                value={producttype}
                onChange={(event) => setproducttype(event.target.value)}
              >
                <MenuItem value="Closures">Closures</MenuItem>
                <MenuItem value="Frontals">Frontals</MenuItem>
                <MenuItem value="Wigs">Wigs</MenuItem>
                <MenuItem value="Bundles">Bundles</MenuItem>
                <MenuItem value="Bundles_and_Closures">Bundles & Closures</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6}>
            <InputLabel id="demo-simple-select-label">Origin</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select-outlined"
                  fullWidth
                  value={origin}
                  onChange={(event) => setorigin(event.target.value)}
                >
                  <MenuItem value="China">China</MenuItem>
                  <MenuItem value="India">India</MenuItem>
                  <MenuItem value="Vietnam">Vietnam</MenuItem>
                </Select>
            </Grid>
            <Grid item xs={6}>
              <InputLabel id="demo-simple-select-label">Texture</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select-outlined"
                fullWidth
                value={texture}
                onChange={(event) => settexture(event.target.value)}
              >
                <MenuItem value="Body Wave">Body Wave</MenuItem>
                <MenuItem value="Deep Wave">Deep Wave</MenuItem>
                <MenuItem value="Loose Deep Wave">Loose Deep Wave</MenuItem>
                <MenuItem value="Loose Wave">Loose Wave</MenuItem>
                <MenuItem value="Natural Wave">Natural Wave</MenuItem>
                <MenuItem value="Kinky Curly">Kinky Curly</MenuItem>
                <MenuItem value="Jerry Curl">Jerry Curl</MenuItem>
                <MenuItem value="Deep Curly">Deep Curly</MenuItem>
                <MenuItem value="Kinky Straight">Kinky Straight</MenuItem>
                <MenuItem value="Afro Hair">Afro Hair</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6}>
              <InputLabel id="demo-simple-select-label">
                Base Material
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select-outlined"
                fullWidth
                value={basematerial}
                onChange={(event) => setbasematerial(event.target.value)}
              >
                <MenuItem value="Silk">Silk</MenuItem>
                <MenuItem value="Silicone">Silicone</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6}>
              <InputLabel id="demo-simple-select-label">Lace Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select-outlined"
                fullWidth
                value={lacetype}
                onChange={(event) => setlacetype(event.target.value)}
              >
                <MenuItem value="Light Brown">Light Brown</MenuItem>
                <MenuItem value="Medium Brown">Medium Brown</MenuItem>
                <MenuItem value="Transparent">Transparent</MenuItem>
                <MenuItem value="HD">HD</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6}>
              <InputLabel id="demo-simple-select-label">Preplucked</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select-outlined"
                fullWidth
                value={preplucked}
                onChange={(event) => setpreplucked(event.target.value)}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6}>
              <InputLabel id="demo-simple-select-label">Bleached Knots</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select-outlined"
                  fullWidth
                  value={bleachedKnots}
                  onChange={(event) => setbleachedKnots(event.target.value)}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
            </Grid>
            <Grid item xs={6}>
              <InputLabel id="demo-simple-select-label">Baby Hairs</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select-outlined"
                fullWidth
                value={babyHairs}
                onChange={(event) => setbabyHairs(event.target.value)}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6}>
            <InputLabel id="demo-simple-select-label">Closure Size</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select-outlined"
                  fullWidth
                  value={closureSize}
                  onChange={(event) => setclosureSize(event.target.value)}
                >
                  <MenuItem value="4 x 4">4 x 4</MenuItem>
                  <MenuItem value="5 x 5">5 x 5</MenuItem>
                  <MenuItem value="6 x 6">6 x 6</MenuItem>
                  <MenuItem value="7 x 7">7 x 7</MenuItem>
                </Select>
            </Grid>
            <Grid item xs={6}>
            <InputLabel id="demo-simple-select-label">Frontal Size</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select-outlined"
                  fullWidth
                  value={frontalSize}
                  onChange={(event) => setfrontalSize(event.target.value)}
                >
                  <MenuItem value="13 x 4">13 x 4</MenuItem>
                  <MenuItem value="13 x 6">13 x 6</MenuItem>
                  <MenuItem value="360">360</MenuItem>
                </Select>
            </Grid>
            <Grid item xs={6}>
            <InputLabel id="demo-simple-select-label">Density</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select-outlined"
                  fullWidth
                  value={density}
                  onChange={(event) => setdensity(event.target.value)}  
                >
                  <MenuItem value="130%">130%</MenuItem>
                  <MenuItem value="150%">150%</MenuItem>
                  <MenuItem value="180%">180%</MenuItem>
                  <MenuItem value="200%">200%</MenuItem>
                </Select>
            </Grid>

            <center>
              <Dropzone onDrop={handleDrop}>
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps({ className: "dropzone" })}>
                    <input {...getInputProps()} />
                    <Button size="large" color="primary" variant="contained">
                      Upload Image
                    </Button>
                  </div>
                )}
              </Dropzone>
            </center>
            {currentData.name === undefined ? (
              <Button
                disabled={!bookUploaded}
                onClick={addProduct}
                color="secondary"
                style={{ marginTop: "4vh", height: "8vh" }}
                variant="contained"
                fullWidth
                component={Link}
                to="/admindashboard/view"
              >
                Submit
              </Button>
            ) : (
              <Button
                disabled={!bookUploaded}
                component={Link}
                to="/admindashboard/view"
                onClick={updateProduct}
                color="secondary"
                style={{ marginTop: "4vh", height: "8vh" }}
                variant="contained"
                fullWidth
              >
                Update
              </Button>
            )}
            <Button
              onClick={clearForm}
              style={{ marginTop: "4vh" }}
              variant="contained"
              fullWidth
            >
              Clear
            </Button>
          </Grid>
        </Container>
      </main>
    </div>
  );
}
