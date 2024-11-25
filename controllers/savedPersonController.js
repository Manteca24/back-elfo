const SavedPerson = require('../models/SavedPerson');

// Crear una persona guardada
const addSavedPerson = async (req, res) => {
    const { name, filters, tags } = req.body;
  
    try {
      const user = await getUserFromFirebaseUid(req.user.firebaseUid);

      const savedPerson = await SavedPerson.create({ userId: user._id, name, filters, tags });
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
        const user = await getUserFromFirebaseUid(req.user.firebaseUid);  // Aquí buscamos el usuario por su firebaseUid
        const person = await SavedPerson.findById(personId);

        if (!person) return res.status(404).json({ message: 'Persona guardada no encontrada' });
        if (person.userId.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'No tienes permiso para actualizar esta persona guardada' });
        }

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
  try {
      const user = await getUserFromFirebaseUid(req.user.firebaseUid); // Aquí buscamos al usuario
      const savedPeople = await SavedPerson.find({ userId: user._id }).populate('filters');
      
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
        const user = await getUserFromFirebaseUid(req.user.firebaseUid); // Buscar al usuario por firebaseUid
        const person = await SavedPerson.findById(personId);

        if (!person) return res.status(404).json({ message: 'Persona no encontrada' });
        if (person.userId.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'No tienes permiso para eliminar esta persona guardada' });
        }

        await SavedPerson.findByIdAndDelete(personId);

        // eliminar la persona guardada de la lista del usuario
        user.savedPeople = user.savedPeople.filter(p => p.toString() !== personId);
        await user.save();

        res.status(200).json({ message: 'Persona eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la persona guardada' });
    }
};
  
  module.exports = { addSavedPerson, getSavedPeople, removeSavedPerson, updateTags };