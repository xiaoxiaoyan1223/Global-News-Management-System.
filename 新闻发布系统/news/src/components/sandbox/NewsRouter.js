import React, { useEffect, useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Spin } from 'antd';
import UserList from '../../views/sandbox/user-manage/UserList'
import Home from '../../views/sandbox/home/Home'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import RightList from '../../views/sandbox/right-manage/RightList'
import NoPermission from '../../views/sandbox/nopermission/Nopermission'
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import Published from '../../views/sandbox/publish-manage/Published'
import Sunset from '../../views/sandbox/publish-manage/Sunset'
import axios from 'axios'
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview'
import NewsUpdated from '../../views/sandbox/news-manage/NewsUpdated'
import {connect} from 'react-redux'
const LocalRouterMap = {
    "/home": Home,
    '/user-manage/list': UserList,
    "/authority-manage/role/list": RoleList,
    "/authority-manage/authority/list":RightList,
    "/news-manage/add": NewsAdd,
    "/news-manage/draft": NewsDraft,
    "/news-manage/preview/:id":NewsPreview,
    "/news-manage/update/:id":NewsUpdated,
    "/news-manage/category": NewsCategory,
    "/audit-manage/audit": Audit,
    "/audit-manage/list": AuditList,
    "/publish-manage/unpublished": Unpublished,
    "/publish-manage/published": Published,
    "/publish-manage/sunset": Sunset
}
 function NewsRouter(props) {
    const {role:{rights}}=JSON.parse(localStorage.getItem("token"))
    const [BackRouterList, setBackRouterList] = useState([])
    useEffect(() => {
        Promise.all([
            axios.get('/rights'),
            axios.get('/children')
        ]).then(res => {
            setBackRouterList([...res[0].data, ...res[1].data])
        })
    }, [])
    const checkRouter=(item)=>{
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }
    //判断当前登录用户权限列表是否包含着一栏
    const checkUserPermission=(item)=>{
        return  rights.checked.includes(item.key)
    }
    return (
        <Spin size='large' spinning={props.isLoading}>
            <Switch>
            {
                BackRouterList.map(item => 
                    {
                        if(checkRouter(item)&&checkUserPermission(item)){
                            return    <Route path={item.key} key={item.key}
                            component={LocalRouterMap[item.key]} exact/>
                        }
                        return null
                    } 
                )
            }
            <Redirect from='/' to='/home' exact />
            {
                BackRouterList.length>0 && <Route path='*' component={NoPermission} />
            }
        </Switch>
        </Spin>
        
    )
}
const mapStateToProps=({LoadingReducer:{isLoading}})=>({
    isLoading
})
export default connect(mapStateToProps)(NewsRouter)
