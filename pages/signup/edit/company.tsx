import { CompanyFormContainer } from "../../../src/containers/CompanyFormContainer/CompanyFormContainer";
import { AuthContextProvider } from "../../../src/contexts/AuthContextProvider";
import Layout from "../../../src/page-layout/Layout";


export const SignupCompanyPage = () => {

  return (
    <AuthContextProvider>
      <Layout
        pageTitle='Company Details'
        hideMenu={false}
        pageID="signup-company-page"
      >
        <CompanyFormContainer formType={"edit"} />
      </Layout>
    </AuthContextProvider>
  )

}

export default SignupCompanyPage
