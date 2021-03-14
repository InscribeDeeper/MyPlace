# LHRFE
CS 546 Final Project 

--- 

Introduction

The website is designed to make a platform to list second-hand furniture and rent lease sublets. Users can visit the website to find their desired products at a much cheaper price and the best place to live for pursuing their education or career future. Also, users can post their unwanted goods for extra gain and sublets an apartment.

There is a potential market among students to handle used products and sublet apartments. Due to the pandemic, many students need to sublet their rents and sell their used goods. We want a website to make it easier for students to sell their goods for convenience.
On the website, a secure environment is going to be provided for users to feed themselves with timely and accurate information and post goods’ information with no worry.

--- 

DATABASE

1. Users
The user collection will store all users. Users can create names, usernames, passwords ages, email addresses, etc. In their profile. Users can also post their houses on rent, second-hand goods, and comments. All their posts and comments will be stored in arrays. 

2. Rental House
The rental house collection will contain all the posted rental sublets. Each of the sublets will be related to information about labels, locations, prices, room types, descriptions, photos, utilities, contacts. Comments, likes, dislikes will be updated after users add comments or click on “likes” or “dislikes” button.

3. Furniture
The furniture collection will contain all the posted second-hand furniture. Each of the goods will be related to information about categories, prices, locations, descriptions, photos, likes, dislikes, purchase links, contact, and sold or not. Comments, likes, dislikes will be updated after users add comments or click on “likes” or “dislikes” button.

4. Comments
The comments collection will contain all comments posted on individual furniture or individual rent. The comment will be a string. The value of “report_count” will be added by 1 after one user reports the specific comment. After the value of “report_count” reach 50, the comment will be hidden. The value of “helpful_count” will be added by 1 after one user click on the “helpful” button. 


--- 




commit format

git commit -m 'Issue #[issue number] by [username]: [Short summary of the change].'	

- 以动词开头，使用第一人称现在时，比如Change
- Start with verb(such as 'Change') with first person
- 第一个字母大写
- Captain first letter
- 结尾不加句号
- No dot at the end of sentence
- example: 
    - Add xxx feature ( 新加入的需求 )
    - Fix ( 修复 bug )
    - Change ( 完成的任务 )
    - Update ( 完成的任务，或者由于第三方模块变化而做的变化 )
	- Update tensorboard launch command in colab

Footer部分只用于两种情况：	
关联Issue 如：Issue #1, #2, #3	
关闭Issue 如：Close #1, #2, #3	

Jiaqing Jiaqing


Yixuan Wang.

