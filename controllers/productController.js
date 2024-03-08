const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAllProducts = async (req, res) => {
  const { name, price, categoryName } = req.query;
  let queryObject = {};

  if (name) queryObject.name = { $regex: name, $options: 'i' };
  if (price) queryObject.price = { $gte: price.split('-')[0], $lte: price.split('-')[1] || price };

  try {
    let products = Product.find(queryObject).populate('category');

    if (categoryName) {
      products = products.where('category.name').equals(categoryName);
    }

    const results = await products;
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





exports.createProduct = async (req, res) => {
  const { name, description, price, inStock, category: categoryName } = req.body;
  
  try {
    const existingProduct = await Product.findOne({ name: { $regex: '^' + name.trim() + '$', $options: 'i' } });
    if (existingProduct) {
      return res.status(409).json({ message: 'Product with this name already exists' });
    }
    const categoryObj = await Category.findOne({ name: { $regex: '^' + categoryName.trim() + '$', $options: 'i' } });

    if (!categoryObj) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const product = new Product({
      name,
      description,
      price,
      inStock,
      category: categoryObj._id
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { name, description, price, inStock } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { name, description, price, inStock }, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(204).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
