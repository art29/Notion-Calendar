'use client'

import Button, {ButtonProps} from "@/components/Button";
import {signIn} from "next-auth/react";

const SignInButton = ({children, ...rest}: ButtonProps) => {
    return (
        <Button {...rest} onClick={() => signIn('notion')}>{children}</Button>
    )
}

export default SignInButton;