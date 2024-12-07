const Product = require('../models/Product');
const Category = require('../models/Category');
const Filter = require('../models/Filter');
const SavedPerson = require('../models/SavedPerson');


// BUSCADOR GENERAL

const searchGifts = async (req, res) => {
  try {
    const {
      gender,
      ageRange,
      relation,
      type,
      purchaseLocation,
      price,
      filters,
      tags
    } = req.query;
    console.log(req.query)

    const orConditions = [];

    if (gender && gender !== 'no relevante') orConditions.push({ gender });
    if (ageRange) orConditions.push({ ageRange });

    if (relation) {
      const category = await Category.findOne({ name: relation });
      if (category) {
        orConditions.push({
          categories: {
            $elemMatch: { category: category._id },
          },
        });
      }
    }

    if (filters) {
      const filterIds = await Filter.find({ name: { $in: filters.split(',') } }).select('_id');
      orConditions.push({
        'categories.filters': { $in: filterIds.map(filter => filter._id) },
      });
    }
    if (tags) orConditions.push({ tags: { $in: tags.split(',') } });

    if (type) orConditions.push({ type });
    if (purchaseLocation) orConditions.push({ 'purchaseLocation.ubication': purchaseLocation });
    if (price) {
      const priceRanges = {
        low: { $lte: 20 },
        medium: { $gt: 20, $lte: 50 },
        high: { $gt: 50, $lte: 100 },
        luxury: { $gt: 100 },
      };
      orConditions.push({ price: priceRanges[price] });
    }

    if (orConditions.length === 0) {
      return res.status(200).json([]);
    }

    const query = { $or: orConditions };

    const products = await Product.find(query)
      .populate('categories.category', 'name') // Opcional
      .populate('categories.filters', 'name') // Opcional
      .select('-comments') // Opcional
      .exec();

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al realizar la búsqueda' });
  }
};


// products
const searchProducts = async (req, res) => {
  let { query } = req.query;  
  query = query.trim().replace(/[\*\+\/\-\.\^\$\(\)\\]/g, "");
  try {
    const products = await Product.find({
        $text: { $search: query }
      }, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } });
    
    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No se encontraron productos' });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar productos' });
  }
};

// categories
const searchCategories = async (req, res) => {
    const { query } = req.query;
  
    try {
        const categories = await Category.find({
            $text: { $search: query }
          }, { score: { $meta: "textScore" } })
          .sort({ score: { $meta: "textScore" } });
  
      if (!categories || categories.length === 0) {
        return res.status(404).json({ message: 'No se encontraron categorías' });
      }
  
      res.status(200).json(categories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al buscar categorías' });
    }
  };


// filters -esto me ha salido espectacular
const searchFilters = async (req, res) => {
    const { query } = req.query;
  
    try {
      const filtersByText = await Filter.find({
        $text: { $search: query }
      }, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } });
  
      const filtersByRegex = await Filter.find({
        tags: { $regex: query, $options: 'i' }  
      });
  
      const combinedFilters = [...filtersByText, ...filtersByRegex];
  
      const uniqueFilters = [...new Set(combinedFilters.map(f => f._id.toString()))]
        .map(id => combinedFilters.find(f => f._id.toString() === id));
  
      if (!uniqueFilters || uniqueFilters.length === 0) {
        return res.status(404).json({ message: 'No se encontraron filtros' });
      }
  
      res.status(200).json(uniqueFilters);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al buscar filtros' });
    }
  };

  // buscar por persona
  const searchByFilters = async (req, res) => {
    const { personId } = req.params;
  
    try {
      const savedPerson = await SavedPerson.findById(personId).populate('filters');
      
      if (!savedPerson) {
        return res.status(404).json({ message: 'Persona no encontrada' });
      }
  
      const filters = savedPerson.filters;
      const filterIds = filters.map(filter => filter._id);
  
      const products = await Product.find({
        filters: { $in: filterIds }
      });
  
      if (products.length === 0) {
        return res.status(404).json({ message: 'No se encontraron productos' });
      }
  
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al buscar productos con filtros' });
    }
  };
  


module.exports = {
  searchGifts,
  searchProducts,
  searchCategories,
  searchFilters,
  searchByFilters
};