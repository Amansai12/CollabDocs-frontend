

import { Route, Routes } from 'react-router-dom'

import DocumentViewer from './pages/DocumentViewer'

import { SignupPage } from './pages/SignUp'
import { SigninPage } from './pages/SignIn'
import { useEffect, useState } from 'react'
import { BACKEND_URL } from './config'
import { useRecoilState} from 'recoil'
import { authAtom } from './store/auth'
import { FileLoader } from './components/ui/Loader'
import MyDocs from './pages/MyDocs'
import Verification from './components/Verification'
import LandingPage from './pages/LandingPage'
import AboutPage from './pages/About'


function App() {
  const [auth,setAuth] = useRecoilState(authAtom);
  const[loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        //await new Promise(resolve => setTimeout(resolve, 2000));
        const response = await fetch(`${BACKEND_URL}/user/me`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const userData = await response.json();
          setAuth(userData)
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
      finally{
        setLoading(false);
      }
    };
    if(!auth?.user){
      fetchUserData()
    }
  },[])

  if(loading) {
    return <div className='h-[100vh] flex items-center justify-center'><FileLoader /></div>
  }

  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/verify/:token' element={<Verification />} />
        <Route path='/mydocs' element={<MyDocs />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/signin' element={<SigninPage />} />
        <Route path='/document/:id' element={<DocumentViewer />} />
      </Routes>
    </>
  )
}

export default App
