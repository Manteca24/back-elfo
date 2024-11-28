const Category = require('../models/Category');
const Filter = require('../models/Filter');

// crear filtro
const createFilter = async (req, res) => {
    try {
      const { name } = req.body;
      const filter = await Filter.create({ name });
      res.status(201).json(filter);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el filtro' });
    }
  }

// obtener todos los filtros
const getFilters = async (req, res) => {
    try {
      const filters = await Filter.find().populate('category', 'name');
      console.log(filters)
      res.status(200).json(filters);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener filtros' });
    }
  }

  // añadir tags al filtro
  const addTagsToFilter = async (req, res) => {
    try {
      const { filterId } = req.params;
      const { tags } = req.body;
  
      //!! Normalizar tags
      const normalizeTag = (tag) => {
        return tag
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .trim();
      };
  
      // Normalizamos todos los tags antes de agregarlos
      const normalizedTags = tags.map(tag => normalizeTag(tag));
  
      const filter = await Filter.findById(filterId);
      
      // Agregar los tags normalizados SIN usar Set (para permitir repeticiones)
      filter.tags.push(...normalizedTags);
  
      await filter.save();
      res.status(200).json(filter);
    } catch (error) {
      res.status(500).json({ error: 'Error al añadir tags al filtro' });
    }
  };

  // función recomendada para organización en el front, 
  const getFiltersGroupedByCategory = async (req, res) => {
    try {
      // Obtenemos las categorías y sus filtros asociados
      const categories = await Category.find().populate('filters'); 
  
      // Estructuramos los datos
      const result = categories.map((category) => ({
        _id: category._id,
        name: category.name,
        filters: category.filters.map((filter) => ({
          _id: filter._id,
          name: filter.name,
        })),
      }));
  
      // Enviamos los datos estructurados
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener filtros agrupados por categoría' });
    }
  };

module.exports = {
    createFilter,
    getFilters,
    addTagsToFilter,
    getFiltersGroupedByCategory
}