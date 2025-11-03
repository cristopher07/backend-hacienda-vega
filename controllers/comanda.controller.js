
const ComandaService = require('../services/comanda.services');

exports.create = async (req, res) => {

  const data = req.body;
  // Si es un array, guardar cada comanda
  if (Array.isArray(data)) {
    console.log("---data save: ", data);
    let results = [];
    for (const obj of data) {
        console.log("---obj individual: ", obj);
      const result = await ComandaService.create(obj);
      results.push(result);
    }
    res.json({ success: true, results });
  } else {
    // Si es solo un objeto, guardar normalmente
    const result = await ComandaService.create(data);
    res.json(result);
  }
};

const successMessages = {
  SUCCESS_FINDALL: 'Comandas encontradas correctamente.'
};
const errorMessages = {
  ERROR_FINDALL: 'Error al buscar comandas.'
};

exports.findAll = async (req, res) => {
  const result = await ComandaService.findAll(req.query);
  if (result.success) {
    res.status(200).json({ ok: true, data: result.data, msg: successMessages.SUCCESS_FINDALL });
  } else {
    res.status(400).json({ ok: false, msg: errorMessages.ERROR_FINDALL });
  }
};

exports.findAllComandasQuery = async (req, res) => {
  const result = await ComandaService.findAllComandasQuery(req.query);
  if (result.success) {
    res.status(200).json({ ok: true, data: result.data, msg: 'Comandas enriquecidas encontradas correctamente.' });
  } else {
    res.status(400).json({ ok: false, msg: 'Error al buscar comandas enriquecidas.' });
  }
};

exports.findById = async (req, res) => {
  const { id_comanda } = req.params;
  const result = await ComandaService.findById(id_comanda);
  res.json(result);
};

exports.updateById = async (req, res) => {
  const { id_comanda } = req.params;
  const obj = req.body;
  const result = await ComandaService.updateById(id_comanda, obj);
  res.json(result);
};

exports.deleteById = async (req, res) => {
  const { id_comanda } = req.params;
  const result = await ComandaService.deleteById(id_comanda);
  res.json(result);
};