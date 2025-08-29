import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import { MODAL_TYPE } from 'panel/helpers/constants';
import { FormContent } from './FormContent';
import { FormFooter } from './FormFooter';

export type FormValues = {
    enabled: boolean;
    name: string;
    url: string;
};

const defaultValues: FormValues = {
    enabled: true,
    name: '',
    url: '',
};

type Props = {
    closeModal: () => void;
    onSubmit: (values: FormValues) => void;
    processingAddFilter: boolean;
    processingConfigFilter: boolean;
    whitelist?: boolean;
    modalType: string;
    toggleFilteringModal: ({ type }: { type?: keyof typeof MODAL_TYPE }) => void;
    selectedSources?: Record<string, boolean>;
    initialValues?: Partial<FormValues>;
};

export const Form = ({
    closeModal,
    processingAddFilter,
    processingConfigFilter,
    whitelist,
    modalType,
    toggleFilteringModal,
    selectedSources,
    onSubmit,
    initialValues,
}: Props) => {
    const methods = useForm({
        defaultValues: {
            ...defaultValues,
            ...initialValues,
        },
        mode: 'onBlur',
    });
    const { handleSubmit } = methods;
    const [activeTab, setActiveTab] = useState('manual');

    const handleCancel = () => {
        closeModal();
        setTimeout(() => {
            toggleFilteringModal(undefined);
        }, 300);
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="modal-body modal-body--filters">
                    <FormContent
                        modalType={modalType}
                        whitelist={whitelist}
                        selectedSources={selectedSources}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                </div>

                <FormFooter
                    modalType={modalType}
                    activeTab={activeTab}
                    processingAddFilter={processingAddFilter}
                    processingConfigFilter={processingConfigFilter}
                    onCancel={handleCancel}
                />
            </form>
        </FormProvider>
    );
};
