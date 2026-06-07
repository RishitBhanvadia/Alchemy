const { error } = require('../utils/response');

const validators = {
  reaction: (data) => {
    const errors = [];
    const { chem_a, chem_b, chem_c, chem_i } = data;
    
    const values = [
      { name: 'chem_a', val: chem_a },
      { name: 'chem_b', val: chem_b },
      { name: 'chem_c', val: chem_c },
      { name: 'chem_i', val: chem_i },
    ];
    
    for (const { name, val } of values) {
      const num = Number(val);
      if (val === undefined || val === null) {
        errors.push(`${name} is required.`);
      } else if (isNaN(num)) {
        errors.push(`${name} must be a number.`);
      } else if (num < 0 || num > 100) {
        errors.push(`${name} must be between 0 and 100.`);
      }
    }
    return errors;
  },

  aiExplain: (data) => {
    const errors = [];
    const { chemicals, reaction_outcome, student_question } = data;
    
    if (!chemicals || typeof chemicals !== 'object') {
      errors.push('chemicals is required and must be an object.');
    }
    if (!reaction_outcome || typeof reaction_outcome !== 'string') {
      errors.push('reaction_outcome is required.');
    }
    if (!student_question || typeof student_question !== 'string') {
      errors.push('student_question is required.');
    } else if (student_question.length > 500) {
      errors.push('student_question must be under 500 characters.');
    }
    return errors;
  },

  createClassroom: (data) => {
    const errors = [];
    const { name } = data;
    
    if (!name || typeof name !== 'string') {
      errors.push('name is required.');
    } else if (name.trim().length === 0) {
      errors.push('name cannot be empty.');
    } else if (name.trim().length > 100) {
      errors.push('name must be under 100 characters.');
    }
    return errors;
  },

  joinClassroom: (data) => {
    const errors = [];
    const { code } = data;
    
    if (!code || typeof code !== 'string') {
      errors.push('code is required.');
    } else if (!/^[A-Z0-9]{5}$/.test(code.toUpperCase())) {
      errors.push('code must be 5 alphanumeric characters.');
    }
    return errors;
  },

  logExperiment: (data) => {
    const errors = [];
    const { chem_a, chem_b, chem_i, chem_c, reaction_id, outcome_label, module } = data;
    
    const values = [
      { name: 'chem_a', val: chem_a },
      { name: 'chem_b', val: chem_b },
      { name: 'chem_i', val: chem_i },
      { name: 'chem_c', val: chem_c },
    ];
    
    for (const { name, val } of values) {
      const num = Number(val);
      if (val === undefined || val === null) {
        errors.push(`${name} is required.`);
      } else if (isNaN(num)) {
        errors.push(`${name} must be a number.`);
      } else if (num < 0 || num > 100) {
        errors.push(`${name} must be between 0 and 100.`);
      }
    }
    
    if (!reaction_id) errors.push('reaction_id is required.');
    if (!outcome_label) errors.push('outcome_label is required.');
    
    return errors;
  },
};

exports.validate = (schemaName) => (req, res, next) => {
  const validator = validators[schemaName];
  if (!validator) {
    console.warn(`[validate] Unknown schema: ${schemaName}`);
    return next();
  }

  const errors = validator(req.body);
  if (errors.length > 0) {
    return error(res, 'VALIDATION_ERROR', errors.join(' '), 400);
  }
  next();
};
