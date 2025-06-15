import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { WrapperHeader } from "./style";
import { Button, Form, Select, Space } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import { WrapperUploadFile } from "./style";
import { getBase64, renderOptions } from "../../utils";
import * as ProductService from '../../services/ProductService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Pending from "../PendingComponent/Pending";
import * as message from '../../components/Message/Message'
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";

const AdminProduct = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('');
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isPendingUpdate, setIsPendingUpdate] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [selectedType, setSelectedType] = useState(null);

    const [searchText, setSearchText] = useState('');

    // const [typeProducts, setTypeProducts] =useState([])
    
    const searchInput = useRef(null);


    const user = useSelector((state) => state?.user)
    
    const [stateProduct, setStateProduct] = useState({
        name: '',
        type: '',
        countInStock: '',
        price: '',
        description: '',
        rating: '',
        discount: '',
        image: '',
        newType:''
    })

    const [stateProductDetails, setStateProductDetails] = useState({
        name: '',
        type: '',
        countInStock: '',
        price: '',
        description: '',
        rating: '',
        image: '',
        discount: '',
    })

    // const [form] = Form.useForm();
    const [formCreate] = Form.useForm();
    const [formUpdate] = Form.useForm();


    const mutation = useMutationHooks(
        (data) => {
            const { name, type, countInStock, price, description, rating, discount, image } = data
            const res = ProductService.createProduct({name, type, countInStock, price, description, rating, discount,  image})
            return res
        } 
    )
    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id, token, ...rests} = data
            const res = ProductService.updateProduct(id, token, {...rests})
            return res
        },
    )
    const mutationDeleted = useMutationHooks(
        (data) => {
            const { id, token } = data
            const res = ProductService.deleteProduct(id, token)
            return res
        },
    )
    const mutationDeletedMany = useMutationHooks(
        (data) => {
            const { token, ...ids } = data
            const res = ProductService.deleteManyProduct(ids, token)
            return res
        },
    )

    const handleDeleteManyProducts = (ids) => {

        mutationDeletedMany.mutate({ids: ids, token: user?.access_token}, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
        
    }

    const  getAllProducts = async () => {
        const res = await ProductService.getAllProduct()
        return res;
    }
    
    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        return res
    }

    const {data, isPending, isSuccess, isError } = mutation
    const {data: dataUpdated, isPending: isPendingUpdated, isSuccess: isSuccessUpdated , isError: isErrorUpdated } = mutationUpdate
    const {data: dataDeleted, isPending: isPendingDeleted, isSuccess: isSuccessDeleted , isError: isErrorDeleted } = mutationDeleted
    const {data: dataDeletedMany, isPending: isPendingDeletedMany, isSuccess: isSuccessDeletedMany , isError: isErrorDeletedMany } = mutationDeletedMany

    // &&&&& RENDER DATA PRODUCT BẰNG USEQQUERY
    const queryProduct = useQuery({
        queryKey: ['products'],
        queryFn: () => getAllProducts()
    })

    const typeProduct = useQuery({
        queryKey: ['type-product'],
        queryFn: () => fetchAllTypeProduct()
    })
    

    const {isPending: isPendingProduct , data: products } = queryProduct

    const fetchGetDetailsProduct = async (rowSelected) => {
        const res = await ProductService.getDetailsProduct(rowSelected)

        if(res?.data) {
            setStateProductDetails({
                name: res?.data?.name,
                type: res?.data?.type,
                countInStock: res?.data?.countInStock,
                price: res?.data?.price,
                description: res?.data?.description,
                rating: res?.data?.rating,
                discount: res?.data?.discount,
                image: res?.data?.image,
            })
        }
        setIsPendingUpdate(false)
    }

    useEffect(() => {
        formUpdate.setFieldsValue(stateProductDetails);
    }, [formUpdate, stateProductDetails]);
    

    useEffect(() => {
        if(rowSelected && isOpenDrawer) {
            setIsPendingUpdate(true)
            fetchGetDetailsProduct(rowSelected)
        }
    }, [rowSelected, isOpenDrawer])

    const handleDetailsProduct = () => {
        setIsOpenDrawer(true) 
    }


    const renderAction = () => {
        return (
            <div>
                <DeleteOutlined style={{color:'red', fontSize: '30px', cursor: 'pointer'}} onClick={() => setIsModalOpenDelete(true)}/>
                <EditOutlined style={{color:'orange', fontSize: '30px', cursor: 'pointer'}} onClick={handleDetailsProduct}/>
            </div>
        )
    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
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
            title:'Price',
            dataIndex:'price',
            sorter: (a, b) => a.price - b.price,
            filters: [
                {
                    text: '>= 5.000.000 VNĐ',
                    value: '>='
                },
                {
                    text: '<= 5.000.000 VNĐ',
                    value: '<='
                }
            ],
            onFilter: (value, record) => {
                if ( value === '>=') {
                    return record.price >= 5000000
                }

                return record.price <= 5000000
            }
        },
        {
            title:'Rating',
            dataIndex:'rating',
            sorter: (a, b) => a.rating - b.rating,
            filters: [
                {
                    text: '>= 4',
                    value: '>='
                },
                {
                    text: '<= 4',
                    value: '<='
                }
            ],
            onFilter: (value, record) => {
                if ( value === '>=') {
                    return Number(record.rating) >= 4
                }

                return Number(record.rating) <= 4
            }
        },
        {
            title:'Type',
            dataIndex:'type',
            sorter: (a, b) => a.type.length - b.type.length,
            ...getColumnSearchProps('type')
        },

        {
            title:'Action',
            dataIndex:'Action',
            render: renderAction
        },
    ];

    const dataTable = products?.data?.length && products?.data?.map((product) => {
        return { ...product, key: product._id }
    } )


    const handleCancel = useCallback(() => {
        setIsModalOpen(false);
        setStateProduct({
            name: '',
            type: '',
            countInStock: '',
            price: '',
            description: '',
            rating: '',
            discount: '',
            image: ''
        });
        formCreate.resetFields();
    }, [formCreate]);

    const handleCloseDrawer = useCallback(() => {
        setIsOpenDrawer(false);
        setStateProductDetails({
            name: '',
            type: '',
            countInStock: '',
            price: '',
            description: '',
            rating: '',
            image: '', 
            discount:''
        });
        formUpdate.resetFields();
    }, [formUpdate]);
    

    useEffect(() => {
        if(isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
            message.success()
        } else if ( isErrorDeletedMany ) {
            message.error()
        }
    }, [isSuccessDeletedMany, isErrorDeletedMany])

    useEffect(() => {
        if(isSuccess && data?.status === 'OK') {
            message.success()
            handleCancel()
        } else if ( isError ) {
            message.error()
        }
    }, [isSuccess, isError, handleCancel])

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

    const handleCancelDelete = useCallback(() => {
        setIsModalOpenDelete(false)
    }, [])
    const handleDeleteProduct = () => {
        mutationDeleted.mutate({id: rowSelected, token: user?.access_token}, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }


    const onFinish = () => {
        const params = {
            name: stateProduct?.name,
            type: stateProduct?.type ==='add_type' ? stateProduct.newType : stateProduct.type,
            countInStock: stateProduct?.countInStock,
            price: stateProduct?.price,
            description: stateProduct?.description,
            rating: stateProduct?.rating,
            discount: stateProduct?.discount,
            image: stateProduct?.image,
        }
        mutation.mutate(params , {
            onSettled: () => {
                queryProduct.refetch()
            }
        })        
    }

    const onUpdateProduct = () => {
        mutationUpdate.mutate({id: rowSelected, token: user?.access_token, ...stateProductDetails }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const handleOnChangeAvatar = async ({fileList}) => {
        const file = fileList[0]
        if (!file.url  && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }

        setStateProduct({
            ...stateProduct,
            image: file.preview
        })
    }
    const handleOnChangeAvatarDetails = async ({fileList}) => {
        const file = fileList[0]
        if (!file.url  && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }

        setStateProductDetails({
            ...stateProductDetails,
            image: file.preview
        })
    }

    const handleOnChange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name] : e.target.value
        })
    }
    const handleOnChangeDetails = (e) => {
        setStateProductDetails({
            ...stateProductDetails,
            [e.target.name] : e.target.value
        })
    }
    
    const handleChangeSelect = (value) => { 
        setStateProduct({
            ...stateProduct,
            type: value
        })        
    }
    
    const filteredDataTable = useMemo(() => {
        if (!selectedType) return dataTable;
        return dataTable.filter(item => item.type === selectedType);
    }, [selectedType, dataTable]);

