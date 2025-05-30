import React, { Fragment, useCallback, useEffect, useState } from 'react';
// import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { routes } from './routes';
import DefaultComponent from './components/DefaultComponent/DefaultComponent';
import { isJsonString } from './utils';
import { jwtDecode } from 'jwt-decode';
import * as UserService from './services/UserService'
import { useDispatch, useSelector } from 'react-redux';
import { resetUser, updateUser } from './redux/slides/userSlide';
import Pending from './components/PendingComponent/Pending';

function App() {
  const dispatch = useDispatch();
  const [isPending, setIsLoading] = useState(false)
  const user = useSelector((state) => state.user)

  const handleGetDetailsUser = useCallback( async (id, token) => {
    let storageRefreshToken = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storageRefreshToken)

    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser( { ...res?.data, access_token: token , refreshToken: refreshToken} ) )
  }, [dispatch] );

  useEffect(() => {
    setIsLoading(true)
    const { storageData, decoded } = handleDecoded()
              
    if(decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData)
    }
    setIsLoading(false)
  }, []);

  const handleDecoded = () => {
    let storageData = user?.access_token || localStorage.getItem('access_token')

    let decoded = {}

    if(storageData && isJsonString(storageData) && !user?.access_token) {
      storageData = JSON.parse(storageData)

      decoded = jwtDecode(storageData)
      
    }
    return {decoded, storageData}
  }

  UserService.axiosJWT.interceptors.request.use(async (config) => {
    const currentTime = new Date()

    const { decoded } = handleDecoded()

    let storageRefreshToken = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storageRefreshToken)
    const decodedRefreshToken = jwtDecode(refreshToken)

    if ( (decoded?.exp) < (currentTime.getTime() / 1000) ) {
      if ( decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
        const data = await UserService.refreshToken(refreshToken)
        config.headers['token'] = `Bearer ${data?.access_token}`
      }
      else {
        dispatch(resetUser())
      }
    }
    return config;
  }, (err) => {
    return Promise.reject(err)
  })

  

  return (
    <div>
      <Pending isPending={isPending}>
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page

              const isCheckAuth = !route.isPrivate || user.isAdmin

              const Layout = route.isShowHeader ? DefaultComponent : Fragment

  // Fragment: Dùng để bọc các phần tử ( viết tắt <> </>)
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    isCheckAuth ? (
                      <Layout>
                        <Page />
                      </Layout>
                    ) : (
                      <div style={{fontSize: '50px'}}>403 - Không có quyền truy cập</div>
                    )
                  }
                />
              );
            })}
          </Routes>
        </Router>
      </Pending>
    </div>
  )
}

export default App;
