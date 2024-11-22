const Category = require('../models/Category');
const Filter = require('../models/Filter');

// Crear una nueva categoría
const createCategory = async (req, res) => {
    try {
      const { name} = req.body;
      const category = await Category.create({ name});
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la categoría' });
    }
  };

// Obtener todas las categorías
const getCategories = async (req, res) => {
    try {
      const categories = await Category.find().populate('filters');
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener categorías' });
    }
  };

// Obtener una categoría específica por ID
const getCategoryById = async (req, res) => {
    const { categoryId } = req.params;
    try {
      const category = await Category.findById(categoryId).populate('filters');
      if (!category) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la categoría' });
    }
  };

// Actualizar una categoría existente por su ID
const updateCategory = async (req, res) => {
    const { categoryId } = req.params;
    const { name} = req.body;
    try {
      const category = await Category.findByIdAndUpdate(
        categoryId,
        { name},
        { new: true }
      );
      if (!category) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la categoría' });
    }
  };

// Eliminar una categoría por su ID
const deleteCategory = async (req, res) => {
    const { categoryId } = req.params;
    try {
      const category = await Category.findByIdAndDelete(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
      }
      res.status(200).json({ message: 'Categoría eliminada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la categoría' });
    }
  };

// Añadir un filtro a una categoría
const addFilterToCategory = async (req, res) => {
    const { categoryId } = req.params;
    const { filterId } = req.body;
  
    try {
      // Buscar la categoría por id
      const category = await Category.findById(categoryId).populate('filters', 'name');
      if (!category) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
      }
  
      console.log('Categoría encontrada:', category);
  
      // Buscar el filtro por id
      const filter = await Filter.findById(filterId);
      if (!filter) {
        return res.status(404).json({ message: 'Filtro no encontrado' });
      }
  
      console.log('Filtro encontrado:', filter);
  
      // Añadir el filtro a la categoría
      category.filters.push(filterId);
      console.log('Filtro añadido a la categoría:', category.filters);
  
      // Añadir la categoría al filtro
      filter.category.push(categoryId); 
      await filter.save(); 
      console.log('Filtro actualizado con la categoría:', filter);
  
      // Guardar la categoría con el nuevo filtro
      await category.save();
      console.log('Categoría actualizada:', category);
  
      res.status(200).json(category); 
    } catch (error) {
      console.error('Error:', error); 
      res.status(500).json({ error: 'Error al añadir el filtro a la categoría' });
    }
  };

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  addFilterToCategory

};