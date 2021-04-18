const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const furniture = data.furniture;

const main = async () => {
  const db = await dbConnection();
  await db.dropDatabase();
/** start of the testing code */ 
// function Create(category:[], location, price, description, photos:[], purchase_link, sold, contact) 没有customer_id，like和dislike
const f1 = await furniture.Create(["f","u"], "a", 20, "good",[],"b", false, 123)
console.log(f1);

/** End of the testing code */  
  console.log('Done seeding database');
  await db.serverConfig.close();
};

main().catch(console.log);