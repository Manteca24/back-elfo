const Filter = require('../models/Filter'); 

// este controlador funciona pero está pendiente a ver si funciona como quiero que funcione
const getRecommendedTags = async (req, res) => {
    try {
      const { filterId } = req.params;
  
      const filter = await Filter.findById(filterId);
      const tags = filter.tags;
  
      // Contar las repeticiones de cada tag
      const tagCounts = tags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {});
  
      // Ordenar los tags por cantidad de repeticiones en orden descendente
      const sortedTags = Object.entries(tagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count);
  
    //   // Tomar solo los 5 más repetidos
    //   const topTags = sortedTags.slice(0, 5);
  
      res.status(200).json(sortedTags); // topTags muestra 5, sortedTags muestra todos, con el número de repeticiones
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los tags recomendados' });
    }
  };

module.exports = { getRecommendedTags };