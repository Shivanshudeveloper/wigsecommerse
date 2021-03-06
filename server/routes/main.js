const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
// Getting Module
const Products_Model = require("../models/Products");
const Cart_Model = require("../models/Cart");
const Wishlist_Model = require("../models/Wishlist");
const ProductDescription_Model = require("../models/ProductsDescription");
const Comments_Model = require("../models/Comments");
// TEST
// @GET TEST
// GET
router.get("/test", (req, res) => {
  res.send("Working");
});

// Database CRUD Operations
// @GET Request the product lists
// GET
router.get("/products", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  Products_Model.find({})
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => console.log(err));
});

// Database CRUD Operations
// @GET Request the product lists
// GET

router.get("/productsbrands/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  Products_Model.find().then((data) => {
    const temp = [];
    data.filter(item => temp.push(item.brand));

    res.json(temp.filter(temp => temp != null));
  });
});

router.get("/productsfilters/:filters", (req, res) => {
  const { filters } = req.params;
  res.setHeader("Content-Type", "application/json");

  Products_Model.find(JSON.parse(filters))
    .then((data) => {
      console.log(data)
      res.status(200).json(data);
    })
    .catch((err) => console.log(err));
});

router.get("/search/:product", (req, res) => {
  const { product } = req.params;
  const name = new RegExp(product, "i");

  res.setHeader("Content-Type", "application/json");
  Products_Model.find({
    $or: [{ name }],
  })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => console.log(err));
});

