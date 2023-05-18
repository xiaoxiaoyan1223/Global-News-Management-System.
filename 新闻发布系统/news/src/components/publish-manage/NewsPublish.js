import React from 'react'
import { Table } from 'antd'
// import { Switch } from 'react-router-dom'
export default function NewsPublish(props) {
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render:(item)=>{
        return <a href={`#/news-manage/preview`}>{item.title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author'
    },
    {
      title: '新闻分类',
      dataIndex:'category',
      render:(category)=>{
        return <div>
            {category.title}
        </div>
      }
    },
    {
      title: '操作',
      render:(item)=>{
        return <div>
         {props.button}
        </div>
      }
    },
  ];
  return (
    <div>
      <Table columns={columns}
      dataSource={props.dataSource}
      pagination={{
        pageSize:5
      }}
      rowKey={item=>item.id} />
    </div>
  )
}
