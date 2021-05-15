# 写route注意事项: 
## 在第一次写route的时候, 一定要先写好下面这个以方便之后调试. 
- 因为可以清楚的输出当前的 方法和路径, 从而知道调试那个function. 或者知道是不是进入到了自己想要的 route
```js
 res.json({ route: '/private/dashboard', method: req.method });
 ```





# <font color = green>这里记录 note 和笔记 和信息沟通</font>

-   seeds 文件已经 有一部分样本, 等完成了自己的 DB function 可以模仿 并测试: npm run seeds
-   在调用的时候, 一个文件管一个 collections 的理念. 然后 collections 之间的互动的 function 写在 shareUtilsDB.js 这个文件中

---

# 待解决问题


---
## overall features in JS
- 可以转换颜色
- (-)不给看其他人的profile
- (-)link furniture 和 rental (在对应网页下, 显示从属关系)
- error checking
	- 在写完views之后再去修改, 添加

### User Example
#### DB 部分
- 建立一个 favor_furnitureID 的字段 
- 建立一个 favor_rentalID 的字段
#### js 部分
1. signup
2. 
3. Dashboard: 类似于AMZ的 很多个 div, 然后通过点击 这些div 进入到对应的模块
	- my comments: 可以看user做出的 所有的comments 记录, 有修改和删除button
	- my furniture/rental: 可以看到自己相关的 furniture和 rental的list, 可以点进去 (这里有两个页面)
		- 这里需要筛选对应ID的 furniture的 name
		- 这里需要筛选对应ID的 rental的location
	- my favor:  进入收藏夹list (就不要浏览记录了)
	- my profile: 可以看到自己的相关信息, 并且有edit 按钮
		- edit Myprofile: 可以去修改自己的信息

4. updateProfile

```json
(User = {
	"_id": "user_collection_id_1",
	"firstName": "sherlock",
	"lastName": "holmes",
	"userName": "sh",
	"age": 32,
	"email": "sh@stevens.edu",
	"hashed_pw": "encoding passwords",
	"comments_id": ["comment_collection_id_1", "comment_collection_id_12"],
	"furniture_id": ["furniture_id1", "furniture_id2"],
	"rental_id": ["rental_id1", "rental_id2"],
	"selfSummary": "",
	"favor_furniture_id": ["furniture_id1", "furniture_id4"], 
	"favor_rental_id": ["rental_id1", "rental_id5"], 
	"acessHistory": {"furniture_id": [], "rental_id": []}
})
```

### rental Example
#### DB 部分
- refer furniture 但是具体显示的内容需要修改, 可以合作完成
#### js 部分
- refer furniture



```json
rental界面(
	(rental = {
		"_id": "rental_id1",
		"user_id": "user_collection_id_1",
		"comments_id": ["comment_collection_id_101", "comment_collection_id_102"],
		"location": "123 Washington St",
		"price": 1000,
		"bedroom": 2,
		"bathroom": 2,
		"space": 85,
		"description": "long paragraph string",
		"photos": ["binary_file1", "binary_file2"],
		"utility": "string",
		"like": ["user_id1", "user_id2", "user_id3"],
		"dislike": ["user_id4", "user_id5", "user_id6"],
		"labels": ["warm", "big", "cheap", "luxury", "convenient", ""],
		"contact": "vx_abcd / 155 564 1235"
	})
)
```

### Furniture Example

#### DB 部分

-   需要在 shareUtilsDB 中 添加 toggleUserToFurniture func : 作为 like 和 dislike, toggle 的时候考虑是否 已经记录过 在 like/dislike 的合集里面
-   需要在 shareUtilsDB 中 添加 toggleCommentToFurniture func
-   需要写 DB update 的部分
-   photo 怎么保存, 怎么 load from DB
- 	添加名字字段

*   DB delete 部分暂时不用写, demo 用不上
*   belong_rentalId: null // 可以用这个 从 家具界面跳到
*   own_furnitureId: []

#### js 部分

1.  list 界面, 需要把所有 furniture 展现出来, 有一定

    - 筛选(离散): [category, sold];
    - sort(连续): [price, like, dislike]
	- (-) location filter : API 距离?? googlemap