// **********************************************************************
    return(
        <div>
            <WrapperHeader>Quản lý Sản phẩm</WrapperHeader>

            {/* Lọc theo loại sản phẩm */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '20px' }}>
                <Button 
                    type={!selectedType ? 'primary' : 'default'} 
                    onClick={() => setSelectedType(null)}
                >
                    Tất cả
                </Button>
                {typeProduct?.data?.data?.map(item => (
                    <Button 
                        key={item} 
                        type={selectedType === item ? 'primary' : 'default'} 
                        onClick={() => setSelectedType(item)}
                    >
                        {item}
                    </Button>
                ))}
            </div>

            {/* Nút Thêm sản phẩm */}
            <div style={{ marginTop: '16px' }}>
                <Button 
                    style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }} 
                    onClick={() => setIsModalOpen(true)}
                >
                    <PlusOutlined style={{ fontSize: '60px' }} />
                </Button>
            </div>

            {/* Bảng sản phẩm */}
            <div style={{ marginTop: '20px' }}>
                <TableComponent 
                    handleDeleteMany={handleDeleteManyProducts}
                    columns={columns}
                    isPending={isPendingProduct}
                    data={filteredDataTable}
                    onRow={(record) => ({
                        onClick: () => setRowSelected(record._id)
                    })}
                />
            </div>

