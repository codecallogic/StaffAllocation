import Nav from './Navigation'
import SystemAdminSettings from './SystemAdminSettings'
import { useState } from 'react'

const SystemAdmin = ({
  currentUser,
  allUsers,
  setAllUsers,
  removeCookie
}) => {
  console.log(allUsers)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState('')
  const [message, setMessage] = useState('')
  
  return (
    <>
      <Nav
        removeCookie={removeCookie}
      >
      </Nav>
      <SystemAdminSettings
        error={error}
        setError={setError}
        loading={loading}
        setLoading={setLoading}
        message={message}
        setMessage={setMessage}
        allUsers={allUsers}
        setAllUsers={setAllUsers}
        currentUser={currentUser}
      >
      </SystemAdminSettings>
    </>
  )
}

export default SystemAdmin
