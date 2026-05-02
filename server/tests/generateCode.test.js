process.env.SUPABASE_URL = "https://dummy.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY = "dummy";
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

describe('Code generation logic', () => {
  it('should use crypto.randomInt instead of Math.random in meetingController', () => {
    const source = fs.readFileSync(path.join(__dirname, '../controllers/meetingController.js'), 'utf8');
    expect(source).not.toContain('Math.random()');
    expect(source).toContain('crypto.randomInt');
  });

  it('should use crypto.randomInt instead of Math.random in classroomController', () => {
    const source = fs.readFileSync(path.join(__dirname, '../controllers/classroomController.js'), 'utf8');
    expect(source).not.toContain('Math.random()');
    expect(source).toContain('crypto.randomInt');
  });
});