{/* THÊM */}
            <ModalComponent 
                forceRender
                title='Tạo sản phẩm' 
                open={isModalOpen} 
                // onOk={handleOk} 
                onCancel={handleCancel}
                footer={null}
            >
                <Pending isPending={isPending}>
                    <Form
                        form={formCreate}
                        name="basic"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        onFinish={onFinish}
                        autoComplete="on"
                    >
                        <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input your Name!' }]}
                        >
                        <InputComponent value={stateProduct['name']} onChange={handleOnChange} name="name"/>
                        </Form.Item>

                        <Form.Item
                        label="Type"
                        name="type"
                        rules={[{ required: true, message: 'Please input your Type!' }]}
                        >
                            <Select
                                name="type"
                                value={stateProduct?.type}
                                onChange={handleChangeSelect}
                                options={renderOptions(typeProduct?.data?.data)}
                            />
                        </Form.Item>
                        {stateProduct?.type === 'add_type' && (
                            <Form.Item
                            label="New Type"
                            name="newType"
                            rules={[{ required: true, message: 'Please input your Type!' }]}
                            >
                                <InputComponent value={stateProduct?.newType} onChange={handleOnChange} name="newType"/>
                            </Form.Item>
                        )}

                        <Form.Item
                        label="Count InStock"
                        name="countInStock"
                        rules={[{ required: true, message: 'Please input your count In Stock!' }]}
                        >
                        <InputComponent value={stateProduct?.countInStock} onChange={handleOnChange} name="countInStock"/>
                        </Form.Item>

                        <Form.Item
                        label="Price"
                        name="price"
                        rules={[{ required: true, message: 'Please input your Price!' }]}
                        >
                        <InputComponent value={stateProduct?.price} onChange={handleOnChange} name="price"/>
                        </Form.Item>

                        <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please input your Description!' }]}
                        >
                        <InputComponent value={stateProduct?.description} onChange={handleOnChange} name="description"/>
                        </Form.Item>

                        <Form.Item
                        label="Rating"
                        name="rating"
                        rules={[{ required: true, message: 'Please input your Rating!' }]}
                        >
                        <InputComponent value={stateProduct?.rating} onChange={handleOnChange} name="rating"/>
                        </Form.Item>

                        <Form.Item
                        label="Discount"
                        name="discount"
                        rules={[{ required: true, message: 'Please input your discount!' }]}
                        >
                        <InputComponent value={stateProduct?.discount} onChange={handleOnChange} name="discount"/>
                        </Form.Item>

                        <Form.Item
                        label="Image"
                        name="image"
                        rules={[{ required: true, message: 'Please input your Iamge!' }]}
                        >
                            <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1}>
                                <Button> Chọn File </Button>
                                {stateProduct?.image && (
                                    <img src={stateProduct?.image} style = {{
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
                            Submit
                        </Button>
                        </Form.Item>
                    </Form>
                </Pending>  
            </ModalComponent>

{/* SỬA */}
            <DrawerComponent
                title='Chi tiết sản phẩm' 
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
                        onFinish={onUpdateProduct}
                        autoComplete="on"
                        form={formUpdate}
                    >
                        <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input your Name!' }]}
                        >
                        <InputComponent value={stateProductDetails['name']} onChange={handleOnChangeDetails} name="name"/>
                        </Form.Item>

                        <Form.Item
                        label="Type"
                        name="type"
                        rules={[{ required: true, message: 'Please input your Type!' }]}
                        >
                        <InputComponent value={stateProductDetails?.type} onChange={handleOnChangeDetails} name="type"/>
                        </Form.Item>

                        <Form.Item
                        label="Count InStock"
                        name="countInStock"
                        rules={[{ required: true, message: 'Please input your count In Stock!' }]}
                        >
                        <InputComponent value={stateProductDetails?.countInStock} onChange={handleOnChangeDetails} name="countInStock"/>
                        </Form.Item>

                        <Form.Item
                        label="Price"
                        name="price"
                        rules={[{ required: true, message: 'Please input your Price!' }]}
                        >
                        <InputComponent value={stateProductDetails?.price} onChange={handleOnChangeDetails} name="price"/>
                        </Form.Item>

                        <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please input your Description!' }]}
                        >
                        <InputComponent value={stateProductDetails?.description} onChange={handleOnChangeDetails} name="description"/>
                        </Form.Item>

                        <Form.Item
                        label="Rating"
                        name="rating"
                        rules={[{ required: true, message: 'Please input your Rating!' }]}
                        >
                        <InputComponent value={stateProductDetails?.rating} onChange={handleOnChangeDetails} name="rating"/>
                        </Form.Item>

                        <Form.Item
                        label="Discount"
                        name="discount"
                        rules={[{ required: true, message: 'Please input your discount!' }]}
                        >
                        <InputComponent value={stateProductDetails?.discount} onChange={handleOnChangeDetails} name="discount"/>
                        </Form.Item>

                        <Form.Item
                        label="Image"
                        name="image"
                        rules={[{ required: true, message: 'Please input your Iamge!' }]}
                        >
                            <WrapperUploadFile onChange={handleOnChangeAvatarDetails} maxCount={1}>
                                <Button> Chọn File </Button>
                                {stateProductDetails?.image && (
                                    <img src={stateProductDetails?.image} style = {{
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
                title='Xóa sản phẩm' 
                open={isModalOpenDelete} 
                // onOk={handleOk} 
                onCancel={handleCancelDelete}
                onOk={handleDeleteProduct}
            >
                <Pending isPending={isPendingDeleted}>
                    <div>Bạn có chắc muốn XÓA sản phẩm này không ?</div>
                </Pending>
                
            </ModalComponent>

        </div>
    )
}

export default AdminProduct;