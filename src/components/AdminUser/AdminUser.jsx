import React, { useCallback, useEffect, useRef, useState } from "react"
import { WrapperHeader, WrapperUploadFile } from "./style";
import { Button, Form, Space } from "antd";
import { DeleteOutlined, EditOutlined , SearchOutlined } from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import Pending from "../PendingComponent/Pending";
import ModalComponent from "../ModalComponent/ModalComponent";
import { getBase64 } from "../../utils";
import { useSelector } from "react-redux";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from '../../components/Message/Message';
import * as UserService from '../../services/UserService';
import { useQuery } from "@tanstack/react-query";


const AdminUser = () => {

    const [rowSelected, setRowSelected] = useState('');
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isPendingUpdate, setIsPendingUpdate] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);

    const [searchText, setSearchText] = useState('');
    // const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);


    const user = useSelector((state) => state?.user)

    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        email: '',
        phone: '',
        isAdmin: false,
        avatar: '',
        address: ''
    })

    const [form] = Form.useForm();

    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id, token, ...rests} = data
            const res = UserService.updateUser(id,{...rests}, token )
            return res
        },
    )
    const mutationDeleted = useMutationHooks(
        (data) => {
            const { id, token } = data
            const res = UserService.deleteUser(id, token)
            return res
        },
    )
    const mutationDeletedMany = useMutationHooks(
        (data) => {
            const { token, ...ids } = data
            const res = UserService.deleteManyUser(ids, token)
            return res
        },
    )

    const handleDeleteManyUsers = (ids) => {

        mutationDeletedMany.mutate({ids: ids, token: user?.access_token}, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
        
    }

    const getAllUsers = async () => {
        const res = await UserService.getAllUser(user?.access_token)
        return res;
     } 

    const {data: dataUpdated, isPending: isPendingUpdated, isSuccess: isSuccessUpdated , isError: isErrorUpdated } = mutationUpdate
    const {data: dataDeleted, isPending: isPendingDeleted, isSuccess: isSuccessDeleted , isError: isErrorDeleted } = mutationDeleted
    const {data: dataDeletedMany, isPending: isPendingDeletedMany, isSuccess: isSuccessDeletedMany , isError: isErrorDeletedMany } = mutationDeletedMany

    // &&&&& RENDER DATA BẰNG USEQQUERY
    const queryUser = useQuery({
        queryKey: ['user'],
        queryFn: () => getAllUsers()
    })
    const {isPending: isPendingUsers , data: users } = queryUser

    const fetchGetDetailsUser = async (rowSelected) => {
        const res = await UserService.getDetailsUser(rowSelected)

        if(res?.data) {
            setStateUserDetails({
                name: res?.data?.name,
                email: res?.data?.email,
                phone: res?.data?.phone,
                isAdmin: res?.data?.isAdmin,
                avatar: res?.data?.avatar,
                address: res?.data?.address
            })
        }
        setIsPendingUpdate(false)
    }

    useEffect(() => {
        form.setFieldsValue(stateUserDetails)
    }, [form, stateUserDetails])

    useEffect(() => {
            if(rowSelected && isOpenDrawer) {
                setIsPendingUpdate(true)
                fetchGetDetailsUser(rowSelected)
            }
        }, [rowSelected, isOpenDrawer])
    

    const handleDetailsUser = () => {
        setIsOpenDrawer(true) 
    }


    const renderAction = () => {
        return (
            <div>
                <DeleteOutlined style={{color:'red', fontSize: '30px', cursor: 'pointer'}} onClick={() => setIsModalOpenDelete(true)}/>
                <EditOutlined style={{color:'orange', fontSize: '30px', cursor: 'pointer'}} onClick={handleDetailsUser}/>
            </div>
        )
    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        // setSearchText(selectedKeys[0]);
        // setSearchedColumn(dataIndex);
    };
    const handleReset = clearFilters => {
        clearFilters();
        setSearchText('');
    };


    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
                    <InputComponent
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90 }}
                    >
                    Search
                    </Button>
                    <Button
                    onClick={() => clearFilters && handleReset(clearFilters)}
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
                setTimeout(() => {
                var _a;
                return (_a = searchInput.current) === null || _a === void 0 ? void 0 : _a.select();
                }, 100);
            }
            },
        },
        }
    );


    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name')
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: (a, b) => a.email.length - b.email.length,
            ...getColumnSearchProps('email')
        },
        {
            title: 'Admin',
            dataIndex: 'isAdmin',
            filters: [
                {
                    text: 'True',
                    value: true
                },
                {
                    text: 'False',
                    value: false
                }
            ],
        },
        {
            title:'Phone',
            dataIndex:'phone',
            sorter: (a, b) => a.phone - b.phone,
            ...getColumnSearchProps('phone')
        },
        {
            title:'Address',
            dataIndex:'address',
            sorter: (a, b) => a.address - b.address,
            ...getColumnSearchProps('address')
        },
        {
            title:'Action',
            dataIndex:'Action',
            render: renderAction
        },
    ];

    const dataTable = users?.data?.length && users?.data?.map((user) => {
        return { ...user, key: user._id, isAdmin: user.isAdmin ? 'TRUE' : 'FALSE' }
    } )
    

    const handleCloseDrawer = useCallback(() => {
        setIsOpenDrawer(false);
        setStateUserDetails({
            name: '',
            email: '',
            phone: '',
            isAdmin: false,
            avatar: '',
            address: ''
        });
        form.resetFields();
    }, [form]); // Nếu form là const [form] = Form.useForm(), bạn nên dùng nó trong deps
    
    useEffect(() => {
        if(isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
            message.success()
        } else if ( isErrorDeletedMany ) {
            message.error()
        }
    }, [isSuccessDeletedMany])

    useEffect(() => {
        if(isSuccessUpdated && dataUpdated?.status === 'OK') {
            message.success()
            handleCloseDrawer()
        } else if ( isErrorUpdated ) {
            message.error()
        }
    }, [isSuccessUpdated, isErrorUpdated, handleCloseDrawer])

    useEffect(() => {
        if(isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success()
            handleCancelDelete()
        } 
        else if ( isErrorDeleted ) {
            message.error()
        }
    }, [isSuccessDeleted, isErrorDeleted])

    // const handleOk = () => {
    //     onFinish()
    // }

    const handleCancelDelete = useCallback(() => {
        setIsModalOpenDelete(false);
    }, []);
    
    const handleDeleteUser = () => {
        mutationDeleted.mutate({id: rowSelected, token: user?.access_token}, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    const onUpdateUser = () => {
        mutationUpdate.mutate({id: rowSelected, token: user?.access_token, ...stateUserDetails }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    const handleOnChangeAvatarDetails = async ({fileList}) => {
        const file = fileList[0]
        if (!file.url  && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }

        setStateUserDetails({
            ...stateUserDetails,
            avatar: file.preview
        })
    }

    const handleOnChangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name] : e.target.value
        })
    }


    return(
        <div>
            <WrapperHeader>Quản lý Người dùng</WrapperHeader>

            <div style={{marginTop: '10px'}}>
                {/* <Button 
                    style={{height:'150px', width:'150px', borderRadius:'6px', borderStyle:'dashed'}} 
                    onClick={() => setIsModalOpen(true)}
                >
                    <PlusOutlined style={{fontSize:'60px'}}/>
                </Button> */}
            </div>

            <div style={{marginTop: '20px'}}>
                <TableComponent handleDeleteMany={handleDeleteManyUsers} columns={columns} isPending={isPendingUsers} data={dataTable} onRow={(record,rowIndex) => {
                    return {
                        onClick: event => {
                            setRowSelected(record._id)
                        }
                    };
                }} />
            </div>

{/* SỬA */}
            <DrawerComponent
                title='Chi tiết Người Dùng' 
                isOpen={isOpenDrawer} 
                onClose={() => setIsOpenDrawer(false)} 
                width='80%'
                forceRender
            >
                <Pending isPending={isPendingUpdate || isPendingUpdated}>
                    <Form
                        name="basic"
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 21 }}
                        onFinish={onUpdateUser}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input your Name !' }]}
                        >
                            <InputComponent value={stateUserDetails['name']} onChange={handleOnChangeDetails} name="name"/>
                        </Form.Item>

                        <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your email !' }]}
                        >
                            <InputComponent value={stateUserDetails?.email} onChange={handleOnChangeDetails} name="email"/>
                        </Form.Item>

                        <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[{ required: true, message: 'Please input your phone-number !' }]}
                        >
                            <InputComponent value={stateUserDetails?.phone} onChange={handleOnChangeDetails} name="phone"/>
                        </Form.Item>

                        <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: 'Please input your Address !' }]}
                        >
                            <InputComponent value={stateUserDetails?.address} onChange={handleOnChangeDetails} name="address"/>
                        </Form.Item>

                        <Form.Item
                        label="Avatar"
                        name="avatar"
                        rules={[{ required: true, message: 'Please input your Iamge!' }]}
                        >
                            <WrapperUploadFile onChange={handleOnChangeAvatarDetails} maxCount={1}>
                                <Button> Chọn File </Button>
                                {stateUserDetails?.avatar && (
                                    <img src={stateUserDetails?.avatar} style = {{
                                        height: '60px',
                                        width: '60px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginLeft: '10px'
                                    }} alt="avatar" />
                                )}
                            </WrapperUploadFile>
                        </Form.Item>
                        

                        <Form.Item wrapperCol={{offset: 20, span: 16}} label={null}>
                        <Button type="primary" htmlType="submit">
                            Thay Đổi
                        </Button>
                        </Form.Item>
                    </Form>
                </Pending>
            </DrawerComponent>

{/* XÓA */}
            <ModalComponent
                forceRender
                title='Xóa' 
                open={isModalOpenDelete} 
                // onOk={handleOk} 
                onCancel={handleCancelDelete}
                onOk={handleDeleteUser}
            >
                <Pending isPending={isPendingDeleted}>
                    <div>Bạn có chắc muốn XÓA TÀI KHOẢN này không ?</div>
                </Pending>
                
            </ModalComponent>

        </div>
    )
}

export default AdminUser;