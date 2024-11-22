const Filter = require('../models/Filter');

const createFilter = async (req, res) => {
    try {
      const { name } = req.body;
      const filter = await Filter.create({ name });
      res.status(201).json(filter);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el filtro' });
    }
  }

const getFilters = async (req, res) => {
    try {
      const filters = await Filter.find().populate('category', 'name');
      console.log(filters)
      res.status(200).json(filters);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener filtros' });
    }
  }

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


module.exports = {
    createFilter,
    getFilters,
    addTagsToFilter
}