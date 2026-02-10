import React, {useEffect, useState} from 'react';
import { Modal } from 'antd';

export const ModalDialog = ({ title, children, showModal, onCloseModal }) =>
{

    return (

        <Modal
            title={title}
            open={showModal}
            onCancel={onCloseModal}
            footer={null}
        >
            <div className={' ne-body '}>

            </div>
            {children}
        </Modal>

    );
};
