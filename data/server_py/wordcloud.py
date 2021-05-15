#encode:utf-8
# ?? 可以弄 comments的 wordcloud吗

# 如果可以, 要怎样才能输出?
#  返回高频词 很容易
# 但是要怎样可视化 是不是有什么工具

# 这里要写好对应的命令调用工具, 
# 即先用python文件写好 命令行调用的方法, 然后在联系这里


import pymongo
import sys

for i in range(len(sys.argv)):
    print('arg'+str(i),sys.argv[i])
    
