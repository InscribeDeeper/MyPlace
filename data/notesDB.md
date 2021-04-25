# <font color = green>这里记录 note 和笔记 和信息沟通</font>

-   seeds 文件已经 有一部分样本, 等完成了自己的 DB function 可以模仿 并测试: npm run seeds
-   在调用的时候, 一个文件管一个 collections 的理念. 然后 collections 之间的互动的 function 写在 shareUtilsDB.js 这个文件中

---

# 待解决问题

To 杨威：

-   在你这里面记得加一个 addRentalToUser 和 removeRentalToUser 的函数. 我发现我们这个 project 还是得用 sub-document 比较好可能？
    -   A: 用 shareUtilsDB 中 的 toggle function

---

# DB samples

### User Example

-   update the selfSummary field

```json
(User = {
	"_id": "user_collection_id_1",
	"first_name": "sherlock",
	"last_name": "holmes",
	"user_name": "sh",
	"age": 32,
	"email": "sh@stevens.edu",
	"hashed_pw": "encoding passwords",
	"comments_id": ["comment_collection_id_1", "comment_collection_id_12"],
	"furniture_id": ["furniture_id1", "furniture_id2"],
	"rental_id": ["rental_id1", "rental_id2"],
	"selfSummary": ""
})
```

### rental Example

```json
+ own_furnitureId: [] // 可以用这个 从 家具界面跳到 rental界面

(rental = {
	"_id": "rental_id1",
	"user_id": "user_collection_id_1",
	"comment_id": ["comment_collection_id_101", "comment_collection_id_102"],
	"location": "123 Washington St",
	"price": 1000,
	"bedroom": 2,
	"bathroom": 2,
	"space": 85,
	"description": "long paragraph string",
	"photos": ["binary_file1", "binary_file2"],
	"utility": "string",
	"like": 20,
	"dislike": 4,
	"labels": ["warm", "big", "cheap", "luxury", "convenient", ""],
	"contact": "vx_abcd / 155 564 1235"
})
```

### Furniture Example

```json
+ belong_rentalId: null // 可以用这个 从 家具界面跳到 rental界面


(Furniture = {
	"_id": "furniture_id1",
	"user_id": "user_collection_id_1",
	"comment_id": ["comment_collection_id_1232", "comment_collection_id_1234"],
	"category": ["electronics", "computer"],
	"location": "1253 Garden St",
	"price": 10,
	"description": "long paragraph string",
	"photos": ["binary_file1", "binary_file2"],
	"like": 20,
	"dislike": 4,
	"purchase_link": "https://www.amazon.com/gp/product/B07TZSCDJD/ref=ppx_yo_dt_b_asin_image_o00_s00?ie=UTF8&psc=1",
	"sold": FALSE,
	"contact": "vx_abcd / 155 564 1235"
})
```

### Comment Example

```json
(Comment = {
	"_id": "comment_collection_id_1",
	"user_id": "user_collection_id_1",
	"comment": "this is the comment for xxx",
	"report_count": 5,
	"helpful_count": 24 // refer amazon
})
```
