import React, { useEffect, useState,useRef } from 'react'
import { Button,  Steps, Form, Input ,Select, message,notification} from 'antd';
import  './News.css'
import axios from 'axios'
import NewsEditor from '../../../components/news-manage/NewsEditor';
const {Option}=Select
export default function NewsUpdated(props) {
  const [current, setcurrent] = useState(0)
  const [categoryList,setcategoryList]=useState([])
  const [formInfo,setformInfo]=useState({})
  const [content,setcontent]=useState('')
  const handlePrevious = () => {
    setcurrent(current-1)
  }
  const handleNext = () => {
    if (current === 0) {
      newsForm.current.validateFields().then(res => {
        setformInfo(res)
        setcurrent(current + 1)
        console.log(current);
      }).catch(error => {
        console.log(error)
      })
    } else {
      if (content === "" || content.trim() === "<p></p>") {
        message.error("新闻内容不能为空")
      } else {
        setcurrent(current + 1)
      }
    }
    // setcurrent(current+1)
  }
  useEffect(()=>{
    axios.get("/categories").then(res=>{
      setcategoryList(res.data)
    })
  },[])
  useEffect(() => {
    axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
        let {title,categoryId,content}=res.data
        //设置初始值
      newsForm.current.setFieldsValue({
        title,
        categoryId
      })
      setcontent(content)
    })
}, [props.match.params.id])
  const newsForm=useRef(null)
  const handleSave=(auditState)=>{
    axios.patch('/news',{
      ...formInfo,
      "content": content,
      "auditState": auditState,
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
      
    }).then(res=>{
      props.history.push(auditState===0?'/news-manage/draft':'/audit-manage/list')
      notification.info({
        message: `通知`,
        description:`您可以到${auditState===0?"草稿箱":"审核列表"}中查看您的新闻`,
        placement:"bottomRight",
      });
    })
  }
  return (
    <div>
      <h1 onBack={()=>props.history.goBack()}>撰写新闻</h1>
      <Steps current={current}
       items={[
        {
          title: '基本信息',
          description:'新闻标题，新闻分类',
        },
        {
          title: '新闻内容',
          description:'新闻主体内容',
        },
        {
          title: '新闻提交',
          description:'保存草稿或者提交审核',
        },
      ]}>
      </Steps>
      <div style={{ marginTop: "50px" }}>
        <div className={current === 0 ? '' :'hidden'}>
          <Form
            name="basic"
            ref={newsForm}
            labelCol={{
              span: 2,
            }}
            wrapperCol={{
              span: 20,
            }}
            initialValues={{
              remember: true,
            }}
            autoComplete="off"
            // ref={newsForm}
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[
                {
                  required: true,
                  message: '请输入新闻标题',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="新闻分类"
              name="categortId"
              rules={[
                {
                  required: true,
                  message: '请选择新闻的分类',
                },
              ]}
            >
              <Select>
                {
                  categoryList.map(item=>
                    <Option value={item.id} key={item.id}>{item.title}</Option>
                  )
                }
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className={current===1 ?'':'hidden'}>  
          <NewsEditor getContent={(value)=>{
            // console.log(value);
            setcontent(value)
          }} content={content}></NewsEditor>
        </div>
        <div className={current===2?'':'hidden'}></div>
      </div>

      <div style={{ marginTop: "50px" }}>
        {
          current === 2 && <span>
            <Button type='primary' onClick={()=>{handleSave(0)}} style={{margin:"10px"}}>保存草稿箱</Button>
            <Button type='danger' onClick={()=>{handleSave(1)}} style={{margin:"10px"}}>提交审核</Button>
          </span>
        }
        {
          current < 2 && <Button type='primary' onClick={()=>handleNext()}>下一步</Button>
        }
        {
          current > 0 && <Button onClick={()=>handlePrevious()}>上一步</Button>
        }
      </div>
    </div>
  )
}