// Database CRUD Operations
// @POST Request to GET the Item
// GET
router.get("/getitemdetails/:id", (req, res) => {
  const { id } = req.params;
  res.setHeader("Content-Type", "application/json");
  Products_Model.findOne({ _id: id })
    .sort({ date: -1 })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

// Database CRUD Operations
// @POST Request to add item in cart
// POST
router.post("/additemtocart", (req, res) => {
  const { productId, userId, product } = req.body;
  Cart_Model.countDocuments({ productId: productId, userId: userId })
    .then((count) => {
      if (count === 0) {
        const newCartItem = new Cart_Model({
          productId,
          userId,
          product,
        });
        newCartItem
          .save()
          .then(() => {
            res.status(200).json("Added");
          })
          .catch((err) => res.status(500).json(`Server Error is ${err}`));
      } else {
        res.status(201).json("Added");
      }
    })
    .catch((err) => res.status(500).json("Server Error"));
});

// Database CRUD Operations
// @POST Request to GET the Item
// GET
router.get("/findallthecartitems/:userId", (req, res) => {
  const { userId } = req.params;
  res.setHeader("Content-Type", "application/json");
  Cart_Model.find({ userId: userId })
    .sort({ date: -1 })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

// Database CRUD Operations
// @GET Request to DELETE the Compare List Cart Item
// GET
router.get("/removeitemtocart/:documentId", (req, res) => {
  const { documentId } = req.params;
  res.setHeader("Content-Type", "application/json");
  Cart_Model.findOneAndDelete({ _id: documentId })
    .then((data) => {
      res.status(200).json("Removed");
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

// Database CRUD Operations
// @POST Request to add item in cart
// POST
router.post("/addtowishlistitemcart", (req, res) => {
  const { productId, userId, product } = req.body;
  Wishlist_Model.countDocuments({ productId: productId, userId: userId })
    .then((count) => {
      if (count === 0) {
        const newWishListItem = new Wishlist_Model({
          productId,
          userId,
          product,
        });
        newWishListItem
          .save()
          .then(() => {
            res.status(200).json("Added");
          })
          .catch((err) => res.status(500).json(`Server Error is ${err}`));
      } else {
        res.status(200).json("Added");
      }
    })
    .catch((err) => res.status(500).json("Server Error"));
});

// Database CRUD Operations
// @POST Request to add item in cart
// POST
router.post("/addproductcommentstore", (req, res) => {
  const { username, profilepic, comment, productId, rating } = req.body;
  const newCommnt = new Comments_Model({
    username,
    profilepic,
    comment,
    productId,
    rating,
  });
  newCommnt
    .save()
    .then((data) => {
      res.status(200).json("Added");
    })
    .catch((err) => res.status(500).json(`Server Error is ${err}`));
});

// Database CRUD Operations
// @POST Request to GET the Wish List Cart Item
// GET
router.get("/getallusercomment/:productId", (req, res) => {
  const { productId } = req.params;
  res.setHeader("Content-Type", "application/json");
  Comments_Model.find({ productId })
    .sort({ date: -1 })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

// Database CRUD Operations
// @POST Request to GET the Wish List Cart Item
// GET
router.get("/findallwishlishtcartitems/:userId", (req, res) => {
  const { userId } = req.params;
  res.setHeader("Content-Type", "application/json");
  Wishlist_Model.find({ userId: userId })
    .sort({ date: -1 })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});
router.get("/findsearchwishlishtcartitems/:userId/:product", (req, res) => {
  const { userId, product } = req.params;
  res.setHeader("Content-Type", "application/json");
  const name = new RegExp(product, "i");
  Wishlist_Model.find({ userId: userId, $or: [{ name }] })
    .sort({ date: -1 })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

// Database CRUD Operations
// @GET Request to DELETE the Compare List Cart Item
// GET
router.get("/removeitemwishlisttocart/:documentId", (req, res) => {
  const { documentId } = req.params;
  res.setHeader("Content-Type", "application/json");
  Wishlist_Model.findOneAndDelete({ _id: documentId })
    .then((data) => {
      res.status(200).json("Removed");
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

// Database CRUD Operations
// @POST Request to add item in cart
// POST
router.post("/addproduct", async (req, res) => {
  const {
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
  } = req.body;
  const newProduct = new Products_Model({
    name,
    category,
    images: downloadUrl,
    url,
    rating,
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
  });
  try {
    await newProduct.save();
    console.log(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }

  //   const newProductDescription = new ProductDescription_Model({
  //     category,
  //     brand,
  //     instocks,
  //     onsale,
  //     freeshipping,
  //     freereturn,
  //     shipfrom,
  //     length,
  //     color,
  //     price,
  //     blackowned,
  //     producttype,
  //     origin,
  //     texture,
  //     basematerial,
  //     lacetype,
  //     preplucked,
  //     bleachedKnots,
  //     babyHairs,
  //     parting,
  //     closureSize,
  //     frontalSize,
  //     density,
  //     product: newProduct,
  //   });
  //   newProductDescription
  //     .save()
  //     .then(() => {
  //       res.status(200).json("Product Added");
  //     })
  //     .catch((err) => res.status(500).json(`Server Error is ${err}`));
});

// Database CRUD Operations
// @POST Request to edit item in cart
// POST
router.patch("/editproduct/:id", async (req, res) => {
  const { id: _id } = req.params;
  const {
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
  } = req.body;

  try {
    const updatedProduct = await Products_Model.findByIdAndUpdate(
      _id,
      {
        name,
        category,
        images: downloadUrl,
        url,
        rating,
        _id,
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
      },
      {
        new: true,
      }
    );

    res.status(200).json("Product Edited");
  } catch (error) {
    res.status(409).json({ message: error.message });
  }

  //   const newProductDescription = new ProductDescription_Model({
  //     category,
  //     brand,
  //     instocks,
  //     onsale,
  //     freeshipping,
  //     freereturn,
  //     shipfrom,
  //     length,
  //     color,
  //     price,
  //     blackowned,
  //     producttype,
  //     origin,
  //     texture,
  //     basematerial,
  //     lacetype,
  //     preplucked,
  //     bleachedKnots,
  //     babyHairs,
  //     parting,
  //     closureSize,
  //     frontalSize,
  //     density,
  //     product: newProduct,
  //   });
  //   newProductDescription
  //     .save()
  //     .then(() => {
  //       res.status(200).json("Product Added");
  //     })
  //     .catch((err) => res.status(500).json(`Server Error is ${err}`));
});
router.delete("/deleteproduct/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const prod = await Products_Model.deleteOne({ _id: id });
    res.send({ message: "Product Deleted !" });
  } catch (err) {
    res.status(500).json(`Server Error is ${err}`);
  }
});
module.exports = router;
