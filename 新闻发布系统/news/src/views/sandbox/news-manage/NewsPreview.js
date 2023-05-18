import React, { useEffect, useState } from 'react'
import { Button, Descriptions, } from 'antd';
import axios from 'axios';
import moment from 'moment';
export default function NewsPreview(props) {
    const [newsInfo, setnewsInfo] = useState(null)
    const auditList=['未审核','审核中','已通过','未通过']
    const publishList=['未发布','待发布','已上线','已下线']
    const colorList=['black','orange','green','red']
    useEffect(() => {
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
            setnewsInfo(res.data)
        })
    }, [props.match.params.id])
    return (
        <div>
            {
                newsInfo && <div>
                    <div
                        ghost={false}
                        onBack={() => window.history.back()}
                        title={newsInfo?.title}
                        subTitle="This is a subtitle"
                        extra={[
                            <Button key="3">Operation</Button>,
                            <Button key="2">Operation</Button>,
                            <Button key="1" type="primary">
                                Primary
                            </Button>,
                        ]}
                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                            <Descriptions.Item label="创建时间">{moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss")}</Descriptions.Item>
                            <Descriptions.Item label="发布时间">{newsInfo.publishTime?moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss"):'-'}</Descriptions.Item>
                            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                            <Descriptions.Item label="审核状态"><span style={{color:colorList[newsInfo.auditState]}}>{auditList[newsInfo.auditState]}</span></Descriptions.Item>
                            <Descriptions.Item label="发布状态"><span style={{color:colorList[newsInfo.pbulishState]}}>{publishList[newsInfo.pbulishState]}</span></Descriptions.Item>
                            <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
                            <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
                            <Descriptions.Item label="评论数量">0</Descriptions.Item>
                        </Descriptions>
                    </div>
                    <div>
                        {newsInfo.content}
                    </div>
                </div>
            }
        </div>
    )
}
