import React from "react";
import {faClose, faSyncAlt} from "@fortawesome/free-solid-svg-icons";
import {Button} from "@/components/Buttons.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Header = ({children}) => {
    return <div className={'w-full h-[40px] '}>
        {children}
    </div>;
}
const Content = ({children}) => {
    return <div className={'w-full h-[calc(100%-120px)]'}>
        {children}
    </div>;
}

const Footer = ({children}) => {
    return <div className={'w-full h-[80px]'}>
        {children}
    </div>;
}
export const CollapsibleRightMenu = ({onClose, children}) => {
    return (
        <div className="bg-white fixed z-[99999] right-0 w-[500px] h-full p-6">
            <Header>
                <FontAwesomeIcon className={'cursor-pointer absolute right-[30px]'} icon={faClose} onClick={onClose} />
            </Header>
            <Content>
                {children}
            </Content>
            <Footer>
                <Button type="submit" className={' bg-pink-500! absolute right-[50px]'} onClick={onClose}>Cerrar</Button>
            </Footer>
        </div>
    );
}

