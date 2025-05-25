import { message } from 'antd';

const success = (mes = 'Success') => {
    console.log('✅ Success:', mes);
    message.success(mes);
};

const error = (mes = 'Error') => {
    console.log('❌ Error:', mes);
    message.error(mes);
};
  
const warning = (mes = 'Warning') => {
    console.log('⚠️ Warning:', mes);
    message.warning(mes);
};

export { success, error, warning };
