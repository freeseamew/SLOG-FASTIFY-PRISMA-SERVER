import schemaType from '../lib/typeHelper.js';

const restMessage = {
  success: schemaType.boolean,
  code: schemaType.integer,
  message: schemaType.string 
}

export {
  restMessage,
}