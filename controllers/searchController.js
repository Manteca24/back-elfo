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

    // Filtros relacionados con el destinatario
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

    // Filtros generales
    if (filters) {
      const filterIds = await Filter.find({ name: { $in: filters.split(',') } }).select('_id');
      orConditions.push({
        'categories.filters': { $in: filterIds.map(filter => filter._id) },
      });
    }
    if (tags) orConditions.push({ tags: { $in: tags.split(',') } });

    // Filtros de producto
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

    // Si no hay condiciones, devuelve todo (opcional)
    if (orConditions.length === 0) {
      return res.status(200).json([]);
    }

    // Consulta con `$or`
    const query = { $or: orConditions };

    // Búsqueda de productos
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
  const { query } = req.query;  

  try {
    const products = await Product.find({
        $text: { $search: query }
      }, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } });
      // Usando un índice de texto en MongoDB
    
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
          // categorías ordenadas según la relevancia del texto buscado
  
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
      // Buscar filtros por texto que funciona mejor en mongo
      const filtersByText = await Filter.find({
        $text: { $search: query }
      }, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } });
  
      // Buscar filtros por regex en los tags porque los tags me interesa que los busque más por letras
      const filtersByRegex = await Filter.find({
        tags: { $regex: query, $options: 'i' }  // Buscando en los tags con 'i' para que no importe mayúsculas
      });
  
      // Combinar ambas búsquedas (filtros por texto y filtros por regex)
      const combinedFilters = [...filtersByText, ...filtersByRegex];
  
      // Eliminar duplicados (por si se repiten los mismos filtros en ambas búsquedas)
      const uniqueFilters = [...new Set(combinedFilters.map(f => f._id.toString()))]
        .map(id => combinedFilters.find(f => f._id.toString() === id));
  
      // Si no se encontraron filtros
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
      // Obtenemos la persona guardada
      const savedPerson = await SavedPerson.findById(personId).populate('filters');
      
      if (!savedPerson) {
        return res.status(404).json({ message: 'Persona no encontrada' });
      }
  
      // Ahora, realizamos la búsqueda de productos usando los filtros de esa persona
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