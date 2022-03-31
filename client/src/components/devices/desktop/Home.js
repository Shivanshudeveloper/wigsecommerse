import React from "react";
import Navigation from "../../static/Navigation";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import CancelIcon from "@material-ui/icons/Cancel";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/themes/splide-default.min.css";
import Slider from "@material-ui/core/Slider";
import Checkbox from "@material-ui/core/Checkbox";
import Box from "@material-ui/core/Box";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import axios from "axios";
import CryptoJS from "crypto";
import Footer from "../../static/Footer";
// API Service
import { API_SERVICE, SECRET_KEY } from "../../../config/URI";
import { firestore } from "../../../Firebase/index";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import MuiAlert from "@material-ui/lab/Alert";
import queryString from "query-string";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const ex3 = {
  width: "100%",
  height: "125px",
  overflow: "auto",
};

const ex28 = {
  height: "120vh",
  overflow: "auto",
  marginBottom: "2vh",
};

const useStyles = makeStyles((theme) => ({
  scrollBar: {
    '&::-webkit-scrollbar': {
      width: '0.4em'
    },
    '&::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      outline: '1px solid slategrey'
    }
  },
  filterDiv:{
    display: 'flex',
    margin:"10px",
    alignItems: 'center',
    flexWrap: 'wrap',
    

  },
  
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 600,
    marginTop: "10px",
  },
  filterSection:{
    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
    borderRadius:"15px",
    padding: "15px",
  },
  
  priceroot: {
    width: 300,
  },
  
  slideroot: {
    margin: "10px",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  
    padding: "10px 15px",
    paddingBottom:"0px",
    fontWeight: "bold",
    fontSize: "20px",
    fontWeight:"300px",
  },
  undercardroot: {
    padding: "10px",

  },
  cardroot: {
    maxWidth: 300,

    minWidth: 300,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
    borderRadius:"15px",

  },buttonStyle: {
    width: "100%",
    border: "2px solid gray",
    margin: "10px",
    borderRadius:"10px",

    

  },
  
  gridroot: {
    flexGrow: 1,
    
  },
  outercardroot: {
    flexGrow: "0",
    maxWidth: "33%",
    flexBasis: "25%",
    
  },
  inputfield:{
    padding: "5px 45px",
    width:"100%",
 
    borderRadius: "7px",
  }
}));

