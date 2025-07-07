import Link from "next/link";

const SignInPanel = () => {
  return (
    <>
        <Link href={"/auth/signin"} className="font-bold">Sign In</Link>
        <Link href={"/auth/signup"} className="font-bold">Sign Up</Link>
    </>
  );
};

export default SignInPanel;