import { Navbar, Footer } from "@/components/navbar";import { AuthForm } from "@/components/auth-form";
export default function LoginPage(){return <><Navbar/><main><div className="container"><AuthForm mode="login"/></div></main><Footer/></>}
