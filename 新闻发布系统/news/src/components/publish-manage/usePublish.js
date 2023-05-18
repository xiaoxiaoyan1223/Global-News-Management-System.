import {useEffect,useState} from 'react'
import {notification} from 'antd'
import axios from 'axios'
function usePublish(type){
    const {username}=JSON.parse(localStorage.getItem('token'))
    const [dataSource,setdataSource]=useState([])
    const handlePublish=(id)=>{
        setdataSource(dataSource.filter(item=>item.id!==id))
        axios.patch(`/news/${id}`,{
            "publishState":2,
            "publishTime":Date.now()
          }).then(res=>{
            notification.info({
              message:`通知`,
              description:
              `您可以到草稿箱中查看到您的新闻`,
              placement:'bottomRight'
            })
          })
    }
    const handleSunset=(id)=>{
        setdataSource(dataSource.filter(item=>item.id!==id))
        axios.patch(`/news/${id}`,{
            "publishState":3,
            "publishTime":Date.now()
          }).then(res=>{
            notification.info({
              message:`通知`,
              description:
              `您可以到[发布管理/已下线]中查看到您的新闻`,
              placement:'bottomRight'
            })
          })
        
    }
    const handleDelete=(id)=>{
        setdataSource(dataSource.filter(item=>item.id!==id))
        axios.delete(`/news/${id}`).then(res=>{
            notification.info({
              message:`通知`,
              description:
              `您已经删除了您的新闻`,
              placement:'bottomRight'
            })
          })
    }
    useEffect(()=>{
      // publishState=1 待发布
      axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then(res=>{
        setdataSource(res.data)
      })
    },[username,type])
    return{
    dataSource,
    handleDelete,
    handlePublish,
    handleSunset
    }
}
export default usePublish
 