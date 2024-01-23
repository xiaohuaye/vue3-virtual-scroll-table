# vue3-virtual-scroll-table
针对vue3的可变高虚拟滚动表格

v0.0.1 支持宽度计算，表格宽度传值如未传则默认为100%，传值为`${number}px`或者`number`则均为固定宽度，传值为`${number}%`则为百分比宽度。column中的width属性和table的width属性规则

table 宽度为百分比 -- column 宽度为百分比 : 按照百分比计算
                 -- column 宽度为固定值 : 按照未设置宽度计算，未设置宽度则为平均分配剩余宽度

table 宽度为固定值 -- column 宽度为固定值 : 按照固定值计算
                 -- column 宽度为百分比 : 按照百分比转化为固定值计算，未设置宽度则为平均分配剩余宽度