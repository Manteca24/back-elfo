const SavedPerson = require('../models/SavedPerson');
const User = require('../models/User');

// Crear una persona guardada
const addSavedPerson = async (req, res) => {
    const { userId } = req.params;
    const { name, filters, tags } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
  
      const savedPerson = await SavedPerson.create({ userId, name, filters, tags });
      user.savedPeople.push(savedPerson._id);
      await user.save();
  
      res.status(201).json(savedPerson);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al crear la persona guardada' });
    }
  };

  // Actualizar los tags de una persona guardada
const updateTags = async (req, res) => {
    const { personId } = req.params;
    const { tags } = req.body;
  
    try {
      const person = await SavedPerson.findById(personId);
      if (!person) return res.status(404).json({ message: 'Persona guardada no encontrada' });
  
      person.tags = tags;
      await person.save();
  
      res.status(200).json({ message: 'Tags actualizados', savedPerson: person });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar los tags' });
    }
  };


// Obtener personas guardadas de un usuario
const getSavedPeople = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const savedPeople = await SavedPerson.find({ userId }).populate('filters');
      res.status(200).json(savedPeople);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener las personas guardadas' });
    }
  };
  
  // Eliminar una persona guardada
  const removeSavedPerson = async (req, res) => {
    const { personId } = req.params;
  
    try {
    const person  = await SavedPerson.findByIdAndDelete(personId)

      if (!person) return res.status(404).json({ message: 'Persona no encontrada' });
  
      res.status(200).json({ message: 'Persona eliminada' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al eliminar la persona guardada' });
    }
  };
  
  module.exports = { addSavedPerson, getSavedPeople, removeSavedPerson, updateTags };