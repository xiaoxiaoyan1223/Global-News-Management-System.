import React, { useEffect,useState } from 'react'
import { Card, Col, Row, List } from 'antd';
import axios from 'axios'
import _ from 'lodash'
export default function News() {
    const [list,setlist]=useState([])
    useEffect(() => {
        axios.get("/news?publishState=2&_expand=category").then(res => {
            console.log(res.data);
            setlist(Object.entries(_.groupBy(res.data,item=>item.category.title)))
        })
    })
    return (
        <div style={{
            width: "95%",
            margin: '0 auto'
        }}>
            <h1>全球大新闻<span>查看新闻</span></h1>
            <Row gutter={16}>
                {
                    list.map(item=>
                        <Col span={8} key={item[0]}>
                            <Card title={item[0]} bordered={true}>
                                <List
                                    size="small"
                                    bordered
                                    dataSource={item[1]}
                                    //在卡片里面支持分页
                                    pagination={{
                                        pageSize: 3
                                    }}
                                    renderItem={(data) => <List.Item><a href={`#/detail/${data.id}`}>{data.title}</a></List.Item>}
                                />
                            </Card>
                        </Col>
                        )
                }
            </Row>
        </div>
    )
}