2.  single 界面, 需要展现所有的内容, 
- 排版之后再说 - <font color=red>怎么通过 location 去弄 一个 google map</font> 
- photo 展现, src, DB 里面存的是 link 
- 能够saved到 favor的 btn, 这里用到的也是 toggleFn.favorFurnitureByUser(userID, furnitureId)
- (-)显示地图

```json "image": { "medium": "https://static.tvmaze.com/uploads/images/medium_portrait/81/202627.jpg", "original": "https://static.tvmaze.com/uploads/images/original_untouched/81/202627.jpg" } <!-- - 我们自己创建这些虚拟的样本的时候, --> ```

- 显示所有的 comments, 这部分应该也是 js - like / dislike button - like / dislike summary - 展现 user 想要的相关信息

    >  {report btn 不考虑先, 他需要一个单独的collecitons}
    > {相似的商品推荐? 这个太难了}
    > {review 高频形容词 统计出来, 然后弄一个 wordcloud 的形式  
    > display 出来}

3.  new 界面, 需要创建一个新的 furniture
    - 这里需要通过 form 输入到 DB
    - 写 view 的 form 的过程具体需要的 field, 参考 create furniture function


```json
(Furniture = {
	"_id": "furniture_id1",
	"user_id": "user_collection_id_1",
	"name": "desktop",
	"comments_id": ["comment_collection_id_1232", "comment_collection_id_1234"],
	"category": ["electronics", "computer"],
	"location": "1253 Garden St",
	"price": 10,
	"description": "long paragraph string",
	"photos": ["binary_file1", "binary_file2"],
	"like": ["user_id1", "user_id2", "user_id3"],
	"dislike": ["user_id4", "user_id5", "user_id6"],
	"purchase_link": "https://www.amazon.com/gp/product/B07TZSCDJD/ref=ppx_yo_dt_b_asin_image_o00_s00?ie=UTF8&psc=1",
	"sold": FALSE,
	"contact": "vx_abcd / 155 564 1235"
})
```

### Comment Example
#### DB 部分
- create function 需要添加 rating 字段, timestamp 字段
- 


#### js 部分
1. create 的时候, 需要离开当前页面吗? 离开更简单, 如果不离开的话, 可能要用到上节课讲的 AJAX 
2. 修改评论, 把原有create的界面的 value load 回来

```json
(Comment = {
	"_id": "comment_collection_id_1",
	"user_id": "user_collection_id_1",
	"comment": "this is the comment for xxx",
	"report_count": 5,
	"helpful_count": 24,
	"rating":5,
	"timestamp": "2020/12/23", // 保存内置函数的 Now 的字符串形式就行
})
```


---

past event 

# pitch的frame
- 明晚11点? 讨论? 如果可以就录了

1. Intro: 参考proposal, 但是pre的对象是investor, 所以得从投资回报的角度去intro (考虑市场需求的角度 去吹水)
2. core features: 参考ToDO.md, 里面每个部分的 js 部分(来源是 views)
3. extra features: 参考ToDO.md, fancy 的特点, 在本文档用 (-) 标记出来了
4. Value of product: 
	- 目标用户群
	- 产品的价值是什么, 怎么用信息创造收益
		- 会员? 会有特权? 卖权限?
			- 可以多post 几个rental
			- 头像边框?? V
			- 具体内容不讲
		- 广告? 
			- 会员免广告
		- 目前不是交易平台, 可以之后往这个方向发展? 
		- Donate
		- 用的人越多 价值越高
	- 为什么需要被投资? 
		- 留学生很多, 而且还可以拓展到其他国家的留学生
		- 正规去到
	- 竞争对象: 没有, 因为目前都是在微信上share, 没有正规的网页竞争
	- SWOT analysis, Porter’s 5 Forces
		- strength: 整合平台, 竞争力强, 免费, 用户群体集中, 不要交钱, 信息交流平台, 
		- weakness: 现在没钱 不成熟, 用户不能稳定, 3年没了
		- opportunity: 
		- Threats: 竞争ebay
5. summary
	- 没有demo
