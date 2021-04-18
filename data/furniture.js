
// Furniture = {
//     "_id": "furniture_id1",
//     "user_id": "user_collection_id_1", 
//     "comment_id": ["comment_collection_id_1232", "comment_collection_id_1234",],
//     "category": ["electronics", "computer"], // refer amazon
//     "location": "1253 Garden St", // google map 
//     "price": 10, 
//     "description": "long paragraph string", // used age 4/10  // search by descrption match
//     "photos": ["binary_file1", "binary_file2"],
//     "like": 20,
//     "dislike": 4,
//     "purchase_link": "https://www.amazon.com/gp/product/B07TZSCDJD/ref=ppx_yo_dt_b_asin_image_o00_s00?ie=UTF8&psc=1",
//     "sold": FALSE,
//     "contact": "vx_abcd / 155 564 1235"
// }

const mongoCollections = require('../config/mongoCollections');
const furniture = mongoCollections.furniture;
const uuid = require('uuid');

async function getByFurnitureId(id){
     
     const furnitureCollection = await furniture();
     const theFurniture = await furnitureCollection.findOne({_id:id});

     if(!theFurniture) throw 'the book is not found in books data';
     return theFurniture;
}

async function Create(user_id, comment_id, category, location, price, description, photos, likes, dislike, purchase_link, sold, contact){
     // check for title
     // if(!title) throw 'title is not defined.';
     // if(typeof title != 'string') throw `${title} is not a string.`;
     
     // if(!authorFirstName) throw 'authorFirstName is not defined.';
     // if(typeof authorFirstName != 'string') throw `${authorFirstName} is not a string`;

     // if(!authorLastName) throw 'authorLastName is not defined.';
     // if(typeof authorLastName!= 'string') throw `${authorLastName} is not a string`;

     // if(!genre) throw 'genre is not defined.';
     // if(!Array.isArray(genre)) throw 'genre shall be an array.';
     // for(let x of genre)
     //      if(typeof x != 'string') throw `all elements in genere must be a string. ${x} is not a string`;

     // if(!datePublished) throw 'publishing date is not defined.';
     // if(!datePublished.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/g)) throw 'the date is invalid';

     // if(!summary) throw 'summary is not defined.';
     // if(typeof summary != 'string') throw `${summary} is not a string`;

     // if(title.trim().length == 0 || authorFirstName.trim().length == 0 || authorLastName.trim().length == 0 || genre.length == 0 || summary.trim().length == 0)
     //      throw 'parameters can not be empty';

     // add to collection
     const furnitureCollection = await furniture();

     let newBook = {
          _id:uuid.v4(),
          comment_id:[], 
          category:[], 
          location, 
          price, 
          description, 
          photos:[], 
          likes, 
          dislike, 
          purchase_link, 
          sold, 
          contact   
     }
     // console.log(typeof newBook._id + "book")
     // console.log(newBook._id + "book") 
     const newInsertedBook = await booksCollection.insertOne(newBook);
     if (newInsertedBook.insertedCount === 0) throw 'Insert failed!';
     // console.log(typeof newInsertedBook.insertedId + " book create")
     return await this.getByBookId(newInsertedBook.insertedId);
}