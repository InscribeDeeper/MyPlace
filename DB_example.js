// Example User JSON
User = {
    "_id": "user_collection_id_1",
    "first_name": "first",
    "last_name": "last",
    "user_name": "myname",
    "age": 12,
    "email": "xxx@stevens.edu",
    "hashed_pw": "jfldjaf24kjdslk12414afjlsaj",
    "comments_id": ["comment_collection_id_1", "comment_collection_id_12"],
    "furniture_id": ["furniture_id1", "furniture_id2"],
    "rental_id": ["rental_id1", "rental_id2"],
}


// Example Rental house JSON
Rental_house = {
    "_id": "rental_id1",
    "user_id": "user_collection_id_1",
    "comment_id": ["comment_collection_id_101","comment_collection_id_102"],
    "location": "123 Washington St", // google map 
    "price": 1000,
    "bedroom": 2,
    "bathroom": 2,
    "space": 85, // square feet unit should be unify
    "description": "long paragraph string",
    "photos": ["binary_file1", "binary_file2"],
    "utility": "string",
    "like": 20,
    "dislike": 4,
    "labels": ["warm", "big", "cheap", "luxury", "convenient", ""],
    "contact": "vx_abcd / 155 564 1235"
}

// Example Furniture JSON
Furniture = {
    "_id": "furniture_id1",
    "user_id": "user_collection_id_1", 
    "comment_id": ["comment_collection_id_1232", "comment_collection_id_1234",],
    "category": ["electronics", "computer"], // refer amazon
    "location": "1253 Garden St", // google map 
    "price": 10, 
    "description": "long paragraph string", // used age 4/10  // search by descrption match
    "photos": ["binary_file1", "binary_file2"],
    "like": 20,
    "dislike": 4,
    "purchase_link": "https://www.amazon.com/gp/product/B07TZSCDJD/ref=ppx_yo_dt_b_asin_image_o00_s00?ie=UTF8&psc=1",
    "sold": FALSE,
    "contact": "vx_abcd / 155 564 1235"
}


// Example Comment JSON
Comment = {
    "_id": "comment_collection_id_1",
    "user_id": "user_collection_id_1",
    "comment": "this is the comment for xxx",
    "report_count": 5,
    "helpful_count": 24, // refer amazon
}
 









