import { AppstoreOutlined, CommentOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import React, { useState } from "react";
import { getItem } from "../../utils";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import AdminUser from "../../components/AdminUser/AdminUser";
import AdminProduct from "../../components/AdminProduct/AdminProduct";
import OrderAdmin from "../../components/OrderAdmin/OrderAdmin";
import AdminComment from "../../components/AdminComment/AdminComment";

const AdminPage = () => {

    const items = [
        getItem( 'Người dùng','user' , <UserOutlined/> ),

        getItem( 'Sản phẩm','product' , <AppstoreOutlined/> ),

        getItem( 'Đơn hàng','order' , <ShoppingCartOutlined/> ),

        getItem( 'Bình luận','comment' , <CommentOutlined /> ),
    ];

    const [ keySelected ,setKeySelected ] = useState('')

    const  renderPage = (key) => {
        switch (key) {
            case 'user':
                return(
                    <AdminUser/>
                )
            case 'product':
                return(
                    <AdminProduct/>
                )
            case 'order':
                return(
                    <OrderAdmin/>
                )
            case 'comment':
                return(
                    <AdminComment/>
                )
    
            default:
                return <></>
        }
    }

    const handleClick = ({ key }) => {
        setKeySelected(key)
    }

    return (
        <>
            <HeaderComponent isHiddenSearch isHiddenCart/>
        
        <div style={{display: 'flex'}}>
            <Menu
                mode="inline"
                style={{
                    width: 256,
                    boxShadow: '1px 1px 2px #ccc',
                    height: '100vh'
                }}
                items={items}
                onClick={handleClick}
            />

             <div style={{flex: 1, padding: '15px'}}>
            {/* Chứa những data */}
                {renderPage(keySelected)}
             </div>
        </div>
        </>
        
    )
}

export default AdminPage;