import React from "react"
import { WrapperHeader } from "./style";
import { Button, Form, Space } from "antd";
import {  SearchOutlined } from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import { useSelector } from "react-redux";
import * as OrderService from '../../services/OrderService';
import { useQuery } from "@tanstack/react-query";
import { orderContant } from "../../contant";
import PieChartComponent from "./PieChart";
import { convertPrice } from "../../utils";

const OrderAdmin = () => {
    const user = useSelector((state) => state?.user)

    const [form] = Form.useForm();

    const getAllOrder = async () => {
        const res = await OrderService.getAllOrder(user?.access_token)
        return res;
     } 

    // &&&&& RENDER DATA BẰNG USEQQUERY
    const queryOrder = useQuery({
        queryKey: ['orders'],
        queryFn: () => getAllOrder()
    })
    const {isPending: isPendingOrders , data: orders } = queryOrder


    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
                    <InputComponent
                    // ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    // onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                    type="primary"
                    // onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90 }}
                    >
                    Search
                    </Button>
                    <Button
                    // onClick={() => clearFilters && handleReset(clearFilters)}
                    size="small"
                    style={{ width: 90 }}
                    >
                    Reset
                    </Button>
                    
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        filterDropdownProps: {
            onOpenChange(open) {
            if (open) {
                // setTimeout(() => {
                // var _a;
                // return (_a = searchInput.current) === null || _a === void 0 ? void 0 : _a.select();
                // }, 100);
            }
            },
        },
        }
    );


    const columns = [
        {
            title: 'Tên khách hàng',
            dataIndex: 'userName',
            sorter: (a, b) => a.userName.length - b.userName.length,
            ...getColumnSearchProps('userName')
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            sorter: (a, b) => a.phone.length - b.phone.length,
            ...getColumnSearchProps('phone')
        },
        {
            title:'Địa chỉ giao hàng',
            dataIndex:'address',
            sorter: (a, b) => a.address.length - b.address.length,
            ...getColumnSearchProps('address')
        },
        {
            title:'Đã vận chuyển',
            dataIndex:'isDelivered',
            sorter: (a, b) => a.isDelivered.length - b.isDelivered.length,
            ...getColumnSearchProps('isDelivered')
        },
        {
            title:'Hình thức thanh toán',
            dataIndex:'paymentMethod',
            sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
            ...getColumnSearchProps('paymentMethod')
        },
        {
            title:'Đã thanh toán',
            dataIndex:'isPaid',
            sorter: (a, b) => a.isPaid.length - b.isPaid.length,
            ...getColumnSearchProps('isPaid')
        },
        {
            title:'Tổng giá trị',
            dataIndex:'totalPrice',
            sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
            ...getColumnSearchProps('totalPrice')
        },
    ];

    const dataTable = orders?.data?.length && orders?.data?.map((order) => {
        return { ...order, 
            key: order._id, 
            userName : order?.shippingAddress?.fullName,
            phone : order?.shippingAddress?.phone,
            address : order?.shippingAddress?.address,
            paymentMethod: orderContant.payment[order?.paymentMethod],
            isPaid: order?.isPaid ? 'TRUE' : 'FALSE',
            isDelivered: order?.isDelivered ? 'TRUE' : 'FALSE',
            totalPrice: convertPrice(order?.totalPrice)
        }
    } )


    return(
        <div>
            <WrapperHeader>Quản lý Đơn hàng</WrapperHeader>

            <div style={{ height: '200px', width: '200px'}}>
                <PieChartComponent data={orders?.data}/>
            </div>

            <div style={{marginTop: '20px'}}>
                <TableComponent columns={columns} isPending={isPendingOrders} data={dataTable} />
            </div>
        </div>
    )
}

export default OrderAdmin;