function valuetext(value) {
  return `${value}°C`;
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const ProductList = ({ addWishlist, addItem, product }) => {
  const classes = useStyles();
  var mykey = CryptoJS.createCipher("aes-128-cbc", SECRET_KEY);
  var eE = mykey.update(product._id, "utf8", "hex");
  eE += mykey.final("hex");

  return (
    <Grid item xs={3} className={classes.outercardroot}>
      <Card className={classes.cardroot} variant="outlined">
        <CardContent className={classes.undercardroot}>
          <center>
            <a href={`/product?i=${eE}`}>
              <img
                style={{ width: "230px", height: "230px",objectFit:"cover", }}
                src={product.images[0]}
                alt="product image"
              />
            </a>
          </center>
          <Typography className={classes.pos}>{product.name}</Typography>
          <Typography
            style={{ textAlign: "center" }}
            variant="body2"
            component="p"
          >
            {product.about}
          </Typography>
        </CardContent>

        <div style={{ padding: "4px",width:"275px" }}>
          <Button className={classes.buttonStyle} onClick={() => addItem(product)} >
            Add to Compare
          </Button>
          <br />
          <Button
            onClick={() => addWishlist(product)}
            className={classes.buttonStyle}
           
            
          >
            Add to Wishlist
          </Button>
        </div>
      </Card>
    </Grid>
  );
};

const Home = ({ location }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [value, setValue] = React.useState([0, 37]);
  const [products, setProducts] = React.useState([]);
  const [message, setmessage] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [filter, setfilter] = React.useState("");
  const [load, setLoad] = React.useState(true);
  const [brands, setBrands] = React.useState([]);
  const [priceRef, setPriceRef] = React.useState(false);

  const [openDialog, setOpenDialog] = React.useState(false);
  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  React.useEffect(function () {
    const call = async function () {
      axios.get(`${API_SERVICE}/api/v1/main/productsbrands`).then(res => setBrands(new Set([...res.data])));
    }

    call();
  }, []);

  React.useEffect(() => {
    if (load === false) return;

    const q = queryString.parse(window.location?.search);
    setfilter(q);
    if (q) {
      axios
        .get(`${API_SERVICE}/api/v1/main/productsfilters/${JSON.stringify(q)}`)
        .then((response) => {
          setProducts(response.data);
        })
        .catch((err) => console.log(err));
    } else {
      axios
        .get(`${API_SERVICE}/api/v1/main/products`)
        .then((response) => {
          
          setProducts(response.data);
        })
        .catch((err) => console.log(err));
    }
    setLoad(false);
  }, [load]);

  const getAllProducts = async () => {
    await axios
      .get(`${API_SERVICE}/api/v1/main/products`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((err) => console.log(err));
  };
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const primaryOptions = {
    type: "loop",
    height: 350,
    perPage: 1,
    perMove: 1,
    gap: "1rem",
    autoplay: true,
    pagination: false,
  };

  const [state, setState] = React.useState({
    checkedA: false,
    checkedB: false,
    checkedF: false,
    checkedG: false,
  });

  const handleChangeOptions = (event) => {
    console.log({ state });
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const addItem = (product) => {
    var uid = sessionStorage.getItem("userId");
    var docRef = firestore.collection("cart").doc(uid);
    docRef
      .get()
      .then(function (doc) {
        if (doc.exists) {
          var items = doc.data().items;
          if (items === 4) {
            handleClickOpenDialog();
            setmessage(
              "You can only add 4 items max in the compare cart list."
            );
          } else {
            // Send Item to the Card in Database
            var uploadData = {
              productId: product._id,
              userId: uid,
              product,
            };
            axios
              .post(`${API_SERVICE}/api/v1/main/additemtocart`, uploadData)
              .then((response) => {
                if (response.status === 200) {
                  handleClick();
                  setmessage("Item Added for Compare");
                  items = items + 1;
                  docRef.set(
                    {
                      items,
                    },
                    { merge: true }
                  );
                } else if (response.status === 201) {
                  handleClick();
                  setmessage("Item Already Added for Compare");
                }
              })
              .catch((err) => console.log(err));
          }
        } else {
          docRef.set(
            {
              items: 1,
            },
            { merge: true }
          );
          var uploadData = {
            productId: product._id,
            userId: uid,
            product,
          };
          axios
            .post(`${API_SERVICE}/api/v1/main/additemtocart`, uploadData)
            .then((response) => {
              if (response.status === 200) {
                handleClick();
                setmessage("Item Added for Compare");
              }
            })
            .catch((err) => console.log(err));
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  };

  const addWishlist = (product) => {
    var uid = sessionStorage.getItem("userId");
    var uploadData = {
      productId: product._id,
      userId: uid,
      product,
    };
    axios
      .post(`${API_SERVICE}/api/v1/main/addtowishlistitemcart`, uploadData)
      .then((response) => {
        if (response.status === 200) {
          handleClick();
          setmessage("Item Added to Wish List");
        }
      })
      .catch((err) => console.log(err));
  };

  const showProductList = () => {
    const filteredProducts = products.filter(function (product) {
      return product
    });

    return filteredProducts.map((product) => {
      return (
        <ProductList
          addWishlist={addWishlist}
          addItem={addItem}
          product={product}
          key={product._id}
        />
      );
    });
  };

  const [searchValue, setSearchValue] = React.useState("");

  const searchProducts = async () => {
    await axios
      .get(`${API_SERVICE}/api/v1/main/search/${searchValue}`)
      .then((response) => {
        
        setProducts(response.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">
          {"Compare Cart Limit Exceeded?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            style={{ color: "#000" }}
            id="alert-dialog-description"
          >
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Okay
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
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
      >
        <Alert onClose={handleClose} severity="success">
          {message}
        </Alert>
      </Snackbar>
      <CssBaseline />
      <Navigation />
      <center>
        <Paper className={classes.root}>
          <InputBase
            className={classes.input}
            placeholder="Search Products"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <IconButton
            className={classes.iconButton}
            aria-label="search"
            onClick={searchProducts}
          >
            <SearchIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setSearchValue("");
              getAllProducts();
            }}
            className={classes.iconButton}
            aria-label="search"
          >
            <CancelIcon />
          </IconButton>
        </Paper>
        <Paper className={classes.slideroot}>
          <Splide options={primaryOptions}>
            <SplideSlide>
              <img
                width="100%"
                src="https://images.unsplash.com/photo-1558077107-4d42e0ddc8dc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                alt="Image 1"
              />
            </SplideSlide>
            <SplideSlide>
              <img
                width="100%"
                src="https://images.unsplash.com/photo-1605378251083-c5e7620330c0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                alt="Image 2"
              />
            </SplideSlide>
          </Splide>
        </Paper>
      </center>
      <Container style={{ marginTop: "20px",maxWidth:"2000px" }}>
        <div className={classes.gridroot}>
          <Grid container spacing={5}>
            <Grid style={ex28} item xs={3} >
              <Card
                style={{ minWidth: "100%", padding: "30px" }}
                variant="outlined"
                className={classes.filterSection}
              >
                <h3>FILTER BY</h3>
                <hr
                  style={{
                    borderTop: "3px solid #000000",
                    marginTop: "6px",
                    marginBottom: "6px",
                  }}
                />
                <div>
                  <h4>Brands</h4>
                  <div style={{ display: 'flex',margin:"10px", alignItems: 'center', flexWrap: 'wrap' }}>
                    {Array.from(brands).map(brand => (
                      <div style={{ margin: '0 10px' }} key={brand + (Math.random() * 10000)}>
                        <input type="checkbox" defaultChecked={filter?.brand == brand} onClick={function (e) {
                          if (e.target.checked) {
                            const filters = filter;
                            filters.brand = brand;

                            window.history.pushState("Random URL", Math.random() * 10000, "?" + queryString.stringify(filters));
                            setfilter(filters);
                            setLoad(true);
                          } else {
                            const filters = filter;
                            delete filters.brand;

                            window.history.pushState("Random URL", Math.random() * 10000, "?" + queryString.stringify(filters));
                            setfilter(filters);
                            setLoad(true);
                          }
                        }} style={{ marginRight: '5px' }} />
                        <span>{brand}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <hr
                  style={{
                    borderTop: "1px solid #000000",
                    marginTop: "6px",
                    marginBottom: "6px",
                  }}
                />
                <div>
                  <h4>Color</h4>
                  <div style={{ display: 'flex', margin:"10px",alignItems: 'center', flexWrap: 'wrap' }}>
                    {Array.from(new Set(["Jet black", "Natural black", "Brown", "Blonde", "Red", "Burgundy"])).map(color => (
                      <div style={{ margin: '0 10px' }} key={color + (Math.random() * 10000)}>
                        <input type="checkbox" defaultChecked={filter?.color == color.toLowerCase()} onClick={function (e) {
                          if (e.target.checked) {
                            const filters = filter;
                            filters.color = color.toLowerCase();

                            window.history.pushState("Random URL", Math.random() * 10000, "?" + queryString.stringify(filters));
                            setfilter(filters);
                            setLoad(true);
                          } else {
                            const filters = filter;
                            delete filters.color;

                            window.history.pushState("Random URL", Math.random() * 10000, "?" + queryString.stringify(filters));
                            setfilter(filters);
                            setLoad(true);
                          }
                        }} style={{ marginRight: '5px' }} />
                        <span>{color}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <hr
                  style={{
                    borderTop: "1px solid #000000",
                    marginTop: "6px",
                    marginBottom: "6px",
                  }}
                />
                <div>
                  <h4>Ship From</h4>
                  <div style={{ display: 'flex',margin:"10px", alignItems: 'center', flexWrap: 'wrap' }}>
                    {Array.from(new Set(["UK", "USA", "China", "France"])).map(shipfrom => (
                      <div style={{ margin: '0 10px' }} key={shipfrom + (Math.random() * 10000)}>
                        <input type="checkbox" defaultChecked={filter?.shipfrom == shipfrom} onClick={function (e) {
                          if (e.target.checked) {
                            const filters = filter;
                            console.log(filter)
                            filters.shipfrom = shipfrom;

                            window.history.pushState("Random URL", Math.random() * 10000, "?" + queryString.stringify(filters));
                            setfilter(filters);
                            setLoad(true);
                          } else {
                            const filters = filter;
                            delete filters.shipfrom;

                            window.history.pushState("Random URL", Math.random() * 10000, "?" + queryString.stringify(filters));
                            setfilter(filters);
                            setLoad(true);
                          }
                        }} style={{ marginRight: '5px' }} />
                        <span>{shipfrom}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <hr
                  style={{
                    borderTop: "1px solid #000000",
                    marginTop: "6px",
                    marginBottom: "6px",
                  }}
                />
                <div>
                  <h4>Free Shipping</h4>
                  <div style={{ display: 'flex', margin:"10px",alignItems: 'center', flexWrap: 'wrap' }}>
                    {Array.from(new Set(["Yes"])).map(freeshipping => (
                      <div style={{ margin: '0 10px' }} key={freeshipping + (Math.random() * 10000)}>
                        <input type="checkbox" defaultChecked={filter?.freeshipping == freeshipping} onClick={function (e) {
                          if (e.target.checked) {
                            const filters = filter;
                            filters.freeshipping = freeshipping;

                            window.history.pushState("Random URL", Math.random() * 10000, "?" + queryString.stringify(filters));
                            setfilter(filters);
                            setLoad(true);
                          } else {
                            const filters = filter;
                            delete filters.freeshipping;

                            window.history.pushState("Random URL", Math.random() * 10000, "?" + queryString.stringify(filters));
                            setfilter(filters);
                            setLoad(true);
                          }
                        }} style={{ marginRight: '5px' }} />
                        <span>{freeshipping}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <hr
                  style={{
                    borderTop: "1px solid #000000",
                    marginTop: "6px",
                    marginBottom: "6px",
                  }}
                />
                <div>
                  <h4>Free Return</h4>
                  <div className={classes.filterDiv} style={{ display: 'flex',margin:"10px", alignItems: 'center', flexWrap: 'wrap' }}>
                    {Array.from(new Set(["Yes"])).map(freereturn => (
                      <div style={{ margin: '0 10px' }} key={freereturn + (Math.random() * 10000)}>
                        <input type="checkbox" defaultChecked={filter?.freereturn == freereturn} onClick={function (e) {
                          if (e.target.checked) {
                            const filters = filter;
                            filters.freereturn = freereturn;

                            window.history.pushState("Random URL", Math.random() * 10000, "?" + queryString.stringify(filters));
                            setfilter(filters);
                            setLoad(true);
                          } else {
                            const filters = filter;
                            delete filters.freereturn;

                            window.history.pushState("Random URL", Math.random() * 10000, "?" + queryString.stringify(filters));
                            setfilter(filters);
                            setLoad(true);
                          }
                        }} style={{ marginRight: '5px' }} />
                        <span>{freereturn}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <hr
                  style={{
                    borderTop: "1px solid #000000",
                    marginTop: "6px",
                    marginBottom: "6px",
                  }}
                />
                <div>
                  <h4>On Sale</h4>
                  <div style={{ display: 'flex', margin:"10px",alignItems: 'center', flexWrap: 'wrap' }}>
                    {Array.from(new Set(["Yes"])).map(onsale => (
                      <div style={{ margin: '0 10px' }} key={onsale + (Math.random() * 10000)}>
                        <input type="checkbox" defaultChecked={filter?.onsale == onsale} onClick={function (e) {
                          if (e.target.checked) {
                            const filters = filter;
                            filters.onsale = onsale;

                            window.history.pushState("Random URL", Math.random() * 10000, "?" + queryString.stringify(filters));
                            setfilter(filters);
                            setLoad(true);
                          } else {
                            const filters = filter;
                            delete filters.onsale;

                            window.history.pushState("Random URL", Math.random() * 10000, "?" + queryString.stringify(filters));
                            setfilter(filters);
                            setLoad(true);
                          }
                        }} style={{ marginRight: '5px' }} />
                        <span>{onsale}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <hr
                  style={{
                    borderTop: "1px solid #000000",
                    marginTop: "6px",
                    marginBottom: "6px",
                  }}
                />
                <div>
                  <h4>In Stock</h4>
                  <div style={{ display: 'flex', margin:"10px", alignItems: 'center', flexWrap: 'wrap' }}>
                    {Array.from(new Set(["Yes"])).map(instocks => (
                      <div style={{ margin: '0 10px' }} key={instocks + (Math.random() * 10000)}>
                        <input type="checkbox" defaultChecked={filter?.instocks == instocks} onClick={function (e) {
                          if (e.target.checked) {
                            const filters = filter;
                            filters.instocks = instocks;

                            window.history.pushState("Random URL", Math.random() * 10000, "?" + queryString.stringify(filters));
                            setfilter(filters);
                            setLoad(true);
                          } else {
                            const filters = filter;
                            delete filters.instocks;

                            window.history.pushState("Random URL", Math.random() * 10000, "?" + queryString.stringify(filters));
                            setfilter(filters);
                            setLoad(true);
                          }
                        }} style={{ marginRight: '5px' }} />
                        <span>{instocks}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <hr
                  style={{
                    borderTop: "1px solid #000000",
                    marginTop: "6px",
                    marginBottom: "6px",
                  }}
                />
                <div>
                  <h4>Length</h4>
                  <div style={{ display: 'flex',margin:"10px", alignItems: 'center', flexWrap: 'wrap' }}>
                    {Array.from(new Set(["Very short (5-7”)", "Short (6-10”)", "Medium (12-14”)", "Long (16-18”)", "Extra Long (20-22”)", "Super long (24+”)"])).map(lengths => (
                      <div style={{ margin: '0 10px' }} key={lengths + (Math.random() * 10000)}>
                        <input type="checkbox" defaultChecked={filter?.length == lengths} onClick={function (e) {
                          if (e.target.checked) {
                            const filters = filter;
                            filters.length = lengths;

                            window.history.pushState("Random URL", Math.random() * 10000, "?" + queryString.stringify(filters));
                            setfilter(filters);
                            setLoad(true);
                          } else {
                            const filters = filter;
                            delete filters.length;

                            window.history.pushState("Random URL", Math.random() * 10000, "?" + queryString.stringify(filters));
                            setfilter(filters);
                            setLoad(true);
                          }
                        }} style={{ marginRight: '5px' }} />
                        <span>{lengths}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <hr
                  style={{
                    borderTop: "1px solid #000000",
                    marginTop: "6px",
                    marginBottom: "6px",
                  }}
                />
                <div>
                  <h4>Price</h4>
                  <div className={classes.filterDiv}>
                    <input onChange={(e) => {
                      if (!e.target.checked) {
                        const filters = filter;
                        delete filters.price;

                        window.history.pushState("Random URL", Math.random() * 10000, "?" + queryString.stringify(filters));
                        setfilter(filters);
                        setLoad(true);
                      } else {
                        const filters = filter;
                        filters.price = filter.price || 50;

                        window.history.pushState("Random URL", Math.random() * 10000, "?" + queryString.stringify(filters));
                        setfilter(filters);
                        setLoad(true);
                      }
                      setPriceRef(e.target.checked)
                    }}
                      type="checkbox"></input>
                    <Slider
                      size="small"
                      min={0}
                      max={100}
                      disabled={priceRef != true ? true : false}
                      defaultValue={filter?.price || 50}
                      onChange={function (e, val) {
                        const filters = filter;
                        filters.price = val;

                        window.history.pushState("Random URL", Math.random() * 10000, "?" + queryString.stringify(filters));
                        setfilter(filters);
                        setLoad(true);
                      }}
                      aria-label="Small"
                      valueLabelDisplay="auto"
                    />
                  </div>
                </div>
                <hr
                  style={{
                    borderTop: "1px solid #000000",
                    marginTop: "6px",
                    marginBottom: "6px",
                  }}
                />
                      <h3>Category Filter</h3>
                      <hr
                        style={{
                          borderTop: "3px solid #000000",
                          marginTop: "6px",
                          marginBottom: "6px",
                        }}
                      />
                      <div>
                        <h4>
                          
                        </h4>
                        <hr
                          style={{
                            borderTop: "0.5px solid #808080",
                            marginTop: "2px",
                            marginBottom: "2px",
                          }}
                        />
                        {
                          ["Brazilian Hair", "Cambodian Hair", "European Hair", "Indian Hair", "Malaysian Hair", "Mongolian Hair", "Peruvian Hair", "Vietnamese Hair", "Synthetic Hair"].map(type => {
                            return <><h4 style={{ margin: '10px',fontWeight:"600px" }}>{type} - </h4>
                            <h5 style={{ margin: '10px',fontWeight:"300px" }}>1) Product Type</h5>

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                                <div style={{ margin: '0 10px',width:"100%" }}>
                                <select name="" id="" className={classes.inputfield} onChange={(e)=>{
                                  const producttype = e.target.value;
                                 
                                 
                                  const filters = filter;
                                  const filters2 = filter;
                                  filters.producttype = producttype;
                                  const changedtype=type.substring(0, type.indexOf(' '))
                                  filters2.category = changedtype.toLowerCase();
                                
                                  
                                 

                                  window.history.pushState("Random URL", Math.random() * 10000, "?" + queryString.stringify(filters),Math.random() * 10000, "?" + queryString.stringify(filters));
                     
                                  setfilter(filters);
                                  setLoad(true);
                                }}>
                                  <option value="Closures">Closures</option>
                                  <option value="Frontals">Frontals</option>
                                  <option value="Wigs">Wigs</option>
                                  <option value="Bundles">Bundles</option>
                                  <option value="Bundles and closure">Bundles and closure</option>

                                </select>
                                  
                                </div>
                            </div>
                            <h5 style={{ margin: '10px',fontWeight:"300px" }}>2) Texture</h5>

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                                <div style={{ margin: '0 10px',width:"100%" }}>
                                <select name="" id="" className={classes.inputfield} onChange={(e)=>{
                                  const texture = e.target.value;
                                  console.log(texture)
                                 
                                 
                                  const filters = filter;
                                  const filters2 = filter;
                                  filters.texture = texture;
                                  const changedtype=type.substring(0, type.indexOf(' '))
                                  filters2.category = changedtype.toLowerCase();
                                
                                  
                                 

                                  window.history.pushState("Random URL", Math.random() * 10000, "?" + queryString.stringify(filters),Math.random() * 10000, "?" + queryString.stringify(filters));
                     
                                  setfilter(filters);
                                  setLoad(true);
                                }}>
                                  <option value="Body Wave">Body Wave</option>
                                  <option value="Deep Wave">Deep Wave</option>
                                  <option value="Loose Deep Wave">Loose Deep Wave</option>
                                  <option value="Loose Wave">Loose Wave</option>
                                  <option value="Natural Wave">Natural Wave</option>
                                  <option value="Kinky Curly">Kinky Curly</option>
                                  <option value="Deep Curly">Deep Curly</option>
                                  <option value="Afro Hair">Afro Hair</option>
                                  
  
                                </select>
                                  
                                </div>
                            </div>
                              </>
                          })
                        }
                      </div>
                      <hr
                        style={{
                          borderTop: "1px solid #000000",
                          marginTop: "6px",
                          marginBottom: "6px",
                        }}
                      />
                      <div>
                        <h4>Hair Texture</h4>
                        <hr
                          style={{
                            borderTop: "0.5px solid #808080",
                            marginTop: "2px",
                            marginBottom: "2px",
                          }}
                        />
                        {
                          ["Body Wave", "Deep Wave", "Loose Deep Wave", "Loose Wave", "Natural Wave", "Kinky Wave", "Jerry Wave", "Deep Wave", "Kinky Straight", "Afro Hair"].map(type => {
                            return <>
                                  <h4 style={{ margin: '10px',fontWeight:"600px" }}>{type} - </h4>
                                  <h5 style={{ margin: '10px',fontWeight:"300px" }}>1) Product Type</h5>

                                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                                      <div style={{ margin: '0 10px' ,width:"100%"}}>
                                      <select name="" id="" className={classes.inputfield} onChange={(e)=>{
                                        const producttype = e.target.value;
                                        console.log(producttype)
                                       
                                       
                                        const filters = filter;
                                        const filters2 = filter;
                                        filters.producttype = producttype;
                                        const changedtype=type
                                        filters2.texture = changedtype
                                      
                                        
                                       
      
                                        window.history.pushState("Random URL", Math.random() * 10000, "?" + queryString.stringify(filters),Math.random() * 10000, "?" + queryString.stringify(filters));
                           
                                        setfilter(filters);
                                        setLoad(true);
                                      }}>
                                        <option value="Closures">Closures</option>
                                        <option value="Frontals">Frontals</option>
                                        <option value="Wigs">Wigs</option>
                                        <option value="Bundles">Bundles</option>
                                        <option value="Bundles and closure">Bundles and closure</option>

                                      </select>
                                        
                                      </div>
                                  </div>
                                  <h5 style={{ margin: '10px',fontWeight:"300px" }}>2) orgin</h5>

                                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                                      <div style={{ margin: '0 10px' ,width:"100%"}}>
                                      <select name="" id="" className={classes.inputfield} onChange={(e)=>{
                                        const origin = e.target.value;
                                        console.log(origin)
                                       
                                       
                                        const filters = filter;
                                        const filters2 = filter;
                                        filters.origin = origin;
                                        const changedtype=type
                                        filters2.texture = changedtype
                                      
                                        
                                       
      
                                        window.history.pushState("Random URL", Math.random() * 10000, "?" + queryString.stringify(filters),Math.random() * 10000, "?" + queryString.stringify(filters));
                           
                                        setfilter(filters);
                                        setLoad(true);
                                      }}>
                                        <option value="China">China</option>
                                        <option value="India">India</option>
                                        <option value="Vietnam">Vietnam</option>
        
                                      </select>
                                        
                                      </div>
                                  </div>
                            
                              </>
                          })
                        }
                      </div>
                      <hr
                        style={{
                          borderTop: "1px solid #000000",
                          marginTop: "6px",
                          marginBottom: "6px",
                        }}
                      />
                      <div>
                        <h4>Closures</h4>
                        <hr
                          style={{
                            borderTop: "0.5px solid #808080",
                            marginTop: "2px",
                            marginBottom: "2px",
                          }}
                        />
                        {
                          ["4*4", "5*5", "6*6", "7*7"].map(type => {
                            return <><h5 style={{ margin: '10px 0px' }} >{type}</h5>
                             
                              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                                  <div style={{ margin: '0 10px',width:"100%" }}>
                                  <select name="" id="" className={classes.inputfield} onChange={(e)=>{
                                        const origin = e.target.value;
                                        console.log(origin)
                                       
                                       
                                        const filters = filter;
                                        const filters2 = filter;
                                        filters.origin = origin;
                                        const changedtype=type
                                        filters2.closureSize = changedtype
                                      
                                        
                                       
      
                                        window.history.pushState("Random URL", Math.random() * 10000, "?" + queryString.stringify(filters),Math.random() * 10000, "?" + queryString.stringify(filters));
                           
                                        setfilter(filters);
                                        setLoad(true);
                                      }}>
                                    <option value="volvo">Origin</option>
                                    <option value="saab">Texture</option>
                                    <option value="mercedes">Base Material</option>
                                    <option value="audi">Lace Type</option>
                                    <option value="audi">Preplucked</option>
                                    <option value="audi">Bleached knots</option>
                                    <option value="audi">Bleached knots</option>
                                    <option value="audi">Parting</option>
                                  </select>
                                  </div>
                              </div>
                                
                              </>
                          })
                        }
                      </div>
                      <hr
                        style={{
                          borderTop: "1px solid #000000",
                          marginTop: "6px",
                          marginBottom: "6px",
                        }}
                      />
                      <div>
                        <h4>Frontals</h4>
                        <hr
                          style={{
                            borderTop: "0.5px solid #808080",
                            marginTop: "2px",
                            marginBottom: "2px",
                          }}
                        />
                        {
                          ["13*4", "13*6", "360"].map(type => {
                            return <><h5 style={{ margin: '10px 0px' }} >{type}</h5>
                             
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                                <div style={{ margin: '0 10px',width:"100%" }}>
                                <select name="" id="" className={classes.inputfield}>
                                  <option value="volvo">Origin</option>
                                  <option value="saab">Texture</option>
                                  <option value="mercedes">Base Material</option>
                                  <option value="audi">Lace Type</option>
                                  <option value="audi">Preplucked</option>
                                  <option value="audi">Bleached knots</option>
                                  <option value="audi">Bleached knots</option>
                                  <option value="audi">Parting</option>
                                </select>
                                </div>
                            </div></>
                          })
                        }
                      </div>
                      <hr
                        style={{
                          borderTop: "1px solid #000000",
                          marginTop: "6px",
                          marginBottom: "6px",
                        }}
                      />
                      <div>
                        <h4>Bundles With Closures</h4>
                        <hr
                          style={{
                            borderTop: "0.5px solid #808080",
                            marginTop: "2px",
                            marginBottom: "2px",
                          }}
                        />
                        {
                          ["4*4 & Single Bundle", "5*5 & Single Bundle", "6*6 & Single Bundle", "7*7 & Single Bundle",
                            "4*4 & 2 Bundles", "5*5 & 2 Bundles", "6*6 & 2 Bundles", "7*7 & 2 Bundles",
                            "4*4 & 3 Bundles", "5*5 & 3 Bundles", "6*6 & 3 Bundles", "7*7 & 3 Bundles",
                            "4*4 & 4 Bundles", "5*5 & 4 Bundles", "6*6 & 4 Bundles", "7*7 & 4 Bundles"
                          ].map(type => {
                            return <><h5 style={{ margin: '10px 0px' }} >{type}</h5>
                             
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                                <div style={{ margin: '0 10px',width:"100%" }}>
                                <select name="" id="" className={classes.inputfield}>
                                  <option value="volvo">Origin</option>
                                  <option value="saab">Texture</option>
                                  <option value="mercedes">Base Material</option>
                                  <option value="audi">Lace Type</option>
                                  <option value="audi">Preplucked</option>
                                  <option value="audi">Bleached knots</option>
                                  <option value="audi">Bleached knots</option>
                                  <option value="audi">Parting</option>
                                </select>
                                </div>
                            </div></>
                          })
                        }
                      </div>
                      <hr
                        style={{
                          borderTop: "1px solid #000000",
                          marginTop: "6px",
                          marginBottom: "6px",
                        }}
                      />
                      <div>
                        <h4>Bundles</h4>
                        <hr
                          style={{
                            borderTop: "0.5px solid #808080",
                            marginTop: "2px",
                            marginBottom: "2px",
                          }}
                        />
                        {
                          ["Single Bundle", "2 Bundles", "3 Bundles", "4 Bundles"].map(type => {
                            return <><h4 style={{ margin: '10px',fontWeight:"600px" }}>{type} - </h4>
                            <h5 style={{ margin: '10px',fontWeight:"300px" }}>1) Origin</h5>

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                                <div style={{ margin: '0 10px',width:"100%" }}>
                                <select name="" id="" className={classes.inputfield} onChange={(e)=>{
                                  const origin = e.target.value;
                                  console.log(origin)
                                 
                                 
                                  const filters = filter;
                                  const filters2 = filter;
                                  filters.origin = origin;
                                  const changedtype=type
                                  filters2.category = changedtype
                                
                                  
                                 

                                  window.history.pushState("Random URL", Math.random() * 10000, "?" + queryString.stringify(filters),Math.random() * 10000, "?" + queryString.stringify(filters));
                     
                                  setfilter(filters);
                                  setLoad(true);
                                }}>
                                  <option value="China">China</option>
                                        <option value="India">India</option>
                                        <option value="Vietnam">Vietnam</option>

                                </select>
                                  
                                </div>
                            </div>
                            <h5 style={{ margin: '10px',fontWeight:"300px" }}>2) Texture</h5>

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                                <div style={{ margin: '0 10px',width:"100%" }}>
                                <select name="" id="" className={classes.inputfield} onChange={(e)=>{
                                  const texture = e.target.value;
                                  console.log(texture)
                                 
                                 
                                  const filters = filter;
                                  const filters2 = filter;
                                  filters.texture = texture;
                                  const changedtype=type
                                  filters2.category = changedtype
                                
                                  
                                 

                                  window.history.pushState("Random URL", Math.random() * 10000, "?" + queryString.stringify(filters),Math.random() * 10000, "?" + queryString.stringify(filters));
                     
                                  setfilter(filters);
                                  setLoad(true);
                                }}>
                                  <option value="Body Wave">Body Wave</option>
                                  <option value="Deep Wave">Deep Wave</option>
                                  <option value="Loose Deep Wave">Loose Deep Wave</option>
                                  <option value="Loose Wave">Loose Wave</option>
                                  <option value="Natural Wave">Natural Wave</option>
                                  <option value="Kinky Curly">Kinky Curly</option>
                                  <option value="Deep Curly">Deep Curly</option>
                                  <option value="Afro Hair">Afro Hair</option>
                                  
  
                                </select>
                                  
                                </div>
                            </div></>
                          })
                        }
                      </div>
                      <hr
                        style={{
                          borderTop: "1px solid #000000",
                          marginTop: "6px",
                          marginBottom: "6px",
                        }}
                      />
                      <div>
                        <h4>Wigs</h4>
                        <hr
                          style={{
                            borderTop: "0.5px solid #808080",
                            marginTop: "2px",
                            marginBottom: "2px",
                          }}
                        />
                        {
                          ["U Part"].map(type => {
                            return <><h5>{type}</h5>
                              
                              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                                <div style={{ margin: '10px 0px',width:"100%" }}>
                                <select name="" id="" className={classes.inputfield}>
                                  <option value="volvo">Origin</option>
                                  <option value="saab">Texture</option>
                                 
                                </select>
                                </div>
                            </div>
                             </>
                          })
                        }
                        {

                          ["Closure Wings", "Frontal Wings"].map(type => {
                              return <><h5 >{type}</h5>
                        
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                                <div style={{ margin: '10px 0px',width:"100%" }}>
                                <select name="" id="" className={classes.inputfield}>
                                  <option value="volvo">Origin</option>
                                  <option value="saab">Texture</option>
                                  <option value="mercedes">Base Material</option>
                                  <option value="audi">Lace Type</option>
                                  <option value="audi">Preplucked</option>
                                  <option value="audi">Bleached knots</option>
                                  <option value="audi">Bleached knots</option>
                                  <option value="audi">Parting</option>
                                </select>
                                </div>
                            </div>
                           </>
                        })
                        }
                      </div>
                      <hr
                        style={{
                          borderTop: "1px solid #000000",
                          marginTop: "6px",
                          marginBottom: "6px",
                        }}
                      />
                      <div>
                        <h4>More Extensions</h4>
                        <hr
                          style={{
                            borderTop: "0.5px solid #808080",
                            marginTop: "2px",
                            marginBottom: "2px",
                          }}
                        />
                        {
                          ["Clip Ins", "Ponytails", "Microlinks", "Nano Rings"].map(type => {
                            return <><h4 style={{ margin: '10px',fontWeight:"600px" }}>{type} - </h4>
                            <h5 style={{ margin: '10px',fontWeight:"300px" }}>1) Origin</h5>

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                                <div style={{ margin: '0 10px',width:"100%" }}>
                                <select name="" id="" className={classes.inputfield} onChange={(e)=>{
                                  const origin = e.target.value;
                                  console.log(origin)
                                 
                                 
                                  const filters = filter;
                                  const filters2 = filter;
                                  filters.origin = origin;
                                  const changedtype=type
                                  filters2.category = changedtype
                                
                                  
                                 

                                  window.history.pushState("Random URL", Math.random() * 10000, "?" + queryString.stringify(filters),Math.random() * 10000, "?" + queryString.stringify(filters));
                     
                                  setfilter(filters);
                                  setLoad(true);
                                }}>
                                  <option value="China">China</option>
                                        <option value="India">India</option>
                                        <option value="Vietnam">Vietnam</option>

                                </select>
                                  
                                </div>
                            </div>
                            <h5 style={{ margin: '10px',fontWeight:"300px" }}>2) Texture</h5>

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                                <div style={{ margin: '0 10px' ,width:"100%"}}>
                                <select name="" id="" className={classes.inputfield} onChange={(e)=>{
                                  const texture = e.target.value;
                                  console.log(origin)
                                 
                                 
                                  const filters = filter;
                                  const filters2 = filter;
                                  filters.texture = texture;
                                  const changedtype=type
                                  filters2.category = changedtype
                                
                                  
                                 

                                  window.history.pushState("Random URL", Math.random() * 10000, "?" + queryString.stringify(filters),Math.random() * 10000, "?" + queryString.stringify(filters));
                     
                                  setfilter(filters);
                                  setLoad(true);
                                }}>
                                  <option value="Body Wave">Body Wave</option>
                                  <option value="Deep Wave">Deep Wave</option>
                                  <option value="Loose Deep Wave">Loose Deep Wave</option>
                                  <option value="Loose Wave">Loose Wave</option>
                                  <option value="Natural Wave">Natural Wave</option>
                                  <option value="Kinky Curly">Kinky Curly</option>
                                  <option value="Deep Curly">Deep Curly</option>
                                  <option value="Afro Hair">Afro Hair</option>
                                  
  
                                </select>
                                  
                                </div>
                            </div></>
                          })
                        }
                        <hr
                        style={{
                          borderTop: "1px solid #000000",
                          marginTop: "6px",
                          marginBottom: "6px",
                        }}
                      />
                      </div>
                      <div>
                        <h4>Closure Wigs</h4>
                        <hr
                          style={{
                            borderTop: "0.5px solid #808080",
                            marginTop: "2px",
                            marginBottom: "2px",
                          }}
                        />
                        {
                          ["4 x 4 Closure Wigs", "5 x 5 Closure Wigs", "6 x 6 Closure Wigs"].map(type => {
                            return <>
        
                            <h5 style={{ margin: '10px' }}>{type}</h5>
                            
                              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                                  <div style={{ margin: '0 10px' ,width:"100%"}}>
                                  <select name="" id="" className={classes.inputfield} onChange={(e)=>{
                                    const value = e.target.value;
                                    console.log(value)
                                    console.log(type)
                                  }}>
                                    <option value="Origin">Origin</option>
                                    <option value="Texture">Texture</option>
                                    <option value="Lace Type">Lace Type</option>
                                    <option value="Bleached knots">Bleached knots</option>
                                    <option value="Baby hairs">Baby hairs</option>
                                    <option value="Parting">Parting</option>
                                    <option value="Density">Density</option>
                                  </select>
                                    
                                  </div>
                              </div></>
                          })
                        }
                      </div>
                      <hr
                        style={{
                          borderTop: "1px solid #000000",
                          marginTop: "6px",
                          marginBottom: "6px",
                        }}
                      />
                      <div>
                        <h4>Frontal Wigs</h4>
                        <hr
                          style={{
                            borderTop: "0.5px solid #808080",
                            marginTop: "2px",
                            marginBottom: "2px",
                          }}
                        />

                            <h5 style={{ margin: '10px' }}>Lace Front Wigs</h5>
                              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                                  <div style={{ margin: '0 10px',width:"100%" }}>
                                  <select name="" id="" className={classes.inputfield}>
                                    <option value="volvo">Origin</option>
                                    <option value="saab">Texture</option>
                                    <option value="mercedes">Lace Type</option>
                                    <option value="audi">Frontal size</option>
                                    <option value="audi">Preplucked</option>
                                    <option value="audi">Bleached knots</option>
                                    <option value="audi">Baby hairs</option>
                                    <option value="audi">Density</option>
                                  </select>
                                  </div>
                              </div>

                          {
                          ["Full Lace Wigs","360"].map(type => {
                            return <>
        
                            <h5 style={{ margin: '10px' }}>{type}</h5>
                            
                              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                                  <div style={{ margin: '0 10px',width:"100%" }}>
                                  <select name="" id="" className={classes.inputfield} >
                                    <option value="volvo">Origin</option>
                                    <option value="saab">Texture</option>
                                    <option value="mercedes">Lace Type</option>
                                    <option value="audi">Preplucked</option>
                                    <option value="audi">Bleached knots</option>
                                    <option value="audi">Baby hairs</option>
                                    <option value="audi">Density</option>
                                  </select>
                                    
                                  </div>
                              </div></>
                          })
                        }
                      </div>
                      <hr
                        style={{
                          borderTop: "1px solid #000000",
                          marginTop: "6px",
                          marginBottom: "6px",
                        }}
                      />
                      

              </Card>
              <div style={{marginTop: "20px"}}></div>
            </Grid>
            <Grid item xs={9} md={25}>
              <Grid container spacing={3}>
                {showProductList()}
              </Grid>
            </Grid>
            </Grid>
        </div>
        
      </Container>
      <Footer />
    </div>
  );
};

export default Home;
