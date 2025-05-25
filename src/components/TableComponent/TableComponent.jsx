import { Dropdown, Space, Table } from "antd";
import React, { useState } from "react"
import Pending from "../PendingComponent/Pending";
import { DownOutlined } from "@ant-design/icons";



const TableComponent = (props) => {

    const {selectionType = 'checkbox', data = [] , isPending= false, columns = [], handleDeleteMany } = props
    const [rowSelectedKeys, setRowSelectedKeys ] = useState([])

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowSelectedKeys(selectedRowKeys)
        },

        // getCheckboxProps: (record) => ({
        //     disabled: record.name === 'Disable User',
        //     name: record.name
        // }),
    }

    const items = [
        {
            key: '1',
            label: (
                <a target="_blank">
                    1
                </a>
            )
        },
        {
            key: '2',
            label: (
                <a target="_blank">
                    2
                </a>
            )
        },
    ]

    const handleDeleteAll = () => {
        handleDeleteMany(rowSelectedKeys)
    }

    return(
        <Pending isPending={isPending}>

            {rowSelectedKeys.length > 0 && (
                <div style={{
                    background: '#1d1ddd',
                    color:'#fff',
                    fontWeight: 'bold',
                    padding: '10px',
                    cursor: 'pointer'
                }}
                
                    onClick={handleDeleteAll}
                >
                    {/* <Dropdown menu={{ items }}>
                        <a>
                            <Space> */}
                                XÓA TẤT CẢ
                                {/* <DownOutlined/>
                            </Space>
                        </a>
                    </Dropdown> */}
                </div>
            )}

            
            <Table
                rowSelection={{
                type: selectionType,
                    ...rowSelection,
                }}
                columns={columns}
                dataSource = {data}
                {...props}
            />
        </Pending>  
    )   
}

export default TableComponent;