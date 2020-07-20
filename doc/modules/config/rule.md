# 搜索规则定义

## 分隔符

> (空格)

## 匹配规则

tag.tagName 

> 匹配名称为 tagName的标签

class.className 

> 匹配类名包含 className的标签

Id.ID

> 匹配id为 ID 的标签

{tag, class.id}#re

> 使用正则表达式匹配

|

> 并列关系

{tag, class.id}^str1

> 用以 str1 开头的字符串匹配

{tag, class.id}$str1

> 用以 str1 结尾的字符串匹配