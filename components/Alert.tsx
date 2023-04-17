import {ReactElement} from "react";

interface AlertProps {
    children: ReactElement
    theme?: 'danger'
}

const Alert = ({children, theme = 'danger'}: AlertProps) => {

    const themeStyle = (): string => {
        switch (theme) {
            case 'danger':
                return 'border-red-400 text-red-500 bg-red-100';
            default: {
                throw new Error(`Unhandled theme: ${theme}`);
            }
        }
    }

    return (
        <div className={`w-full text-sm p-3 my-4 border rounded ${themeStyle()}`}>
            {children}
        </div>
    )
}

export default Alert;