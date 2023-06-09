import React, { useEffect, useState } from 'react'
import { Descriptions } from 'antd';
import { HeartTwoTone } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

export default function Detail(props) {
    const [newsInfo, setNewsInfo] = useState(null)

    useEffect(() => {
        axios.get(`news/${props.match.params.id}?_expand=category&_expand=role`).then(
            res => {
                setNewsInfo({
                    ...res.data,
                    view: res.data.view + 1
                })
                return res.data
            }).then(res => {
                axios.patch(`news/${props.match.params.id}`, {
                    view: res.view + 1
                })
            })
    }, [props.match.params.id])


    const handleStar = () => {
        setNewsInfo({
            ...newsInfo,
            star: newsInfo.star + 1
        })
        axios.patch(`news/${props.match.params.id}`, {
            star: newsInfo.star + 1
        })
    }
    return (
        <div>
            {
                newsInfo && <div>
                    <div
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={
                            <div>
                                {newsInfo.category.title}
                                <HeartTwoTone twoToneColor="red"
                                    style={{ marginLeft: "10px" }}
                                    onClick={() => handleStar()} />
                            </div>}
                        style={{ border: "1px solid #f3f3f3" }}
                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者"><span style={{ color: 'black', fontWeight: 'bold' }}>{newsInfo.author}</span></Descriptions.Item>
                            <Descriptions.Item label="发布时间">{newsInfo.publishTime ? moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss") : "-"}</Descriptions.Item>
                            <Descriptions.Item label="区域">全球</Descriptions.Item>
                            <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
                            <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
                            <Descriptions.Item label="评论数量">0</Descriptions.Item>
                        </Descriptions>
                    </div>

                    <div dangerouslySetInnerHTML={
                        { __html: newsInfo.content }
                    } style={{
                        marginTop: "10px",
                        padding: "0 24px",
                        border: "1px solid #c6c6c6",
                        backgroundColor: "#fafafa",
                        minHeight: "240px"
                    }}>
                    </div>
                </div>
            }
        </div>
    )
}