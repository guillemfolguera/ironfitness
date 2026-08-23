// models/session.model.js
const { Schema, model } = require('mongoose');
 
const sessionSchema = new Schema({
  // referencia al usuario dueño de la sesión; usamos ref para poder hacer .populate() más adelante
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  // fecha exacta en la que la sesión deja de ser válida
  expiresAt: { type: Date, required: true, index: { expires: 0 } }
});
 
module.exports = model('Session', sessionSchema)