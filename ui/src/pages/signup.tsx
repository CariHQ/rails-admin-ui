import { useAdminGetSession } from "medusa-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import LoginCard from "../components/organisms/login-card"
import ResetTokenCard from "../components/organisms/reset-token-card"
import SEO from "../components/seo"
import PublicLayout from "../components/templates/login-layout"
import SignUp from "../components/organisms/signup-card"

const SignUpPage = () => {
  const [resetPassword, setResetPassword] = useState(false)

  const { user } = useAdminGetSession()

  const navigate = useNavigate()

  // Redirect to dashboard if user is logged in
  useEffect(() => {
    if (user) {
      navigate("/")
    }
  }, [user, navigate])

  useEffect(() => {
    if (window.location.search.includes("reset-password")) {
      setResetPassword(true)
    }
  }, [])

  const showLogin = () => {
    setResetPassword(false)
    navigate("/signup", { replace: true })
  }

  const showResetPassword = () => {
    setResetPassword(true)
  }

  return (
    <PublicLayout>
      <SEO title="signUp" />
      {resetPassword ? (
        <ResetTokenCard goBack={showLogin} />
      ) : (
        <SignUp toResetPassword={showResetPassword} />
      )}
    </PublicLayout>
  )
}

export default SignUpPage
