const db = require('../models/index.js');
console.log('DB keys:', Object.keys(db));
if (db.default) {
    console.log('DB default keys:', Object.keys(db.default));
}
