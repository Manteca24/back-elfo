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
  const { name, filters } = req.body;

  try {
    // Encuentra la categoría existente
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    // Actualiza el nombre de la categoría
    if (name) {
      category.name = name;
    }

    // Asegúrate de que los filtros sean strings
    const normalizedFilters = filters.map((filter) =>
      typeof filter === 'string' ? filter : filter.name
    );

    const updatedFilters = [];
    for (const filterName of normalizedFilters) {
      let filter = await Filter.findOne({ name: filterName });

      if (!filter) {
        // Si no existe el filtro, lo crea
        filter = new Filter({ name: filterName, category: [category._id] });
        await filter.save();
      } else if (!filter.category.includes(category._id)) {
        // Si el filtro ya existe pero no está vinculado a la categoría, lo actualiza
        filter.category.push(category._id);
        await filter.save();
      }

      updatedFilters.push(filter._id);
    }

    // Vincula los filtros actualizados a la categoría
    category.filters = updatedFilters;
    await category.save();

    res.status(200).json(category);
  } catch (error) {
    console.error("Error actualizando categoría:", error);
    res.status(500).json({ error: "Error al actualizar la categoría" });
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

// Añadir un filtro a una categoría // para poner tags a las categorías ?
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