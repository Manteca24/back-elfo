const SavedPerson = require('../models/SavedPerson');
const getUserFromFirebaseUid = require('../utils/userUtils');

// Crear una persona guardada
const addSavedPerson = async (req, res) => {
  const { name, gender, ageRange, relation, filters } = req.body;
  console.log(req.body)

  try {
    const user = await getUserFromFirebaseUid(req.uid);

    if (!Array.isArray(filters) || filters.some(f => !f.filterId)) {
      return res.status(400).json({ message: 'Estructura de filtros inválida' });
    }

    if (!gender || !ageRange || !relation) {
      return res.status(400).json({ message: 'Género, rango de edad y relación son obligatorios' });
    }

    const savedPerson = await SavedPerson.create({
      userId: user._id,
      name,
      gender,
      ageRange,
      relation,
      filters
    });

    user.savedPeople.push(savedPerson._id);
    await user.save();

    res.status(201).json(savedPerson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la persona guardada' });
  }
};

// Obtener personas guardadas de un usuario
const getSavedPeople = async (req, res) => {
  try {
    const user = await getUserFromFirebaseUid(req.uid);

    const savedPeople = await SavedPerson.find({ userId: user._id }).populate({
      path: 'filters.filterId',
      select: 'name tags',
    });

    res.status(200).json(savedPeople);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las personas guardadas' });
  }
};

// Actualizar los tags de un filtro en una persona guardada
const updateTags = async (req, res) => {
  const { personId, filterId } = req.params;
  const { tags } = req.body;

  try {
    const user = await getUserFromFirebaseUid(req.uid);
    const person = await SavedPerson.findById(personId);

    if (!person) return res.status(404).json({ message: 'Persona guardada no encontrada' });
    if (person.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para actualizar esta persona guardada' });
    }

    // Buscar el filtro específico dentro de la persona
    const filter = person.filters.find(f => f.filterId.toString() === filterId);
    if (!filter) {
      return res.status(404).json({ message: 'Filtro no encontrado en esta persona' });
    }

    // Actualizar los tags del filtro
    filter.tags = tags;
    await person.save();

    res.status(200).json({ message: 'Tags actualizados', savedPerson: person });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar los tags' });
  }
};

// Eliminar una persona guardada
const removeSavedPerson = async (req, res) => {
  const { personId } = req.params;

  try {
    const user = await getUserFromFirebaseUid(req.uid);
    const person = await SavedPerson.findById(personId);

    if (!person) return res.status(404).json({ message: 'Persona no encontrada' });
    if (person.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta persona guardada' });
    }

    await SavedPerson.findByIdAndDelete(personId);

    // Eliminar la persona de la lista del usuario
    user.savedPeople = user.savedPeople.filter(p => p.toString() !== personId);
    await user.save();

    res.status(200).json({ message: 'Persona eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la persona guardada' });
  }
};

module.exports = { addSavedPerson, getSavedPeople, removeSavedPerson, updateTags };